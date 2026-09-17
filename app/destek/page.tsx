"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Building2,
  Calculator,
  ChevronDown,
  CreditCard,
  LifeBuoy,
  Repeat,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  ApiError,
  addSupportMessage,
  closeSupportTicket,
  createSupportTicket,
  listMySupportTickets,
  type SupportTicketCategory,
  type SupportTicketRow,
} from "@/lib/auth-client";
import { CustomSelect } from "@/components/custom-select";
import { faqGroups } from "@/lib/faq-data";

// OPEN: kullanici yazdi, destek ekibi henuz yanitlamadi.
// IN_PROGRESS: destek ekibi yanitladi, kullanicinin onayi/kapatmasi bekleniyor
// (48 saat icinde yanit gelmezse otomatik CLOSED'a geciyor, bkz. backend).
const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Beklemede", className: "bg-gold/15 text-gold-deep" },
  IN_PROGRESS: { label: "Cevaplandı", className: "bg-emerald-100 text-emerald-700" },
  RESOLVED: { label: "Çözüldü", className: "bg-emerald-100 text-emerald-700" },
  CLOSED: { label: "Kapalı", className: "bg-parchment text-ink-soft" },
};

const CATEGORY_OPTIONS: { value: SupportTicketCategory; label: string }[] = [
  { value: "PAYMENT", label: "Ödeme" },
  { value: "TECHNICAL", label: "Teknik Sorun" },
  { value: "ACCOUNT", label: "Hesap" },
  { value: "EMAIL_PHONE_CHANGE", label: "E-posta/Telefon Değiştir" },
  { value: "OTHER", label: "Diğer" },
];

const CATEGORY_LABELS: Record<SupportTicketCategory, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((o) => [o.value, o.label]),
) as Record<SupportTicketCategory, string>;

// faqGroups (lib/faq-data.ts) /sss ile PAYLASILAN gercek icerik — burada
// linkle baska sayfaya atmak yerine dogrudan arama+kategori filtresiyle
// gomulu (inline) gosteriliyor (Koinly'nin destek merkezindeki gibi).
const GROUP_ICONS: Record<string, typeof Calculator> = {
  "Vergi ve hesaplama": Calculator,
  "Güvenlik ve veri": ShieldCheck,
  "Borsalar ve entegrasyon": Repeat,
  "Hesap ve fiyatlandırma": CreditCard,
};

// Tek bir soruya sigmayan, daha derin konular icin ikincil rehber linkleri.
const DEEP_DIVE_LINKS = [
  { title: "Nasıl Çalışır", icon: BookOpen, href: "/nasil-calisir" },
  { title: "Güvenlik", icon: ShieldCheck, href: "/guvenlik" },
  { title: "Fiyatlandırma", icon: CreditCard, href: "/fiyatlandirma" },
  { title: "Mali Müşavirler İçin", icon: Users, href: "/mali-musavirler" },
  { title: "İşletmeler İçin", icon: Building2, href: "/isletmeler" },
];

function normalize(s: string) {
  return s
    .toLocaleLowerCase("tr")
    .replace(/[ıİ]/g, "i")
    .replace(/[şŞ]/g, "s")
    .replace(/[ğĞ]/g, "g")
    .replace(/[üÜ]/g, "u")
    .replace(/[öÖ]/g, "o")
    .replace(/[çÇ]/g, "c");
}

function DestekPageInner() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as SupportTicketCategory | null;
  const [tickets, setTickets] = useState<SupportTicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTicket, setOpenTicket] = useState<SupportTicketRow | null>(null);
  const [notAuthenticated, setNotAuthenticated] = useState(false);

  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const filteredGroups = useMemo(() => {
    const q = normalize(query.trim());
    return faqGroups
      .filter((g) => !activeGroup || g.title === activeGroup)
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (item) => !q || normalize(item.q).includes(q) || normalize(item.a).includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [query, activeGroup]);

  const totalResults = filteredGroups.reduce((sum, g) => sum + g.items.length, 0);
  const isSearching = query.trim().length > 0;

  const [view, setView] = useState<"list" | "new">(categoryParam ? "new" : "list");
  const [category, setCategory] = useState<SupportTicketCategory>(categoryParam ?? "OTHER");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    try {
      const rows = await listMySupportTickets();
      setTickets(rows);
      if (openTicket) {
        const fresh = rows.find((r) => r.id === openTicket.id);
        if (fresh) setOpenTicket(fresh);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setNotAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate() {
    if (!subject.trim() || !body.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const ticket = await createSupportTicket(category, subject.trim(), body.trim());
      setSubject("");
      setBody("");
      setCategory("OTHER");
      setView("list");
      await reload();
      setOpenTicket(ticket);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Bilet oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply() {
    if (!openTicket || !reply.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await addSupportMessage(openTicket.id, reply.trim());
      setOpenTicket(updated);
      setReply("");
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Mesaj gönderilemedi.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleClose() {
    if (!openTicket) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await closeSupportTicket(openTicket.id);
      setOpenTicket(updated);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Bilet kapatılamadı.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-cream">
      {/* Hero + arama — koyu zemin, Koinly'nin destek merkezi girisine
          benzer daha "premium" bir ac; icerigin gerisi cream zeminde devam eder. */}
      <div className="bg-marble-dark py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-xs font-semibold tracking-wide text-gold-light uppercase">
            Yardım ve Destek
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-cream sm:text-4xl">
            Sana nasıl yardımcı olabiliriz?
          </h1>
          <p className="mt-3 text-cream/65">
            Sorunu birkaç kelimeyle yaz, aşağıda hemen yanıtı bul.
          </p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Örn. API anahtarı güvenli mi, zarar mahsubu, iptal…"
              className="w-full rounded-full border-0 bg-cream py-4 pl-14 pr-5 text-sm text-ink shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)] outline-none placeholder:text-ink-soft/70 focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-20">
        {/* Kategori filtre pilleri */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => setActiveGroup(null)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeGroup === null
                ? "bg-marble-dark text-cream"
                : "border border-gold/25 text-ink-soft hover:border-gold/40"
            }`}
          >
            Tümü
          </button>
          {faqGroups.map((g) => {
            const Icon = GROUP_ICONS[g.title] ?? BookOpen;
            return (
              <button
                key={g.title}
                onClick={() => setActiveGroup(activeGroup === g.title ? null : g.title)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activeGroup === g.title
                    ? "bg-marble-dark text-cream"
                    : "border border-gold/25 text-ink-soft hover:border-gold/40"
                }`}
              >
                <Icon className="size-3.5" />
                {g.title}
              </button>
            );
          })}
        </div>

        {/* Sonuclar — gercek SSS icerigi gomulu, baska sayfaya atmadan */}
        <div className="mt-10">
          {isSearching && (
            <p className="mb-4 text-sm text-ink-soft">
              {totalResults > 0
                ? `"${query}" için ${totalResults} sonuç bulundu.`
                : `"${query}" için sonuç bulunamadı.`}
            </p>
          )}

          {totalResults === 0 && isSearching ? (
            <div className="rounded-2xl border border-gold/20 bg-parchment p-8 text-center">
              <p className="text-ink-soft">
                Aradığın konuyu bulamadık. Aşağıdan doğrudan destek ekibimize
                yazabilirsin.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {(isSearching || activeGroup ? filteredGroups : faqGroups).map((group) => {
                const Icon = GROUP_ICONS[group.title] ?? BookOpen;
                return (
                  <div key={group.title}>
                    <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink">
                      <Icon className="size-4.5 text-gold-deep" />
                      {group.title}
                    </h2>
                    <div className="mt-4 flex flex-col gap-3">
                      {group.items.map((item) => (
                        <details
                          key={item.id}
                          open={isSearching}
                          className="group rounded-xl border border-gold/20 bg-parchment px-5 py-4 open:bg-parchment"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold text-ink marker:content-none">
                            {item.q}
                            <ChevronDown className="size-4 shrink-0 text-ink-soft transition-transform group-open:rotate-180" />
                          </summary>
                          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                            {item.a}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ikincil: daha derin rehberler */}
        <div className="mt-16 border-t border-gold/15 pt-10">
          <h2 className="font-serif text-lg font-semibold text-ink">Detaylı rehberler</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {DEEP_DIVE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-gold/20 bg-parchment px-3 py-5 text-center transition-colors hover:border-gold/40"
              >
                <link.icon className="size-5 text-gold-deep" />
                <span className="text-xs font-semibold text-ink">{link.title}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-gold/15 pt-10">
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-ink">
            <LifeBuoy className="size-5 text-gold-deep" />
            Destek Bileti
          </h2>
          <p className="mt-2 text-ink-soft">
            Bir sorun mu yaşıyorsun? Bilet oluştur, ekibimiz cevap verdiğinde
            bildirim panelinde göreceksin.
          </p>

          {notAuthenticated ? (
            <div className="mt-6 rounded-2xl border border-gold/20 bg-parchment p-6 text-sm text-ink-soft">
              Bilet oluşturmak veya mevcut biletlerini görmek için{" "}
              <Link href="/giris?redirect=/destek" className="font-semibold text-gold-deep underline">
                giriş yapmalısın
              </Link>
              .
            </div>
          ) : (
            <>
        {!openTicket && (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setView("list")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  view === "list" ? "bg-marble-dark text-cream" : "border border-gold/25 text-ink-soft"
                }`}
              >
                Biletlerim
              </button>
              <button
                onClick={() => setView("new")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  view === "new" ? "bg-marble-dark text-cream" : "border border-gold/25 text-ink-soft"
                }`}
              >
                Yeni bilet
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

        {openTicket ? (
          <div className="mt-8 rounded-2xl border border-gold/20 bg-parchment p-6">
            <button
              onClick={() => setOpenTicket(null)}
              className="text-sm text-ink-soft hover:text-ink"
            >
              ← Biletlere dön
            </button>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="font-serif text-lg font-semibold text-ink">{openTicket.subject}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{CATEGORY_LABELS[openTicket.category]}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_LABELS[openTicket.status].className}`}
              >
                {STATUS_LABELS[openTicket.status].label}
              </span>
            </div>

            <div className="mt-4 flex max-h-96 flex-col gap-2 overflow-y-auto">
              {openTicket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                    m.isFromStaff
                      ? "self-start bg-cream text-ink"
                      : "self-end bg-marble-dark text-cream"
                  }`}
                >
                  <p>{m.body}</p>
                  <p className={`mt-1 text-[10px] ${m.isFromStaff ? "text-ink-soft" : "text-cream/70"}`}>
                    {m.isFromStaff ? "Destek ekibi" : "Sen"} ·{" "}
                    {new Date(m.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>
              ))}
            </div>

            {(openTicket.status === "IN_PROGRESS" || openTicket.status === "RESOLVED") && (
              <p className="mt-4 text-xs text-ink-soft">
                Destek ekibi yanıtladı. Sorun çözüldüyse bileti kapatabilirsin
                — 48 saat içinde yeni bir mesaj yazmazsan bilet otomatik
                kapanır.
              </p>
            )}

            {openTicket.status !== "CLOSED" && (
              <div className="mt-4 flex flex-wrap gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Mesaj yaz…"
                  className="min-w-0 flex-1 rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                />
                <button
                  onClick={handleReply}
                  disabled={submitting || !reply.trim()}
                  className="rounded-full bg-marble-dark px-4 py-2 text-sm font-semibold text-cream hover:bg-marble-dark-2 disabled:opacity-60"
                >
                  Gönder
                </button>
                {(openTicket.status === "IN_PROGRESS" || openTicket.status === "RESOLVED") && (
                  <button
                    onClick={handleClose}
                    disabled={submitting}
                    className="rounded-full border border-gold/30 px-4 py-2 text-sm font-semibold text-ink-soft hover:border-gold/50 hover:text-ink disabled:opacity-60"
                  >
                    Bileti Kapat
                  </button>
                )}
              </div>
            )}
          </div>
        ) : view === "new" ? (
          <div className="mt-6 rounded-2xl border border-gold/20 bg-parchment p-6">
            <div>
              <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
                Kategori
              </label>
              <CustomSelect
                value={category}
                onChange={(v) => setCategory(v as SupportTicketCategory)}
                className="mt-1.5 w-full rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink focus:border-gold"
                options={CATEGORY_OPTIONS}
              />
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
                Konu
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={150}
                className="mt-1.5 w-full rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
                Mesaj
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                maxLength={4000}
                className="mt-1.5 w-full rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={submitting || !subject.trim() || !body.trim()}
              className="mt-4 rounded-full bg-marble-dark px-5 py-2.5 text-sm font-semibold text-cream hover:bg-marble-dark-2 disabled:opacity-60"
            >
              {submitting ? "Gönderiliyor…" : "Bilet oluştur"}
            </button>
          </div>
        ) : (
          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-ink-soft">Yükleniyor…</p>
            ) : tickets.length === 0 ? (
              <p className="text-sm text-ink-soft">Henüz bir bilet oluşturmadın.</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {tickets.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => setOpenTicket(t)}
                      className="flex w-full items-center justify-between rounded-xl border border-gold/20 bg-parchment px-4 py-3 text-left text-sm hover:border-gold/40"
                    >
                      <div>
                        <p className="font-medium text-ink">{t.subject}</p>
                        <p className="mt-0.5 text-xs text-ink-soft">
                          {CATEGORY_LABELS[t.category]} ·{" "}
                          {new Date(t.updatedAt).toLocaleString("tr-TR")}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_LABELS[t.status].className}`}
                      >
                        {STATUS_LABELS[t.status].label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function DestekPage() {
  return (
    <Suspense fallback={null}>
      <DestekPageInner />
    </Suspense>
  );
}

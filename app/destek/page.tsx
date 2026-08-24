"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  addSupportMessage,
  createSupportTicket,
  getAccessToken,
  listMySupportTickets,
  type SupportTicketRow,
} from "@/lib/auth-client";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Açık", className: "bg-gold/15 text-gold-deep" },
  IN_PROGRESS: { label: "İşlemde", className: "bg-gold/15 text-gold-deep" },
  RESOLVED: { label: "Çözüldü", className: "bg-emerald-100 text-emerald-700" },
  CLOSED: { label: "Kapalı", className: "bg-parchment text-ink-soft" },
};

export default function DestekPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tickets, setTickets] = useState<SupportTicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTicket, setOpenTicket] = useState<SupportTicketRow | null>(null);

  const [view, setView] = useState<"list" | "new">("list");
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
        router.replace("/giris?redirect=/destek");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/giris?redirect=/destek");
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (ready) reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  async function handleCreate() {
    if (!subject.trim() || !body.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const ticket = await createSupportTicket(subject.trim(), body.trim());
      setSubject("");
      setBody("");
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

  if (!ready) return null;

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">Destek</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Destek merkezi
        </h1>
        <p className="mt-3 text-ink-soft">
          Bir sorun mu yaşıyorsun? Bilet oluştur, ekibimiz cevap verdiğinde
          bildirim panelinde göreceksin.
        </p>

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
              <p className="font-serif text-lg font-semibold text-ink">{openTicket.subject}</p>
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

            {openTicket.status !== "CLOSED" && (
              <div className="mt-4 flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Mesaj yaz…"
                  className="flex-1 rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                />
                <button
                  onClick={handleReply}
                  disabled={submitting || !reply.trim()}
                  className="rounded-full bg-marble-dark px-4 py-2 text-sm font-semibold text-cream hover:bg-marble-dark-2 disabled:opacity-60"
                >
                  Gönder
                </button>
              </div>
            )}
          </div>
        ) : view === "new" ? (
          <div className="mt-6 rounded-2xl border border-gold/20 bg-parchment p-6">
            <div>
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
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "./notification-bell";
import { useRouter } from "next/navigation";
import { adminListPlans, getCurrentUser, logout } from "@/lib/auth-client";

// ─── İkonlar: 1.25px stroke, kare cap/join (traders.tr stili) ───
const ICON = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  className: "h-[18px] w-[18px]",
} as const;

function IconHome() {
  return (
    <svg {...ICON}>
      <path d="M3.5 10.5 12 3.5l8.5 7V20.5h-6v-6h-5v6h-6z" />
    </svg>
  );
}

function IconGuide() {
  return (
    <svg {...ICON}>
      <path d="M4.5 3.5h15v17h-15z" />
      <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" />
    </svg>
  );
}

function IconPricing() {
  return (
    <svg {...ICON}>
      <rect x="2.5" y="6.5" width="19" height="13" rx="0" />
      <path d="M2.5 10.5h19M7.5 14.5h2M12 14.5h4" />
    </svg>
  );
}

function IconFaq() {
  return (
    <svg {...ICON}>
      <circle cx="12" cy="12" r="9" strokeLinecap="square" />
      <path d="M12 8.5c0-1.1.9-2 2-2s2 .9 2 2-2 2-2 3.5M12 17h.01" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg {...ICON}>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M4.5 20.5c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5" />
    </svg>
  );
}

function IconMenu({ open }: { open: boolean }) {
  return (
    <span className="flex flex-col gap-[4px]">
      <span
        className={`h-px w-4 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-y-[2.5px] rotate-45" : ""}`}
      />
      <span
        className={`h-px w-4 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "-translate-y-[2.5px] -rotate-45" : ""}`}
      />
    </span>
  );
}

// ─── DockLabel: ikon + mono etiket + aktif alt çizgi ───
function DockLabel({
  icon,
  label,
  selected,
}: {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
}) {
  return (
    <>
      <span
        aria-hidden
        className={`mb-0.5 flex h-5 items-center transition-all duration-200 ${selected ? "-translate-y-0.5 opacity-100" : "opacity-50"}`}
      >
        {icon}
      </span>
      <span
        className={`font-mono text-[8px] uppercase tracking-wider transition-colors duration-200 ${
          selected ? "font-bold text-ink" : "text-ink-soft"
        }`}
      >
        {label}
      </span>
      {selected && (
        <span className="absolute bottom-0 h-[2px] w-7 bg-ink" />
      )}
    </>
  );
}

const noopSubscribe = () => () => {};

const navLinks = [
  { href: "/nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/fiyatlandirma", label: "Fiyatlandırma" },
  { href: "/isletmeler", label: "İşletmeler İçin" },
  { href: "/mali-musavirler", label: "Mali Müşavirler İçin" },
  { href: "/sss", label: "SSS" },
];

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAccountant, setIsAccountant] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      setLoggedIn(!!user);
      setIsAccountant(user?.role === "ACCOUNTANT");
    });
    adminListPlans()
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false));
  }, []);


  // Menü açıkken body scroll kilitle
  useEffect(() => {
    if (!menuOpen) return;
    const { overflow, position, top, width } = document.body.style;
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    setLoggedIn(false);
    router.push("/");
  }

  // Pill nav sekmeleri — kısa etiketler (pill genişliğine sığsın)
  const tabs = [
    { id: "home", href: "/", label: "Ana Sayfa", icon: <IconHome /> },
    { id: "guide", href: "/nasil-calisir", label: "Rehber", icon: <IconGuide /> },
    { id: "pricing", href: "/fiyatlandirma", label: "Fiyat", icon: <IconPricing /> },
    { id: "faq", href: "/sss", label: "SSS", icon: <IconFaq /> },
  ];

  const activeTab = tabs.find((tab) =>
    tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href)
  )?.id;

  const panelHref = isAccountant ? "/musavir-paneli" : "/panel";
  const panelLabel = isAccountant ? "Müşavir" : "Panel";

  const itemClass =
    "relative flex h-full flex-1 flex-col items-center justify-center transition-all duration-100 active:scale-95";

  return (
    <>
      {/* ─── Üst bar: sayfa başında transparan, logo + sağ bilgi ─── */}
      <header className="absolute inset-x-0 top-0 z-40 bg-transparent">
        <div className="container-edit flex items-center justify-between py-4">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="KriptoBeyan anasayfa"
          >
            <span className="relative h-8 w-8 shrink-0">
              <Image
                src="/logo.png"
                alt="KriptoBeyan"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </span>
            <span className="font-heading text-base font-semibold tracking-tight text-white">
              KriptoBeyan
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-gold-deep"
              >
                {link.label}
              </Link>
            ))}
            {loggedIn ? (
              <>
                <NotificationBell />
                {isAdmin && (
                  <span className="btn-indigo-comet relative">
                    <Link
                      href="/admin"
                      className="inline-flex items-center justify-center rounded-full bg-[#0f1230] px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                    >
                      M Dashboard
                    </Link>
                  </span>
                )}
                <Link
                  href={panelHref}
                  className="border border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  {panelLabel}
                </Link>
              </>
            ) : (
              <Link
                href="/giris"
                className="border border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
              >
                Giriş Yap
              </Link>
            )}
          </div>

          {/* Mobil: bildirim varsa göster */}
          <div className="flex items-center gap-2 lg:hidden">
            {loggedIn && <NotificationBell />}
          </div>
        </div>
      </header>

      {/* ─── Tam genişlik alt navigasyon çubuğu — sadece mobil/tablet ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <nav
          aria-label="Ana menü"
          className="flex h-14 w-full select-none items-center justify-around border-t border-gold/20 bg-cream/92 px-1 pb-safe backdrop-blur-lg"
        >
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={itemClass}
            >
              <DockLabel
                icon={tab.icon}
                label={tab.label}
                selected={activeTab === tab.id}
              />
            </Link>
          ))}

          {/* Kullanıcı oturumu açıksa panel, yoksa menü */}
          {loggedIn ? (
            <Link href={panelHref} className={itemClass}>
              <DockLabel
                icon={<IconUser />}
                label={panelLabel}
                selected={pathname.startsWith(panelHref)}
              />
            </Link>
          ) : (
            <button
              type="button"
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className={itemClass}
            >
              <DockLabel
                icon={<IconMenu open={menuOpen} />}
                label="Menü"
                selected={menuOpen}
              />
            </button>
          )}
        </nav>
      </div>

      {/* ─── Tam ekran kinetik menü ─── */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-40 bg-cream/92 backdrop-blur-xl transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              menuOpen
                ? "kinetic-menu-open opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <nav className="flex h-full flex-col items-center justify-center gap-1 px-5">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="kinetic-menu-item flex min-h-12 items-center text-3xl font-semibold tracking-tight text-ink"
                  style={
                    {
                      "--burst-from": `${((navLinks.length - 1) / 2 - i) * 56}px`,
                      transitionDelay: menuOpen ? `${i * 30}ms` : "0ms",
                    } as React.CSSProperties
                  }
                >
                  {link.label}
                </Link>
              ))}

              <div
                className="kinetic-menu-item mt-6 flex items-center gap-3"
                style={
                  {
                    "--burst-from": `${((navLinks.length - 1) / 2 - navLinks.length) * 56}px`,
                    transitionDelay: menuOpen ? `${navLinks.length * 30}ms` : "0ms",
                  } as React.CSSProperties
                }
              >
                <Link
                  href="/giris"
                  onClick={() => setMenuOpen(false)}
                  className="border border-ink px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit-ol"
                  onClick={() => setMenuOpen(false)}
                  className="bg-ink px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
                >
                  Kayıt Ol
                </Link>
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}

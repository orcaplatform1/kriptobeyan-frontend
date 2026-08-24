"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useScaleAnimation } from "./scale-animation-context";
import {
  adminListPlans,
  getAccessToken,
  isLoggedIn,
  roleFromAccessToken,
} from "@/lib/auth-client";

const navLinks = [
  { href: "/#nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/fiyatlandirma", label: "Fiyatlandırma" },
  { href: "/#muhasebeciler", label: "Mali Müşavirler İçin" },
  { href: "/sss", label: "SSS" },
];

export function SiteHeader() {
  const { settled } = useScaleAnimation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAccountant, setIsAccountant] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Mobil cekmece document.body'e portal'lanir (asagida) — header'in kendisi
  // "sticky" oldugu icin bazi mobil tarayicilarda "fixed" torunlar icin
  // beklenmedik bir containing block olusturabiliyordu, cekmece tam ekran
  // yerine sadece header yuksekliginde/dar bir seritte goruntuleniyordu.
  // Portal SSR'da document olmadigi icin sadece mount sonrasi render edilir.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    const token = getAccessToken();
    if (!token) return;
    setIsAccountant(roleFromAccessToken(token) === "ACCOUNTANT");
    // Admin olup olmadigini ogrenmenin tek yolu su an admin ucuna gercekten
    // istek atmak — ayri bir "ben admin miyim" ucu yok. Sonuc yan etkisiz
    // (GET), bu yuzden guvenli.
    adminListPlans()
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5" aria-label="KriptoBeyan anasayfa">
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={settled ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-8 w-8 shrink-0"
          >
            <Image
              src="/logo.png"
              alt="KriptoBeyan"
              fill
              sizes="32px"
              className="object-contain"
              priority
            />
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={settled ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-lg font-semibold tracking-tight text-ink"
          >
            KriptoBeyan
          </motion.span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-gold-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {loggedIn ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-gold-deep sm:block"
                >
                  Admin
                </Link>
              )}
              <Link
                href={isAccountant ? "/musavir-paneli" : "/panel"}
                className="hidden rounded-full bg-marble-dark px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 sm:inline-flex"
              >
                {isAccountant ? "Müşavir Paneli" : "Panele git"}
              </Link>
            </>
          ) : (
            <Link
              href="/giris"
              className="hidden rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink/85 sm:inline-flex"
            >
              Giriş Yap
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 text-ink transition-colors hover:border-gold/50 md:hidden"
          >
            <span className="relative flex h-4 w-4 flex-col items-center justify-center">
              <span
                className={`absolute h-[1.5px] w-4 bg-current transition-transform ${menuOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"}`}
              />
              <span
                className={`absolute h-[1.5px] w-4 bg-current transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute h-[1.5px] w-4 bg-current transition-transform ${menuOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"}`}
              />
            </span>
          </button>
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setMenuOpen(false)}
                  className="fixed inset-0 z-40 bg-ink/40 md:hidden"
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 34 }}
                  className="fixed inset-y-0 right-0 z-50 flex w-[82vw] max-w-[320px] flex-col overflow-y-auto border-l border-gold/15 bg-cream px-6 py-5 shadow-2xl md:hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-semibold text-ink">Menü</span>
                    <button
                      type="button"
                      onClick={() => setMenuOpen(false)}
                      aria-label="Menüyü kapat"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 text-ink transition-colors hover:border-gold/50"
                    >
                      <span className="relative flex h-4 w-4 items-center justify-center">
                        <span className="absolute h-[1.5px] w-4 rotate-45 bg-current" />
                        <span className="absolute h-[1.5px] w-4 -rotate-45 bg-current" />
                      </span>
                    </button>
                  </div>

                  <nav className="mt-6 flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-parchment hover:text-gold-deep"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-3 flex flex-col gap-2 border-t border-gold/15 pt-3">
                    {loggedIn ? (
                      <>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setMenuOpen(false)}
                            className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-parchment hover:text-gold-deep"
                          >
                            Admin
                          </Link>
                        )}
                        <Link
                          href={isAccountant ? "/musavir-paneli" : "/panel"}
                          onClick={() => setMenuOpen(false)}
                          className="rounded-full bg-marble-dark px-4 py-2.5 text-center text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
                        >
                          {isAccountant ? "Müşavir Paneli" : "Panele git"}
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/giris"
                        onClick={() => setMenuOpen(false)}
                        className="rounded-full bg-ink px-4 py-2.5 text-center text-sm font-semibold text-cream transition-colors hover:bg-ink/85"
                      >
                        Giriş Yap
                      </Link>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}

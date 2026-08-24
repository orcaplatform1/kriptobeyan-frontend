"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useScaleAnimation } from "./scale-animation-context";
import { isLoggedIn } from "@/lib/auth-client";

const navLinks = [
  { href: "/#nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/fiyatlandirma", label: "Fiyatlandırma" },
  { href: "/#muhasebeciler", label: "Mali Müşavirler İçin" },
  { href: "/sss", label: "SSS" },
];

export function SiteHeader() {
  const { settled } = useScaleAnimation();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
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
            <Link
              href="/panel"
              className="rounded-full bg-marble-dark px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
            >
              Panele git
            </Link>
          ) : (
            <>
              <Link
                href="/giris"
                className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-gold-deep sm:block"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit-ol"
                className="rounded-full bg-marble-dark px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
              >
                Ücretsiz Başla
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

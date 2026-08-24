"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useScaleAnimation } from "./scale-animation-context";
import { HeroScale } from "./hero-scale";

const revealTransition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

export function HeroSection() {
  const { settled } = useScaleAnimation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-parchment to-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-8 lg:py-20 lg:px-10">
        <div className="order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={revealTransition}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-parchment px-3.5 py-1.5 text-xs font-semibold tracking-wide text-gold-deep uppercase"
          >
            Türkiye&apos;nin kripto beyan asistanı
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ ...revealTransition, delay: 0.08 }}
            className="font-serif text-4xl leading-[1.1] font-semibold text-ink sm:text-5xl lg:text-[3.4rem]"
          >
            Kripto kazancınız ile vergi arasındaki
            <span className="text-gold-deep"> dengeyi</span> siz kurmayın.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ ...revealTransition, delay: 0.16 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft"
          >
            KriptoBeyan ile kripto vergi hesaplama otomatikleşir: borsa
            hesaplarınızı ve cüzdanlarınızı bağlayın, işlemleriniz FIFO
            yöntemiyle hesaplansın. Kripto beyan dönemi geldiğinde taslak
            raporunuz hazır olsun.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ ...revealTransition, delay: 0.24 }}
            className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
          >
            <Link
              href="/kayit-ol"
              className="inline-flex items-center justify-center rounded-full bg-marble-dark px-7 py-3.5 text-base font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(28,32,25,0.45)] transition-transform hover:scale-[1.02] hover:bg-marble-dark-2"
            >
              Ücretsiz Başla
            </Link>
            <a
              href="#nasil-calisir"
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-7 py-3.5 text-base font-medium text-ink-soft transition-colors hover:border-gold/40 hover:text-gold-deep"
            >
              Nasıl çalışır?
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={settled ? { opacity: 1 } : { opacity: 0 }}
            transition={{ ...revealTransition, delay: 0.34 }}
            className="mt-6 text-sm text-ink-soft/80"
          >
            Kredi kartı gerekmez · Tüm hesaplamalar taslak/tahmini olarak sunulur
          </motion.p>
        </div>

        <div className="order-1 lg:order-2">
          <div className="mx-auto w-[78%] sm:w-[62%] lg:w-full">
            <HeroScale />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useScaleAnimation } from "./scale-animation-context";
import { HeroScale } from "./hero-scale";
import { AuthAwareCta } from "./auth-aware-cta";
import type { SiteContent } from "@/lib/api";

const revealTransition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

// Varsayilanlar, Prisma SiteContentSettings modelindeki @default degerleriyle
// BIREBIR ayni — backend'e hic erisilemese/kayit olusmamis olsa bile gorunum
// degismez (bkz. lib/api.ts getSiteContent).
const DEFAULTS = {
  heroBadge: "Türkiye'nin ilk kripto vergi asistanı",
  heroTitlePrefix: "Kripto kazancınız ile vergi arasındaki",
  heroTitleHighlight: "dengeyi",
  heroTitleSuffix: "biz kurarız.",
  heroDescription:
    "KriptoBeyan ile kripto vergi hesaplama otomatikleşir: borsa hesaplarınızı ve cüzdanlarınızı bağlayın, işlemleriniz FIFO yöntemiyle hesaplansın. Kripto beyan dönemi geldiğinde taslak raporunuz hazır olsun.",
  heroPrimaryCtaLabel: "Ücretsiz Başla",
  heroSecondaryCtaLabel: "Nasıl çalışır?",
};

export function HeroSection({ content }: { content?: SiteContent | null }) {
  const { settled } = useScaleAnimation();
  const c = { ...DEFAULTS, ...(content ?? {}) };

  return (
    <section className="hero-landscape-min-h relative flex items-stretch overflow-hidden bg-gradient-to-b from-parchment to-cream">
      <div className="hero-landscape-grid-cols hero-landscape-pl-16 grid w-full grid-cols-1 gap-10 px-6 pt-0 pb-6 sm:px-10 sm:pb-10 md:items-stretch md:gap-6 md:py-0 md:pr-0">
        <div className="hero-landscape-order-1 order-2 md:hidden">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ ...revealTransition, delay: 0.08 }}
            className="font-serif text-4xl leading-[1.1] font-semibold text-ink sm:text-5xl md:text-[3.4rem] xl:text-[3.9rem]"
          >
            {c.heroTitlePrefix}
            <span className="text-gold-deep"> {c.heroTitleHighlight}</span> {c.heroTitleSuffix}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ ...revealTransition, delay: 0.16 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft"
          >
            {c.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ ...revealTransition, delay: 0.24 }}
            className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
          >
            <a
              href="#nasil-calisir"
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-7 py-3.5 text-base font-medium text-ink-soft transition-colors hover:border-gold/40 hover:text-gold-deep"
            >
              {c.heroSecondaryCtaLabel}
            </a>
          </motion.div>
        </div>

        <div className="hero-landscape-fill-h hero-landscape-order-2 hero-landscape-col-2 hero-landscape-mx-0 order-1 -mx-6 flex min-w-0 items-center justify-center sm:-mx-10 md:justify-end">
          {/* relative burada, dogrudan gorseli saran kutuda — bir onceki
              halde disaridaki flex kapsayicidaydi ve "items-center
              justify-center" gorseli kapsayicinin ortasina hizaladigi icin
              (gorsel container'i tam doldurmuyor) rozet gorselin disina,
              sag-usta kayiyordu (bkz. ekran goruntusu). Artik gorselin
              GERCEK render kutusuyla ayni boyuta sahip. */}
          <div className="hero-landscape-fill-h hero-landscape-fill-w relative w-full min-w-0">
            <HeroScale />

            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={revealTransition}
              className="absolute top-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full border border-gold/30 bg-parchment/95 px-2.5 py-1 text-[10px] font-semibold tracking-wide whitespace-nowrap text-gold-deep uppercase shadow-sm backdrop-blur-sm sm:top-5 sm:left-5 sm:px-3.5 sm:py-1.5 sm:text-xs md:hidden"
            >
              {c.heroBadge}
            </motion.span>

            {/* Masaustunde baslik+alt yazi+butonlar, ust etiketin hemen
                altina, gorselin UZERINE DOGRUDAN (kutu/panel olmadan)
                bindirilmis — kullanicinin acik istegi. Metinlerde fotografin
                uzerinde okunabilirlik icin drop-shadow var, kutu/arka plan
                yok. Mobilde DOKUNULMADI, ayni icerik yukarida solo bir blok
                olarak zaten var (order-2). */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ ...revealTransition, delay: 0.08 }}
              className="absolute top-1/2 left-3 hidden max-w-[calc(100%-1.5rem)] -translate-y-1/2 sm:left-5 md:block md:max-w-sm xl:max-w-md"
            >
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-parchment/95 px-3.5 py-1.5 text-xs font-semibold tracking-wide whitespace-nowrap text-gold-deep uppercase shadow-sm backdrop-blur-sm">
                {c.heroBadge}
              </span>
              <h2 className="font-serif text-xl leading-[1.15] font-semibold text-parchment drop-shadow-[0_2px_6px_rgba(36,32,26,0.55)] md:text-2xl xl:text-3xl">
                {c.heroTitlePrefix}
                <span className="text-gold-deep"> {c.heroTitleHighlight}</span> {c.heroTitleSuffix}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-parchment/85 drop-shadow-[0_2px_6px_rgba(36,32,26,0.55)] xl:text-base">
                {c.heroDescription}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="#nasil-calisir"
                  className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-parchment/90 px-5 py-2.5 text-sm font-medium text-ink-soft backdrop-blur-sm transition-colors hover:border-gold/40 hover:text-gold-deep"
                >
                  {c.heroSecondaryCtaLabel}
                </a>
                <span className="btn-gold-comet relative inline-flex">
                  <AuthAwareCta className="inline-flex items-center justify-center rounded-full bg-marble-dark px-5 py-2.5 text-sm font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(28,32,25,0.5)] transition-transform hover:scale-[1.03] hover:bg-marble-dark-2">
                    {c.heroPrimaryCtaLabel}
                  </AuthAwareCta>
                </span>
              </div>
            </motion.div>

            {/* Hero'daki TEK "Ücretsiz Başla" — bilerek gorselin sol-alt
                kosesinde, mobilde tek CTA (masaustunde ayni buton metin
                sutununda "Nasıl çalışır?" yaninda da var, o yuzden burada
                md:hidden — masaustunde ikisi ayni anda gorunmesin diye,
                bkz. yukaridaki motion.div icindeki Link). */}
            <span className="btn-gold-comet absolute bottom-5 left-5 inline-flex md:hidden">
              <AuthAwareCta className="inline-flex items-center justify-center rounded-full bg-marble-dark px-6 py-3 text-sm font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(28,32,25,0.5)] transition-transform hover:scale-[1.03] hover:bg-marble-dark-2">
                {c.heroPrimaryCtaLabel}
              </AuthAwareCta>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

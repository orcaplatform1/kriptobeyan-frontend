"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useScaleAnimation } from "./scale-animation-context";
import { HeroScale } from "./hero-scale";

const revealTransition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

export function HeroSection() {
  const { settled } = useScaleAnimation();

  return (
    <section className="relative flex items-stretch overflow-hidden bg-gradient-to-b from-parchment to-cream lg:min-h-[100dvh]">
      <div className="grid w-full grid-cols-1 gap-10 px-6 pt-0 pb-6 sm:px-10 sm:pb-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch lg:gap-6 lg:py-0 lg:pl-16 lg:pr-0 xl:pl-24">
        <div className="order-2 lg:order-1 lg:hidden">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ ...revealTransition, delay: 0.08 }}
            className="font-serif text-4xl leading-[1.1] font-semibold text-ink sm:text-5xl lg:text-[3.4rem] xl:text-[3.9rem]"
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
            <a
              href="#nasil-calisir"
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-7 py-3.5 text-base font-medium text-ink-soft transition-colors hover:border-gold/40 hover:text-gold-deep"
            >
              Nasıl çalışır?
            </a>
          </motion.div>
        </div>

        <div className="order-1 -mx-6 flex min-w-0 items-center justify-center sm:-mx-10 lg:order-2 lg:col-start-2 lg:mx-0 lg:h-full lg:justify-end">
          {/* relative burada, dogrudan gorseli saran kutuda — bir onceki
              halde disaridaki flex kapsayicidaydi ve "items-center
              justify-center" gorseli kapsayicinin ortasina hizaladigi icin
              (gorsel container'i tam doldurmuyor) rozet gorselin disina,
              sag-usta kayiyordu (bkz. ekran goruntusu). Artik gorselin
              GERCEK render kutusuyla ayni boyuta sahip. */}
          <div className="relative w-full min-w-0 lg:h-full lg:w-auto">
            <HeroScale />

            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={revealTransition}
              className="absolute top-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full border border-gold/30 bg-parchment/95 px-2.5 py-1 text-[10px] font-semibold tracking-wide whitespace-nowrap text-gold-deep uppercase shadow-sm backdrop-blur-sm sm:top-5 sm:left-5 sm:px-3.5 sm:py-1.5 sm:text-xs"
            >
              Türkiye&apos;nin ilk kripto vergi asistanı
            </motion.span>

            {/* Masaustunde baslik+alt yazi+butonlar, ust etiketin hemen
                altina, gorselin uzerine bindirilmis bir panel olarak —
                kullanicinin acik istegi ("bu etiket hep kalacak, alt
                yaziyi bu etikete yaz"). Mobilde DOKUNULMADI, ayni icerik
                yukarida solo bir blok olarak zaten var (order-2). */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ ...revealTransition, delay: 0.08 }}
              className="absolute top-14 left-3 hidden max-w-[calc(100%-1.5rem)] rounded-2xl border border-gold/20 bg-parchment/95 p-5 shadow-lg backdrop-blur-sm sm:top-16 sm:left-5 lg:block lg:max-w-sm lg:p-6 xl:max-w-md"
            >
              <h2 className="font-serif text-xl leading-[1.15] font-semibold text-ink lg:text-2xl xl:text-3xl">
                Kripto kazancınız ile vergi arasındaki
                <span className="text-gold-deep"> dengeyi</span> siz kurmayın.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft xl:text-base">
                KriptoBeyan ile kripto vergi hesaplama otomatikleşir: borsa
                hesaplarınızı ve cüzdanlarınızı bağlayın, işlemleriniz FIFO
                yöntemiyle hesaplansın. Kripto beyan dönemi geldiğinde
                taslak raporunuz hazır olsun.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="#nasil-calisir"
                  className="inline-flex items-center justify-center rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-gold/40 hover:text-gold-deep"
                >
                  Nasıl çalışır?
                </a>
                <Link
                  href="/kayit-ol"
                  className="inline-flex items-center justify-center rounded-full bg-marble-dark px-5 py-2.5 text-sm font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(28,32,25,0.5)] transition-transform hover:scale-[1.03] hover:bg-marble-dark-2"
                >
                  Ücretsiz Başla
                </Link>
              </div>
            </motion.div>

            {/* Hero'daki TEK "Ücretsiz Başla" — bilerek gorselin sol-alt
                kosesinde, mobilde tek CTA (masaustunde ayni buton metin
                sutununda "Nasıl çalışır?" yaninda da var, o yuzden burada
                lg:hidden — masaustunde ikisi ayni anda gorunmesin diye,
                bkz. yukaridaki motion.div icindeki Link). */}
            <span className="btn-gold-comet absolute bottom-5 left-5 inline-flex lg:hidden">
              <Link
                href="/kayit-ol"
                className="inline-flex items-center justify-center rounded-full bg-marble-dark px-6 py-3 text-sm font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(28,32,25,0.5)] transition-transform hover:scale-[1.03] hover:bg-marble-dark-2"
              >
                Ücretsiz Başla
              </Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

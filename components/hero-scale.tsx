"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { useScaleAnimation } from "./scale-animation-context";

// NOT: Onceki hero-base.png fotografinda bir terazi vardi ve ustune
// hero-scale-beam.png (kesilmis kol+kefe katmani) fizik tabanli bir sallanma
// animasyonuyla bindiriliyordu. Fotograf terazisiz yeni versiyonla (bkz.
// /var/www/kriptobeyan/hero2.png) degistirildi — kol katmani ve sallanma
// animasyonu artik gorsele karsilik gelmedigi icin bilerek kaldirildi,
// sadece sade bir giris (fade+scale) animasyonu kaldi.
export function HeroScale() {
  const { setSettled } = useScaleAnimation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setSettled(false);
  }, [setSettled]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => setSettled(true)}
      className="relative aspect-[1536/1024] w-full max-w-full select-none lg:h-full lg:w-auto"
    >
      <Image
        src="/hero-base.png"
        alt="KriptoBeyan — arka planda İstanbul, Kız Kulesi siluetiyle mermer bir galeri. KriptoBeyan, kripto kazancınızla vergi yükümlülüğünüz arasındaki dengeyi kurar."
        fill
        priority
        sizes="(min-width: 1024px) 90vw, 100vw"
        className="object-cover"
      />
    </motion.div>
  );
}

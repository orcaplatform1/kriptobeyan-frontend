"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { useEffect, useState } from "react";
import { useScaleAnimation } from "./scale-animation-context";

// Crop box of the beam+chains+pans layer within the original 1536x1024
// hero photo (see /var/www/kriptobeyan/frontend/public/hero-base.png and
// hero-scale-beam.png — the beam layer was cut out with a feathered alpha
// mask so it recomposites seamlessly over the static base at rest).
const BEAM_BOX = {
  leftPct: (800 / 1536) * 100,
  topPct: (360 / 1024) * 100,
  widthPct: (660 / 1536) * 100,
  heightPct: (660 / 1024) * 100,
};

// Pivot = top of the scale's post (the fulcrum the beam swings on),
// expressed as a percentage within the beam layer's own box.
const PIVOT_ORIGIN = "45.3% 20.2%";

type Stage = "intro" | "loop";

export function HeroScale() {
  const { setSettled } = useScaleAnimation();
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("intro");
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 1023px)").matches
      : false,
  );

  useEffect(() => {
    setSettled(false);
  }, [setSettled]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const onChange = (e: MediaQueryListEvent) => setIsCompact(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const introTilt = isCompact ? -5 : -9;
  const loopTilt = isCompact ? -4.5 : -6.5;

  // Reduced motion: settle once, no continuous loop afterwards.
  const rotateTarget = prefersReducedMotion
    ? 0
    : stage === "intro"
      ? 0
      : [0, loopTilt, 0];

  const transition: Transition = prefersReducedMotion
    ? { duration: 0.01 }
    : stage === "intro"
      ? isCompact
        ? { type: "spring", stiffness: 34, damping: 6.5, mass: 1 }
        : { type: "spring", stiffness: 22, damping: 3.6, mass: 1 }
      : {
          duration: 5,
          times: [0, 0.6, 1],
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 2,
        };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative aspect-[1536/1024] w-full select-none"
    >
      <Image
        src="/hero-base.png"
        alt="Kripto varlıklarla vergiyi dengeleyen terazi — arka planda İstanbul, Kız Kulesi siluetiyle mermer bir galeri. KriptoBeyan, kripto kazancınızla vergi yükümlülüğünüz arasındaki dengeyi kurar."
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <motion.div
        initial={{ rotate: introTilt }}
        animate={{ rotate: rotateTarget }}
        transition={transition}
        onAnimationComplete={() => {
          if (stage === "intro") {
            setSettled(true);
            setStage("loop");
          }
        }}
        style={{
          position: "absolute",
          left: `${BEAM_BOX.leftPct}%`,
          top: `${BEAM_BOX.topPct}%`,
          width: `${BEAM_BOX.widthPct}%`,
          height: `${BEAM_BOX.heightPct}%`,
          transformOrigin: PIVOT_ORIGIN,
        }}
      >
        <Image
          src="/hero-scale-beam.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 22vw, 44vw"
          className="object-contain"
        />
      </motion.div>
    </motion.div>
  );
}

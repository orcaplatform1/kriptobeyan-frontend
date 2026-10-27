"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const TABS = [
  { id: "isletmeler", label: "İşletmeler" },
  { id: "musavirler", label: "Mali Müşavirler" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const CONTENT: Record<TabId, {
  eyebrow: string;
  title: string;
  desc: string;
  points: string[];
  cta: { label: string; href: string };
}> = {
  isletmeler: {
    eyebrow: "İşletmeler için",
    title: "Kripto varlık muhasebenizi tek panelde toplayın",
    desc: "Yüksek işlem hacmine sahip işletmeler için: tüm borsa ve cüzdan verinizi birleştiren, ticari kazanç esaslı vergi hesabı yapan ve beyan dönemine hazır bir taslak rapor üreten altyapı.",
    points: [
      "Ticari kazanç esaslı vergi hesabı — bireysel değer artış kazancından ayrı, işletmenize uygun mantıkla",
      "Bireysel planların çok üzerinde işlem limitleri, yoğun işlem yapan işletmeler için",
      "Canlı API, on-chain cüzdan okuma ve CSV içe aktarma ile tüm kaynaklarınız tek panelde",
    ],
    cta: { label: "İşletme planlarını gör", href: "/isletmeler" },
  },
  musavirler: {
    eyebrow: "Mali müşavirler için",
    title: "Kripto varlıklı müşterilerinizi tek panelden yönetin",
    desc: "KriptoBeyan'ın mali müşavir hesabı, müşteri davet akışından portföy genel görünümüne kadar tüm süreci tek panelde toplar — erişim her zaman müşterinin onayına ve sıkı yetkilendirme kontrolüne bağlıdır.",
    points: [
      "Müşteri portföyünü tek panelden yönet, işlem limitine göre ölçeklenen planlarla",
      "Her müşteri erişimi davet bazlı ve sıkı yetkilendirmeli — yalnızca aktif bağlantısı olan müşterilerin verisini görürsün",
      "Müşteri başına taslak vergi özeti ve veri tutarlılığı uyarıları (eksik/negatif bakiye) tek bakışta",
    ],
    cta: { label: "Mali müşavir planlarını gör", href: "/mali-musavirler" },
  },
};

const ease = [0.22, 1, 0.36, 1] as const;

export function TargetAudienceSection() {
  const [active, setActive] = useState<TabId>("isletmeler");
  const content = CONTENT[active];

  return (
    <section
      id={active === "isletmeler" ? "isletmeler" : "muhasebeciler"}
      className="relative overflow-hidden bg-marble-dark-2 py-20 lg:py-28"
    >
      {/* Arka plan ışıması */}
      <div className="pointer-events-none absolute left-1/3 bottom-0 h-80 w-80 rounded-full bg-gold/[0.04] blur-[90px]" />

      <div className="container-edit relative">
        {/* Segmented switcher */}
        <div className="flex justify-center">
          <div className="relative flex items-center gap-1 border border-gold/[0.15] bg-marble-dark/60 p-1 backdrop-blur-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className="relative z-10 px-6 py-2.5 text-sm font-semibold transition-colors duration-200"
                style={{
                  color:
                    active === tab.id
                      ? "var(--color-ink)"
                      : "rgba(246,239,225,0.45)",
                }}
              >
                {active === tab.id && (
                  <motion.span
                    layoutId="audience-tab-bg"
                    className="absolute inset-0 bg-cream"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* İçerik */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease }}
            className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-gold-light uppercase">
                {content.eyebrow}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-cream sm:text-4xl">
                {content.title}
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-cream/60">
                {content.desc}
              </p>
              <Link
                href={content.cta.href}
                className="mt-8 inline-flex items-center justify-center border border-gold/30 bg-gold/[0.08] px-7 py-3.5 text-base font-semibold text-gold-light transition-all hover:border-gold/50 hover:bg-gold/[0.16]"
              >
                {content.cta.label}
              </Link>
            </div>

            <ul className="flex flex-col gap-4">
              {content.points.map((point, i) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease }}
                  className="relative overflow-hidden border border-gold/[0.1] bg-marble-dark/50 p-5 text-sm leading-relaxed text-cream/65 backdrop-blur-sm"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                  {point}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

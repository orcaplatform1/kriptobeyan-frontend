"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Hesaplarını bağla",
    desc: "Binance, BTCTurk, Kraken gibi borsa hesaplarını salt-okunur (read-only) API anahtarıyla ya da Ethereum, BSC ve Bitcoin cüzdan adresinle bağla. API anahtarların AES-256-GCM ile şifrelenir; para çekme iznine hiçbir zaman ihtiyaç duyulmaz. Borsan API desteklemiyorsa, hesap dökümünü CSV olarak da içe aktarabilirsin.",
  },
  {
    n: "02",
    title: "Otomatik birleştirme",
    desc: "Farklı borsalardan ve cüzdanlardan gelen tüm işlemler tek bir zaman çizelgesinde birleştirilir. Kendi hesapların arasındaki transferler otomatik tespit edilip vergilendirilebilir işlemlerden ayıklanır; eksik geçmiş veya negatif bakiye gibi tutarsızlıklar ayrı ayrı uyarı olarak işaretlenir.",
  },
  {
    n: "03",
    title: "FIFO ile kripto vergi hesaplama",
    desc: "Gerçekleşen kazanç ve kayıplar FIFO yöntemiyle, her işlem anındaki güncel TCMB döviz kuru üzerinden TL bazında hesaplanır. Yasal istisna tutarları otomatik uygulanır ve varsa dönem içi zararların mahsubu da hesaba katılır.",
  },
  {
    n: "04",
    title: "Taslak rapor al",
    desc: "Hesaplama tamamlandığında PDF ve Excel formatında taslak bir beyan raporu indirebilirsin. Dilersen aynı raporu tek bir paylaşım linkiyle doğrudan mali müşavirine gönderip inceletebilirsin — ayrıca dosya e-postalaşmana gerek kalmaz.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function BentoCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const isWide = index === 0 || index === 3;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease }}
      className={`relative overflow-hidden border border-gold/[0.12] bg-marble-dark-2/70 p-6 backdrop-blur-xl md:p-8 ${isWide ? "md:col-span-2" : "md:col-span-1"}`}
    >
      {/* Üst kenar parlaması */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      {/* Köşe ışıması */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gold/[0.05] blur-3xl" />

      <span className="font-heading text-4xl font-semibold text-gold/35">{step.n}</span>
      <h3 className="mt-4 text-base font-semibold tracking-tight text-cream">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cream/55">{step.desc}</p>
    </motion.div>
  );
}

export function HowItWorksSection() {
  return (
    <section id="nasil-calisir" className="relative overflow-hidden bg-marble-dark py-20 lg:py-28">
      {/* Arka plan ışıması */}
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-gold/[0.04] blur-[120px]" />

      <div className="container-edit relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold tracking-[0.15em] text-gold-light uppercase">
            Nasıl çalışır
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-cream sm:text-4xl">
            4 Adımda Kripto Vergi Hesaplama
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-cream/55">
            KriptoBeyan, kripto beyan sürecindeki en zaman alıcı kısmı —
            işlem birleştirme ve hesaplama — otomatikleştirir.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-px bg-gold/[0.07] md:grid-cols-3">
          {steps.map((step, i) => (
            <BentoCard key={step.n} step={step} index={i} />
          ))}
        </div>

        <a
          href="/nasil-calisir"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-light transition-colors hover:text-gold"
        >
          API anahtarı alma, bağlanma ve rapor içeriği dahil detaylı anlatımı incele →
        </a>
      </div>
    </section>
  );
}

import Link from "next/link";

const points = [
  "Müşteri portföyünü tek panelden yönet, işlem limitine göre ölçeklenen planlarla",
  "Her müşteri erişimi davet bazlı ve sıkı yetkilendirmeli — yalnızca aktif bağlantısı olan müşterilerin verisini görürsün",
  "Müşteri başına taslak vergi özeti ve veri tutarlılığı uyarıları (eksik/negatif bakiye) tek bakışta",
];

export function AccountantsSection() {
  return (
    <section id="muhasebeciler" className="bg-marble-dark py-20 text-cream lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:gap-8 lg:px-10">
        <div>
          <p className="text-xs font-semibold tracking-wide text-gold-light uppercase">
            Mali müşavirler için
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
            Kripto varlıklı müşterilerinizi tek panelden yönetin
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-cream/70">
            KriptoBeyan&apos;ın mali müşavir hesabı, müşteri davet akışından
            portföy genel görünümüne kadar tüm süreci tek panelde toplar —
            erişim her zaman müşterinin onayına ve sıkı yetkilendirme
            kontrolüne bağlıdır.
          </p>
          <Link
            href="/fiyatlandirma"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-cream px-7 py-3.5 text-base font-semibold text-marble-dark transition-transform hover:scale-[1.02]"
          >
            Mali müşavir planlarını gör
          </Link>
        </div>

        <ul className="flex flex-col gap-5">
          {points.map((point) => (
            <li
              key={point}
              className="rounded-2xl border border-cream/10 bg-white/[0.04] p-5 text-sm leading-relaxed text-cream/80"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

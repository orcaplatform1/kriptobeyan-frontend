import Link from "next/link";

const points = [
  "Ticari kazanç esaslı vergi hesabı — bireysel değer artış kazancından ayrı, işletmenize uygun mantıkla",
  "Bireysel planların çok üzerinde işlem limitleri, yoğun işlem yapan işletmeler için",
  "Canlı API, on-chain cüzdan okuma ve CSV içe aktarma ile tüm kaynaklarınız tek panelde",
];

export function BusinessSection() {
  return (
    <section id="isletmeler" className="bg-parchment py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:gap-8 lg:px-10">
        <div>
          <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
            İşletmeler için
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
            Kripto varlık muhasebenizi tek panelde toplayın
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-soft">
            Yüksek işlem hacmine sahip işletmeler için: tüm borsa ve cüzdan
            verinizi birleştiren, ticari kazanç esaslı vergi hesabı yapan ve
            beyan dönemine hazır bir taslak rapor üreten altyapı.
          </p>
          <Link
            href="/isletmeler"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-marble-dark px-7 py-3.5 text-base font-semibold text-cream transition-transform hover:scale-[1.02]"
          >
            İşletme planlarını gör
          </Link>
        </div>

        <ul className="flex flex-col gap-5">
          {points.map((point) => (
            <li
              key={point}
              className="rounded-2xl border border-gold/20 bg-cream p-5 text-sm leading-relaxed text-ink-soft"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

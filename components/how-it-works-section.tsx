const steps = [
  {
    n: "01",
    title: "Hesaplarını bağla",
    desc: "Binance, BTCTurk, Kraken gibi borsa hesaplarını API anahtarınla (salt-okunur) veya cüzdan adresinle bağla; istersen CSV içe aktar.",
  },
  {
    n: "02",
    title: "Otomatik birleştirme",
    desc: "Tüm işlemler tek zaman çizelgesinde birleştirilir, iç transferler ayıklanır, eksik/negatif bakiye uyarıları otomatik işaretlenir.",
  },
  {
    n: "03",
    title: "FIFO ile kripto vergi hesaplama",
    desc: "Gerçekleşen kazanç/kayıp FIFO yöntemiyle, güncel TCMB kurlarıyla TL bazında hesaplanır — istisna tutarları otomatik uygulanır.",
  },
  {
    n: "04",
    title: "Taslak rapor al",
    desc: "PDF/Excel formatında taslak beyan raporunu indir, dilersen mali müşavirinle paylaşım linkiyle doğrudan paylaş.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="nasil-calisir" className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
            Nasıl çalışır
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
            Kripto vergi hesaplama dört adımda
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            KriptoBeyan, kripto beyan sürecindeki en zaman alıcı kısmı —
            işlem birleştirme ve hesaplama — otomatikleştirir.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-gold/15 bg-parchment p-6"
            >
              <span className="font-serif text-3xl font-semibold text-gold">
                {step.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

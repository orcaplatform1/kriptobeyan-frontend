const steps = [
  {
    n: "01",
    title: "Hesaplarını bağla",
    desc: "Binance, BTCTurk, Kraken gibi borsa hesaplarını salt-okunur (read-only) API anahtarıyla ya da Ethereum, BSC ve Bitcoin cüzdan adresinle bağla. API anahtarların AES-256-GCM ile şifrelenir; para çekme iznine hiçbir zaman ihtiyaç duyulmaz. Borsan API desteklemiyorsa, hesap dökümünü CSV olarak da içe aktarabilirsin.",
  },
  {
    n: "02",
    title: "Otomatik birleştirme",
    desc: "Farklı borsalardan ve cüzdanlardan gelen tüm işlemler tek bir zaman çizelgesinde birleştirilir. Kendi hesapların arasındaki transferler (borsadan cüzdana, cüzdandan borsaya) otomatik tespit edilip vergilendirilebilir işlemlerden ayıklanır; eksik geçmiş veya negatif bakiye gibi tutarsızlıklar ise ayrı ayrı uyarı olarak işaretlenir, böylece rapora geçmeden önce fark edip düzeltebilirsin.",
  },
  {
    n: "03",
    title: "FIFO ile kripto vergi hesaplama",
    desc: "Gerçekleşen kazanç ve kayıplar FIFO (İlk Giren İlk Çıkar) yöntemiyle, her işlem anındaki güncel TCMB döviz kuru üzerinden TL bazında hesaplanır. Yasal istisna tutarları otomatik uygulanır ve varsa dönem içi zararların mahsubu da hesaba katılır.",
  },
  {
    n: "04",
    title: "Taslak rapor al",
    desc: "Hesaplama tamamlandığında PDF ve Excel formatında taslak bir beyan raporu indirebilirsin. Dilersen aynı raporu tek bir paylaşım linkiyle doğrudan mali müşavirine gönderip inceletebilirsin — ayrıca dosya e-postalaşmana gerek kalmaz. Not: rapor ekranında ayrıca bir \"Yapay Zeka Kontrolörü\" kutusu görürsün — verinde eksik/tutarsız bir nokta varsa bunu sade bir dille özetler (bkz. detaylı anlatım).",
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
            4 Adımda Kripto Vergi Hesaplama
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

        <a
          href="/nasil-calisir"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:underline"
        >
          API anahtarı alma, bağlanma ve rapor içeriği dahil detaylı anlatımı incele →
        </a>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { AuthAwareCta } from "@/components/auth-aware-cta";
import { getPlans, formatTRY } from "@/lib/api";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "İşletmeler İçin",
  description:
    "KriptoBeyan işletme planları: yüksek işlem hacmi, ticari kazanç esaslı vergi hesabı ve tüm borsa/cüzdan verinizi tek panelde toplayan kripto muhasebe altyapısı.",
  alternates: { canonical: `${SITE_URL}/isletmeler` },
};

const FEATURES = [
  {
    title: "Ticari kazanç esaslı hesaplama",
    desc: "İşletmeniz için kripto varlık işlemleri, bireysel değer artış kazancından ayrı olarak ticari kazanç mantığıyla hesaplanır.",
  },
  {
    title: "Yüksek işlem hacmi",
    desc: "Bireysel planların çok üzerinde işlem limitleriyle, yoğun işlem yapan işletmeler için tasarlandı.",
  },
  {
    title: "Tüm kaynaklar tek panelde",
    desc: "Canlı API bağlantılı borsalar, on-chain cüzdan okuma ve CSV içe aktarma ile tüm işlem geçmişiniz tek bir zaman çizelgesinde birleşir.",
  },
  {
    title: "Otomatik FIFO hesaplama",
    desc: "Gerçekleşen kazanç/kayıplar FIFO yöntemiyle TL bazında otomatik hesaplanır, elle hesaplama gerekmez.",
  },
  {
    title: "Taslak vergi raporu",
    desc: "Beyan dönemi geldiğinde, mali müşavirinize veya kendi beyannamenize temel oluşturacak bir taslak rapor indirirsiniz.",
  },
  {
    title: "Mali müşavirinizle paylaşın",
    desc: "Mali müşaviriniz KriptoBeyan kullanıyorsa, ona davet göndererek portföyünüzü doğrudan onunla paylaşabilirsiniz.",
  },
];

export default async function IsletmelerPage() {
  const plans = await getPlans();
  const business = plans
    .filter((p) => p.type === "INDIVIDUAL" && p.name.startsWith("İşletme "))
    .sort((a, b) => Number(a.priceTRY) - Number(b.priceTRY));

  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
        <span className="btn-gold-comet inline-flex">
          <span className="inline-flex items-center rounded-full bg-marble-dark px-4 py-1.5 text-xs font-semibold tracking-wide text-cream uppercase">
            İşletmeler için
          </span>
        </span>
        <h1 className="mt-5 font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Kripto varlık muhasebenizi tek panelde toplayın
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Yüksek işlem hacmine sahip işletmeler için: tüm borsa ve cüzdan
          verinizi birleştiren, ticari kazanç esaslı vergi hesabı yapan ve
          beyan dönemine hazır bir taslak rapor üreten altyapı.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#fiyatlandirma"
            className="inline-flex items-center justify-center rounded-full bg-marble-dark px-7 py-3.5 text-base font-semibold text-cream transition-transform hover:scale-[1.02]"
          >
            Planları gör
          </Link>
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center rounded-full border border-gold/30 px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-parchment"
          >
            Özel ihtiyaçlarınızı konuşalım
          </Link>
        </div>

        {/* Ozellikler */}
        <div className="mt-20">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            Neler dahil
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gold/25 bg-parchment p-6"
              >
                <p className="font-serif text-lg font-semibold text-ink">
                  {f.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fiyatlandirma */}
        {business.length > 0 && (
          <div id="fiyatlandirma" className="mt-20 scroll-mt-24">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              İşlem hacminize göre fiyatlandırma
            </h2>
            <p className="mt-2 text-ink-soft">
              Fiyatlar yıllıktır, KDV dahildir. Tüm planlarda taslak vergi
              raporu, otomatik FIFO hesaplama ve sınırsız borsa/cüzdan
              bağlantısı yer alır.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {business.map((plan, i) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-7 ${
                    i === 1
                      ? "border-gold bg-marble-dark text-cream shadow-[0_16px_40px_-16px_rgba(28,32,25,0.5)]"
                      : "border-gold/20 bg-parchment text-ink"
                  }`}
                >
                  <h3
                    className={`text-sm font-semibold uppercase tracking-wide ${i === 1 ? "text-gold-light" : "text-ink-soft"}`}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-3 font-serif text-3xl font-semibold">
                    {formatTRY(plan.priceTRY)}
                    <span
                      className={`ml-1 text-base font-normal ${i === 1 ? "text-cream/70" : "text-ink-soft"}`}
                    >
                      /yıl
                    </span>
                  </p>
                  <p className={`mt-3 text-sm ${i === 1 ? "text-cream/70" : "text-ink-soft"}`}>
                    {plan.transactionLimit === null
                      ? "Sınırsız işlem"
                      : `Yılda ${new Intl.NumberFormat("tr-TR").format(plan.transactionLimit)} işleme kadar`}
                  </p>
                  <AuthAwareCta
                    planId={plan.id}
                    className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                      i === 1 ? "bg-cream text-marble-dark" : "bg-marble-dark text-cream"
                    }`}
                  >
                    Bu planla başla
                  </AuthAwareCta>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-ink-soft/80">
              Daha yüksek hacimli veya özel ihtiyaçlarınız için{" "}
              <Link href="/iletisim" className="text-gold-deep underline underline-offset-2">
                bize yazın
              </Link>
              , size özel bir çözüm konuşalım.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

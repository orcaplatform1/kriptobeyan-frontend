import type { Metadata } from "next";
import Link from "next/link";
import { getPlans, formatTRY } from "@/lib/api";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Fiyatlandırma",
  description:
    "KriptoBeyan bireysel ve mali müşavir planları: işlem hacminize göre şeffaf, yıllık fiyatlandırma. Ücretsiz planla başlayın.",
  alternates: { canonical: `${SITE_URL}/fiyatlandirma` },
};

function PlanCard({
  name,
  priceTRY,
  limitLabel,
  highlighted,
}: {
  name: string;
  priceTRY: string;
  limitLabel: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-7 ${
        highlighted
          ? "border-gold bg-marble-dark text-cream shadow-[0_16px_40px_-16px_rgba(28,32,25,0.5)]"
          : "border-gold/20 bg-parchment text-ink"
      }`}
    >
      <h3
        className={`text-sm font-semibold tracking-wide uppercase ${highlighted ? "text-gold-light" : "text-ink-soft"}`}
      >
        {name}
      </h3>
      <p className="mt-3 font-serif text-3xl font-semibold">
        {formatTRY(priceTRY)}
        {Number(priceTRY) > 0 && (
          <span
            className={`ml-1 text-base font-normal ${highlighted ? "text-cream/70" : "text-ink-soft"}`}
          >
            /yıl
          </span>
        )}
      </p>
      <p className={`mt-3 text-sm ${highlighted ? "text-cream/70" : "text-ink-soft"}`}>
        {limitLabel}
      </p>
      <Link
        href="/kayit-ol"
        className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] ${
          highlighted
            ? "bg-cream text-marble-dark"
            : "bg-marble-dark text-cream"
        }`}
      >
        Bu planla başla
      </Link>
    </div>
  );
}

export default async function FiyatlandirmaPage() {
  const plans = await getPlans();
  const individual = plans
    .filter((p) => p.type === "INDIVIDUAL")
    .sort((a, b) => Number(a.priceTRY) - Number(b.priceTRY));
  const accountant = plans
    .filter((p) => p.type === "ACCOUNTANT")
    .sort((a, b) => Number(a.priceTRY) - Number(b.priceTRY));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${SITE_NAME} Abonelik Planları`,
    description: "Kripto vergi hesaplama ve beyan asistanı abonelik planları.",
    offers: plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.priceTRY,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/fiyatlandirma`,
    })),
  };

  return (
    <main className="bg-cream">
      <JsonLd data={jsonLd} />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
            Fiyatlandırma
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            İşlem hacminize göre şeffaf fiyatlandırma
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Tüm planlarda taslak vergi raporu, otomatik FIFO hesaplama ve borsa/
            cüzdan bağlantısı yer alır. Fiyatlar yıllıktır, KDV dahildir.
          </p>
        </div>

        {individual.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Bireysel
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {individual.map((plan, i) => (
                <PlanCard
                  key={plan.id}
                  name={plan.name}
                  priceTRY={plan.priceTRY}
                  limitLabel={
                    plan.transactionLimit
                      ? `Yılda ${new Intl.NumberFormat("tr-TR").format(plan.transactionLimit)} işleme kadar`
                      : "Sınırsız işlem"
                  }
                  highlighted={i === Math.min(2, individual.length - 1)}
                />
              ))}
            </div>
          </div>
        )}

        {accountant.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Mali Müşavir
            </h2>
            <p className="mt-2 text-ink-soft">
              Müşteri sayısına göre ölçeklenen planlar — her müşteri erişimi
              davet bazlı ve sıkı yetkilendirme kontrolüyle sınırlıdır.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {accountant.map((plan) => (
                <PlanCard
                  key={plan.id}
                  name={plan.name}
                  priceTRY={plan.priceTRY}
                  limitLabel={
                    plan.clientLimit
                      ? `${plan.clientLimit} müşteriye kadar`
                      : "Sınırsız müşteri"
                  }
                />
              ))}
            </div>
          </div>
        )}

        {plans.length === 0 && (
          <p className="mt-16 text-center text-ink-soft">
            Plan bilgileri şu anda yüklenemiyor, lütfen daha sonra tekrar
            deneyin.
          </p>
        )}

        <p className="mt-16 text-center text-sm text-ink-soft/80">
          Ödemeler şu an manuel/admin onaylı olarak işlenmektedir; kart ile
          otomatik ödeme yakında eklenecektir.
        </p>
      </section>
    </main>
  );
}

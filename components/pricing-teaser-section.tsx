import Link from "next/link";
import { getPlans, formatTRY } from "@/lib/api";

export async function PricingTeaserSection() {
  const plans = await getPlans();
  const individual = plans
    .filter((p) => p.type === "INDIVIDUAL")
    .sort((a, b) => Number(a.priceTRY) - Number(b.priceTRY))
    .slice(0, 3);

  return (
    <section id="fiyatlandirma" className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
              Fiyatlandırma
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
              İşlem hacmine göre şeffaf fiyatlandırma
            </h2>
          </div>
          <Link
            href="/fiyatlandirma"
            className="text-sm font-semibold text-gold-deep underline underline-offset-4"
          >
            Tüm planları ve mali müşavir fiyatlarını gör →
          </Link>
        </div>

        {individual.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {individual.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border border-gold/20 bg-parchment p-7"
              >
                <h3 className="text-sm font-semibold tracking-wide text-ink-soft uppercase">
                  {plan.name}
                </h3>
                <p className="mt-3 font-serif text-3xl font-semibold text-ink">
                  {formatTRY(plan.priceTRY)}
                  {Number(plan.priceTRY) > 0 && (
                    <span className="ml-1 text-base font-normal text-ink-soft">
                      /yıl
                    </span>
                  )}
                </p>
                <p className="mt-3 text-sm text-ink-soft">
                  {plan.transactionLimit
                    ? `Yılda ${new Intl.NumberFormat("tr-TR").format(plan.transactionLimit)} işleme kadar`
                    : "Sınırsız işlem"}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

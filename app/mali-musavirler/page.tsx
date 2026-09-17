import type { Metadata } from "next";
import Link from "next/link";
import { AuthAwareCta } from "@/components/auth-aware-cta";
import { getPlans, formatTRY } from "@/lib/api";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mali Müşavirler İçin",
  description:
    "KriptoBeyan mali müşavir hesabı: kripto varlıklı müşterilerinizin portföyünü tek panelden yönetin, davet bazlı ve sıkı yetkilendirmeli erişimle.",
  alternates: { canonical: `${SITE_URL}/mali-musavirler` },
};

const STEPS = [
  {
    title: "Müşterinizi davet edin",
    desc: "Panelinizdeki \"Müşteri Davet Et\" ekranından müşterinizin e-posta adresini girin. Müşteriniz zaten KriptoBeyan kullanıyorsa, sizi kendi hesabından da davet edebilir.",
  },
  {
    title: "Müşteri onayı beklenir",
    desc: "Davet, müşterinizin e-postasına gider. Erişim yalnızca müşteri daveti kabul ettiğinde başlar — siz hiçbir zaman izinsiz bir hesaba erişemezsiniz.",
  },
  {
    title: "Portföyü ve vergi özetini görüntüleyin",
    desc: "Onaylanan her müşteri için borsa/cüzdan bağlantılarını, işlem geçmişini ve taslak vergi özetini tek panelden görürsünüz.",
  },
  {
    title: "Veri kalitesi uyarılarını kontrol edin",
    desc: "Eksik veri, negatif bakiye gibi hesaplamayı etkileyebilecek tutarsızlıklar otomatik işaretlenir — raporu onaylamadan önce görürsünüz.",
  },
];

const SECURITY_POINTS = [
  "Her müşteri erişimi davet bazlıdır — müşteri onaylamadan hiçbir veriyi göremezsiniz.",
  "Müşteri istediği an erişiminizi tek tıkla geri alabilir.",
  "Borsa API anahtarları AES-256-GCM ile şifreli saklanır, siz dahil kimse düz metin olarak göremez.",
  "Müşteri verisi kendi hesabında kalır — müşteriler arası hiçbir veri karışması olmaz.",
];

export default async function MaliMusavirlerPage() {
  const plans = await getPlans();
  const accountant = plans
    .filter((p) => p.type === "ACCOUNTANT")
    .sort((a, b) => Number(a.priceTRY) - Number(b.priceTRY));

  const basePerClient =
    accountant.length > 0 && accountant[0].clientLimit
      ? Number(accountant[0].priceTRY) / accountant[0].clientLimit
      : null;

  return (
    <main className="bg-cream">
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
        <span className="btn-gold-comet inline-flex">
          <span className="inline-flex items-center rounded-full bg-marble-dark px-4 py-1.5 text-xs font-semibold tracking-wide text-cream uppercase">
            Mali müşavirler için
          </span>
        </span>
        <h1 className="mt-5 font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Kripto varlıklı müşterilerinizi tek panelden yönetin
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Her müşteri için ayrı ayrı borsa ekran görüntüsü toplamayı,
          Excel&apos;e elle işlem girmeyi bırakın. KriptoBeyan&apos;ın mali
          müşavir hesabı, müşteri davet akışından taslak vergi özetine kadar
          tüm süreci tek panelde toplar.
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
            Bize yazın
          </Link>
        </div>

        {/* Nasil calisir */}
        <div className="mt-20">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            Nasıl çalışır
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="rounded-2xl border border-gold/25 bg-parchment p-6"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-marble-dark text-sm font-bold text-cream">
                  {i + 1}
                </span>
                <p className="mt-4 font-serif text-lg font-semibold text-ink">
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Guvenlik / izolasyon */}
        <div className="mt-20 rounded-2xl border border-gold/25 bg-marble-dark p-8 text-cream lg:p-10">
          <h2 className="font-serif text-2xl font-semibold">
            Veri güvenliği ve izolasyon
          </h2>
          <p className="mt-3 max-w-2xl text-cream/70">
            Her müşterinizin verisi kendi hesabında, ayrı ayrı tutulur.
            Erişiminiz her zaman müşterinin onayına bağlıdır ve müşteri bu
            onayı istediği an geri alabilir.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SECURITY_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 rounded-xl bg-white/[0.04] p-4 text-sm leading-relaxed text-cream/85"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-light" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Fiyatlandirma */}
        {accountant.length > 0 && (
          <div id="fiyatlandirma" className="mt-20 scroll-mt-24">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Müşteri sayısına göre fiyatlandırma
            </h2>
            <p className="mt-2 text-ink-soft">
              Fiyatlar yıllıktır, KDV dahildir. Ne kadar çok müşteri
              yönetirseniz, müşteri başına o kadar az ödersiniz.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {accountant.map((plan) => {
                const perClient =
                  basePerClient && plan.clientLimit
                    ? Number(plan.priceTRY) / plan.clientLimit
                    : null;
                const discount =
                  perClient && basePerClient
                    ? Math.max(0, Math.round((1 - perClient / basePerClient) * 100))
                    : 0;
                return (
                  <div
                    key={plan.id}
                    className="rounded-2xl border border-gold/20 bg-parchment p-7 text-ink"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                        {plan.name}
                      </h3>
                      {discount > 0 && (
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-gold-deep">
                          Müşteri başı %{discount} indirim
                        </span>
                      )}
                    </div>
                    <p className="mt-3 font-serif text-3xl font-semibold">
                      {formatTRY(plan.priceTRY)}
                      <span className="ml-1 text-base font-normal text-ink-soft">
                        /yıl
                      </span>
                    </p>
                    <p className="mt-3 text-sm text-ink-soft">
                      {plan.clientLimit
                        ? `${plan.clientLimit} müşteriye kadar`
                        : "Sınırsız müşteri"}
                    </p>
                    <AuthAwareCta
                      planId={plan.id}
                      className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-transform hover:scale-[1.02]"
                    >
                      Bu planla başla
                    </AuthAwareCta>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

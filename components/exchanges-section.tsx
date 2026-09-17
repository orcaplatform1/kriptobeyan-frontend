import { LIVE_EXCHANGES, UPCOMING_EXCHANGES } from "@/lib/exchanges";
import { ExchangeLogoBox } from "@/components/exchange-logo-box";

export function ExchangesSection() {
  return (
    <section className="bg-parchment py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
            Desteklenen borsalar
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
            Türkiye&apos;nin ve Dünyanın Lider Borsaları
          </h2>
          <p className="mt-3 text-sm text-ink-soft/80">
            {LIVE_EXCHANGES.length} borsa + 3 blockchain ağıyla canlı bağlantı,
            üstüne CSV içe aktarma ile sınırsız borsa ve cüzdan desteği.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          {LIVE_EXCHANGES.map((name) => (
            <span
              key={name}
              className="flex items-center justify-center rounded-xl border border-gold/25 bg-cream p-2"
            >
              <ExchangeLogoBox name={name} />
            </span>
          ))}
          {UPCOMING_EXCHANGES.map((name) => (
            <span
              key={name}
              className="flex flex-col items-center gap-1 rounded-xl border border-ink/10 bg-cream/60 p-2"
            >
              <ExchangeLogoBox name={name} />
              <span className="text-[0.65rem] font-semibold tracking-wide text-ink-soft/60 uppercase">
                Yakında
              </span>
            </span>
          ))}
        </div>

        <p className="mt-6 text-sm text-ink-soft/80">
          On-chain okuma ile Ethereum, BSC ve Bitcoin cüzdan adresleri de
          desteklenir. Listede borsanızı göremiyor musunuz? İşlem geçmişinizi
          CSV olarak dışa aktarıp panelden içe aktarabilir, ekstra beklemeden
          hesaplamaya dahil edebilirsiniz —{" "}
          <a href="/iletisim" className="text-gold-deep underline underline-offset-2">
            entegrasyon talebi
          </a>{" "}
          için de bize yazabilirsiniz.
        </p>

        <a
          href="/desteklenen-borsalar"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep underline underline-offset-2"
        >
          Tüm borsaları, cüzdanları ve CSV desteğini gör →
        </a>
      </div>
    </section>
  );
}

import { LIVE_EXCHANGES, UPCOMING_EXCHANGES } from "@/lib/exchanges";
import { ExchangeLogoBox } from "@/components/exchange-logo-box";

// Küresel borsalar: "Binance TR"'dan önce gelenler + Crypto.com (upcoming)
const splitIdx = LIVE_EXCHANGES.indexOf("Binance TR");
const GLOBAL_LIVE = LIVE_EXCHANGES.slice(0, splitIdx);
const TR_LIVE = LIVE_EXCHANGES.slice(splitIdx);

// Upcoming: Crypto.com → küresel, Bitexen → TR
const GLOBAL_UPCOMING = UPCOMING_EXCHANGES.filter((n) => n === "Crypto.com");
const TR_UPCOMING = UPCOMING_EXCHANGES.filter((n) => n !== "Crypto.com");

type ExchangeItem = { name: string; upcoming: boolean };

const GLOBAL_ROW: ExchangeItem[] = [
  ...GLOBAL_LIVE.map((n) => ({ name: n, upcoming: false })),
  ...GLOBAL_UPCOMING.map((n) => ({ name: n, upcoming: true })),
];

const TR_ROW: ExchangeItem[] = [
  ...TR_LIVE.map((n) => ({ name: n, upcoming: false })),
  ...TR_UPCOMING.map((n) => ({ name: n, upcoming: true })),
];

function ExchangeBadge({ name, upcoming }: ExchangeItem) {
  return (
    <span
      className={`flex shrink-0 flex-col items-center gap-1 border border-gold/[0.1] bg-marble-dark-2/50 p-3 ${upcoming ? "opacity-40" : ""}`}
    >
      <ExchangeLogoBox name={name} />
      {upcoming && (
        <span className="text-[0.6rem] font-semibold tracking-wide text-cream/40 uppercase">
          Yakında
        </span>
      )}
    </span>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: ExchangeItem[];
  reverse?: boolean;
}) {
  const trackClass = reverse ? "marquee-track-reverse" : "marquee-track";
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-marble-dark to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-marble-dark to-transparent sm:w-28" />
      <div className={`${trackClass} flex gap-3 py-2`}>
        {[...items, ...items].map((ex, i) => (
          <ExchangeBadge key={i} name={ex.name} upcoming={ex.upcoming} />
        ))}
      </div>
    </div>
  );
}

export function ExchangesSection() {
  return (
    <section className="relative overflow-hidden bg-marble-dark py-8 lg:py-28">
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gold/[0.04] blur-[100px]" />

      {/* Başlık hemen marquee'nin üstünde */}
      <div className="container-edit relative mb-4 lg:mb-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.15em] text-gold-light uppercase">
            Desteklenen borsalar
          </p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-cream sm:text-3xl lg:text-4xl">
            Türkiye&apos;nin ve Dünyanın Lider Borsaları
          </h2>
          <p className="mt-2 hidden text-sm text-cream/50 lg:block">
            {LIVE_EXCHANGES.length} borsa + 3 blockchain ağıyla canlı bağlantı,
            üstüne CSV içe aktarma ile sınırsız borsa ve cüzdan desteği.
          </p>
        </div>
      </div>

      {/* Üst satır: küresel borsalar (soldan sağa) */}
      <MarqueeRow items={GLOBAL_ROW} />

      {/* Alt satır: Türk borsaları (sağdan sola) */}
      <div className="mt-3">
        <MarqueeRow items={TR_ROW} reverse />
      </div>

      <div className="container-edit relative mt-8">
        <p className="text-sm text-cream/45">
          On-chain okuma ile Ethereum, BSC ve Bitcoin cüzdan adresleri de
          desteklenir. Listede borsanızı göremiyor musunuz?{" "}
          <a href="/iletisim" className="text-gold-light underline underline-offset-2">
            Entegrasyon talebi
          </a>{" "}
          için bize yazabilirsiniz.
        </p>
        <a
          href="/desteklenen-borsalar"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-light transition-colors hover:text-gold"
        >
          Tüm borsaları, cüzdanları ve CSV desteğini gör →
        </a>
      </div>
    </section>
  );
}

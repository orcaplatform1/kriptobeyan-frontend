import { LIVE_EXCHANGES, UPCOMING_EXCHANGES } from "@/lib/exchanges";
import { EXCHANGE_LOGOS } from "@/lib/exchange-logos";

// Binance/OKX/KuCoin/Coinbase icin Simple Icons'tan (CC0 lisans, gercek
// marka SVG'si) gelen ikon var. Digerleri (Bybit, Kraken, BTCTurk, Paribu,
// Bitexen, ICRYPEX, Bitci, Gate.io, Bitget, HTX, MEXC, Crypto.com) icin
// lisansli/dogrulanmis bir kaynak yok — o borsalar bas harf rozetine duser.
function ExchangeBadge({ name, dim }: { name: string; dim?: boolean }) {
  const logo = EXCHANGE_LOGOS[name];
  if (logo) {
    return (
      <svg
        role="img"
        aria-hidden
        viewBox={logo.viewBox}
        className={`h-4 w-4 shrink-0 ${dim ? "opacity-50" : ""}`}
        fill={logo.color}
      >
        <path d={logo.path} />
      </svg>
    );
  }
  return (
    <span
      aria-hidden
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold ${
        dim
          ? "bg-ink-soft/15 text-ink-soft/70"
          : "bg-marble-dark text-gold-light"
      }`}
    >
      {name.charAt(0)}
    </span>
  );
}

export function ExchangesSection() {
  return (
    <section className="bg-parchment py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
            Desteklenen borsalar
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
            Türkiye&apos;nin önde gelen borsaları ve global tier-1 borsalar
          </h2>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {LIVE_EXCHANGES.map((name) => (
            <span
              key={name}
              className="flex items-center gap-2 rounded-full border border-gold/25 bg-cream px-4 py-2 text-sm font-medium text-ink"
            >
              <ExchangeBadge name={name} />
              {name}
            </span>
          ))}
          {UPCOMING_EXCHANGES.map((name) => (
            <span
              key={name}
              className="flex items-center gap-2 rounded-full border border-ink/10 bg-cream/60 px-4 py-2 text-sm font-medium text-ink-soft/70"
            >
              <ExchangeBadge name={name} dim />
              {name}
              <span className="text-[0.65rem] font-semibold tracking-wide text-gold-deep/80 uppercase">
                Yakında
              </span>
            </span>
          ))}
        </div>

        <p className="mt-6 text-sm text-ink-soft/80">
          On-chain okuma ile Ethereum, BSC ve Bitcoin cüzdan adresleri de
          desteklenir. Listede borsanızı göremiyor musunuz?{" "}
          <a href="/iletisim" className="text-gold-deep underline underline-offset-2">
            Bize yazın
          </a>
          .
        </p>
      </div>
    </section>
  );
}

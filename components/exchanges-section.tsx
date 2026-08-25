import Image from "next/image";
import { LIVE_EXCHANGES, UPCOMING_EXCHANGES } from "@/lib/exchanges";

// Gercek borsa logo PNG/WebP dosyalari public/borsalar/ altinda (kullanici
// tarafindan eklendi) — isim anahtari LIVE_EXCHANGES/UPCOMING_EXCHANGES'teki
// degerle ayni, dosya adi sadece buyuk/kucuk harf veya nokta farkli oldugu
// icin bu eslesme tablosu var.
const EXCHANGE_LOGO_FILES: Record<string, string> = {
  Binance: "Binance.png",
  Bybit: "Bybit.png",
  OKX: "OKX.png",
  "Binance TR": "BinanceTR.png",
  "OKX TR": "OkxTR.png",
  "Bybit TR": "BybitTR.png",
  Coinbase: "Coinbase.png",
  Kraken: "Kraken.png",
  KuCoin: "Kucoin.png",
  BTCTurk: "BtcTurk.png",
  "Gate.io": "gateio.png",
  HTX: "HTX.png",
  Bitget: "Bitget.png",
  MEXC: "Mexc.png",
  "Crypto.com": "Crypto.com.png",
  Paribu: "paribu.png",
  Bitexen: "Bitexen.png",
  ICRYPEX: "icrypex.webp",
};

// Kutunun kendisi sabit boyutta (w-28 h-14) — kaynak PNG'lerin en-boy orani
// birbirinden çok farklı (bazıları kare ikon, bazıları genis yazi logosu),
// object-contain ile hepsi bu AYNI kutunun icine sigacak sekilde olceklenir,
// tasma/kirpilma olmaz. Yakinda etiketindeki logo da (kullanici istegi)
// SOLUK degil, tam renkli/opak kalir — sadece "Yakında" yazisi soluk.
function ExchangeLogoBox({ name }: { name: string }) {
  const file = EXCHANGE_LOGO_FILES[name];
  return (
    <span className="relative block h-14 w-28 shrink-0">
      {file ? (
        <Image
          src={`/borsalar/${file}`}
          alt={name}
          fill
          sizes="112px"
          className="object-contain"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center rounded-lg bg-marble-dark text-sm font-bold text-gold-light">
          {name.charAt(0)}
        </span>
      )}
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
            Türkiye&apos;nin ve Dünyanın Lider Borsaları
          </h2>
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

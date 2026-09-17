import Image from "next/image";

// Gercek borsa logo PNG/WebP dosyalari public/borsalar/ altinda (kullanici
// tarafindan eklendi) — isim anahtari LIVE_EXCHANGES/UPCOMING_EXCHANGES'teki
// degerle ayni, dosya adi sadece buyuk/kucuk harf veya nokta farkli oldugu
// icin bu eslesme tablosu var. exchanges-section.tsx ve /desteklenen-borsalar
// sayfasi arasinda paylasilir.
export const EXCHANGE_LOGO_FILES: Record<string, string> = {
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
export function ExchangeLogoBox({ name }: { name: string }) {
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

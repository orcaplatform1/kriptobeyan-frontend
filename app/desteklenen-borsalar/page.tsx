import type { Metadata } from "next";
import { LIVE_EXCHANGES, UPCOMING_EXCHANGES } from "@/lib/exchanges";
import { ExchangeLogoBox } from "@/components/exchange-logo-box";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Desteklenen Borsalar ve Cüzdanlar",
  description:
    "KriptoBeyan'ın canlı API ile bağlandığı borsalar, on-chain okuduğu cüzdan ağları ve CSV içe aktarma ile pratikte sınırsız borsa/cüzdan desteği.",
  alternates: { canonical: `${SITE_URL}/desteklenen-borsalar` },
};

// WALLET_CHAIN_LABELS (lib/auth-client.ts) ile ayni ag isimleri — o dosya
// "use client" API katmani oldugu icin buraya sade bir sabit olarak
// kopyalandi (yalnizca goruntuleme amacli, mantik icermez).
const WALLET_NETWORKS = [
  { name: "Ethereum", desc: "ETH ve ERC-20 token hareketleri" },
  { name: "BNB Smart Chain", desc: "BNB ve BEP-20 token hareketleri" },
  { name: "Bitcoin", desc: "BTC cüzdan hareketleri" },
];

const TOTAL_LIVE = LIVE_EXCHANGES.length + WALLET_NETWORKS.length;

export default function DesteklenenBorsalarPage() {
  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
        <span className="btn-gold-comet inline-flex">
          <span className="inline-flex items-center rounded-full bg-marble-dark px-4 py-1.5 text-xs font-semibold tracking-wide text-cream uppercase">
            Entegrasyonlar
          </span>
        </span>
        <h1 className="mt-5 font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Desteklenen Borsalar ve Cüzdanlar
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {LIVE_EXCHANGES.length} borsa ve {WALLET_NETWORKS.length} blockchain ağıyla
          doğrudan, canlı bağlantımız var — toplam {TOTAL_LIVE} kaynak. Bunların
          dışında kalan her borsa ve cüzdan için de CSV/Excel içe aktarma ile
          pratikte sınırsız destek sağlıyoruz.
        </p>

        {/* Canli API */}
        <div className="mt-16">
          <h2 className="font-serif text-xl font-semibold text-ink">
            Canlı API bağlantısı ({LIVE_EXCHANGES.length})
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft/80">
            API anahtarınızı salt-okunur izinle bağlarsınız, işlem geçmişiniz
            otomatik senkronize olur — elle bir şey yapmanız gerekmez.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {LIVE_EXCHANGES.map((name) => (
              <span
                key={name}
                className="flex items-center justify-center rounded-xl border border-gold/25 bg-parchment p-2"
              >
                <ExchangeLogoBox name={name} />
              </span>
            ))}
            {UPCOMING_EXCHANGES.map((name) => (
              <span
                key={name}
                className="flex flex-col items-center gap-1 rounded-xl border border-ink/10 bg-parchment/60 p-2"
              >
                <ExchangeLogoBox name={name} />
                <span className="text-[0.65rem] font-semibold tracking-wide text-ink-soft/60 uppercase">
                  Yakında
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* On-chain cuzdanlar */}
        <div className="mt-16">
          <h2 className="font-serif text-xl font-semibold text-ink">
            On-chain cüzdan okuma ({WALLET_NETWORKS.length})
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft/80">
            Herhangi bir borsaya değil, doğrudan zincire bağlanıp cüzdan
            adresinizin hareketlerini okuruz — özel anahtarınız hiçbir zaman
            istenmez.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {WALLET_NETWORKS.map((w) => (
              <div
                key={w.name}
                className="rounded-xl border border-gold/25 bg-parchment p-5"
              >
                <p className="font-serif text-lg font-semibold text-ink">{w.name}</p>
                <p className="mt-1 text-sm text-ink-soft/80">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CSV */}
        <div className="mt-16 rounded-2xl border border-gold/25 bg-parchment p-8 lg:p-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            CSV/Excel ile sınırsız destek
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft/80">
            Yukarıdaki listede olmayan bir borsa mı kullanıyorsunuz? Türkiye&apos;de
            veya yurt dışında, işlem geçmişini CSV/Excel olarak dışa
            aktarabilen <strong className="text-ink">herhangi bir borsa veya cüzdan</strong>,
            KriptoBeyan&apos;a içe aktarılabilir — sayı sınırı yok. Panelinizdeki
            &quot;CSV içe aktar&quot; sekmesinden örnek şablonu indirip
            doldurmanız yeterli; sistem satırları otomatik doğrular ve normal
            FIFO hesabınıza dahil eder.
          </p>
          <ol className="mt-5 max-w-2xl space-y-2 text-sm text-ink-soft/90">
            <li>1. Borsanızdan/cüzdanınızdan işlem geçmişini dışa aktarın.</li>
            <li>2. Panelde &quot;CSV içe aktar&quot; sekmesinden örnek şablonu indirin.</li>
            <li>3. Verinizi şablona uyarlayıp yükleyin — kalanını sistem yapar.</li>
          </ol>
          <a
            href="/kriptobeyan-csv-sablonu.csv"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep underline underline-offset-2"
          >
            Örnek CSV şablonunu indir
          </a>
        </div>

        <p className="mt-10 text-sm text-ink-soft/70">
          Sık kullandığınız bir borsa için doğrudan API entegrasyonu istiyorsanız{" "}
          <a href="/iletisim" className="text-gold-deep underline underline-offset-2">
            bize yazın
          </a>
          , değerlendirip listeye ekleyelim.
        </p>
      </div>
    </main>
  );
}

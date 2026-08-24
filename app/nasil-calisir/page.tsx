import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { AuthAwareCta } from "@/components/auth-aware-cta";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Nasıl Çalışır",
  description:
    "KriptoBeyan'a borsa API anahtarınızı ve cüzdanınızı nasıl bağlarsınız, verileriniz nasıl birleştirilir, FIFO vergi hesaplaması nasıl yapılır ve taslak raporda tam olarak neler olur — adım adım, ayrıntılı anlatım.",
  alternates: { canonical: `${SITE_URL}/nasil-calisir` },
};

export default function NasilCalisirPage() {
  return (
    <LegalPageShell
      title="Nasıl Çalışır"
      updated="24 Ağustos 2026"
      intro="KriptoBeyan, kripto vergi beyanının en zaman alıcı kısmını — borsa/cüzdan verilerini birleştirip FIFO yöntemiyle hesaplamayı — otomatikleştirir. Aşağıda dört adımın her birini, API anahtarının nasıl alınacağından raporun içeriğine kadar ayrıntılarıyla anlatıyoruz."
    >
      <h2>Genel bakış</h2>
      <p>
        Süreç dört adımdan oluşur: (1) borsa hesaplarınızı ve/veya
        cüzdanlarınızı bağlarsınız, (2) sistem tüm işlemlerinizi tek bir
        zaman çizelgesinde birleştirir, (3) gerçekleşen kazanç/kayıplar FIFO
        yöntemiyle TL bazında hesaplanır, (4) PDF/Excel formatında bir taslak
        beyan raporu indirirsiniz. Hiçbir aşamada hesabınızdan para çekme
        yetkisi istenmez veya kullanılmaz.
      </p>

      <h2>Adım 1: Hesaplarını bağla</h2>
      <h3>Borsa API anahtarı ile bağlantı</h3>
      <p>
        Panelinizde &quot;Hesap Bağla&quot; ekranından borsanızı seçip API
        anahtarınızı (API Key) ve gizli anahtarınızı (Secret Key)
        girersiniz. Bir API anahtarı oluştururken izlenecek genel adımlar,
        neredeyse tüm borsalarda aynı mantığı takip eder:
      </p>
      <ul>
        <li>
          Borsanızın web sitesinde <strong>Hesap / Güvenlik / API Yönetimi</strong>{" "}
          bölümüne girin (örn. Binance&apos;te &quot;Hesap → API
          Yönetimi&quot;, Kraken&apos;de &quot;Security → API&quot;, BTCTurk&apos;te
          &quot;Hesap Ayarları → API&quot;).
        </li>
        <li>
          Yeni bir API anahtarı oluşturun ve iznini{" "}
          <strong>yalnızca &quot;Okuma&quot; (Read / Query / Enable
          Reading)</strong> olarak işaretleyin. &quot;Para Çekme
          (Withdraw)&quot; ve &quot;İşlem Açma (Trade/Spot &amp; Margin
          Trading)&quot; izinlerini <strong>kapalı bırakın</strong> —
          KriptoBeyan bu izinlere hiçbir zaman ihtiyaç duymaz ve zaten böyle
          bir izinle gelen anahtarları sistem otomatik olarak reddeder.
        </li>
        <li>
          İsterseniz ek güvenlik için IP kısıtlaması (IP whitelist)
          tanımlayabilirsiniz; bu isteğe bağlıdır, KriptoBeyan tarafında
          zorunlu değildir.
        </li>
        <li>
          Oluşan API Key ve Secret Key değerlerini kopyalayıp panelimizdeki
          ilgili alanlara yapıştırın. Kaydettikten sonra anahtarınız
          AES-256-GCM ile şifrelenir ve arayüzde bir daha tam olarak
          gösterilmez (bkz.{" "}
          <a href="/guvenlik">Güvenlik</a> sayfası).
        </li>
      </ul>
      <p>
        Şu anda tam entegre borsalar: Binance, Binance TR, Bybit, Bybit TR,
        OKX, OKX TR, BTCTurk, Kraken, KuCoin, Coinbase, Gate.io, HTX, Bitget,
        MEXC, Paribu ve ICRYPEX. Bitexen ve Crypto.com entegrasyonları yakında
        ekleniyor — bu arada söz konusu borsadan aldığınız işlem dökümünü CSV
        olarak da içe aktarabilirsiniz.
      </p>

      <h3>Cüzdan adresi ile bağlantı (on-chain)</h3>
      <p>
        Ethereum, BSC (BNB Smart Chain) ve Bitcoin ağlarında kendi{" "}
        <strong>genel (public) cüzdan adresinizi</strong> ekleyebilirsiniz —
        cüzdan uygulamanızda &quot;Adresi Kopyala&quot; ile aldığınız,
        0x... veya bc1... ile başlayan adres. Özel anahtarınızı (private
        key) veya cüzdan kurtarma ifadenizi (seed phrase) hiçbir zaman
        girmeniz istenmez; sistem yalnızca genel blok zinciri verisini okur.
      </p>

      <h3>CSV içe aktarma</h3>
      <p>
        Bağlamak istediğiniz borsa henüz API ile desteklenmiyorsa, borsanın
        kendi arayüzünden indirdiğiniz işlem geçmişi dökümünü (CSV) panelden
        yükleyerek yine tüm işlemlerinizi hesaba katabilirsiniz.
      </p>

      <h2>Adım 2: Otomatik birleştirme</h2>
      <p>
        Bağladığınız her kaynaktan (birden fazla borsa, birden fazla cüzdan,
        CSV) gelen işlemler tek bir zaman çizelgesinde birleştirilir.
        Bu aşamada sistem şunları otomatik olarak yapar:
      </p>
      <ul>
        <li>
          <strong>İç transfer tespiti:</strong> Kendi hesaplarınız arasındaki
          transferler (borsadan cüzdana, cüzdandan borsaya, farklı
          borsalarınız arasında) tespit edilip vergilendirilebilir
          kazanç/kayıp hesabından hariç tutulur — sadece gerçek satış (SELL)
          veya bir kripto varlığın başka bir kripto varlığa çevrildiği trade
          işlemleri vergilendirilebilir olay sayılır.
        </li>
        <li>
          <strong>Tutarlılık uyarıları:</strong> Eksik geçmiş (örn. bir
          borsadan sadece son 90 günün verisi çekilebildiyse) veya negatif
          bakiyeye yol açan bir işlem sırası tespit edilirse, bu durumlar
          raporun taslak olmasının bir nedeni olarak ayrıca işaretlenir; siz
          raporu indirmeden önce görüp düzeltebilirsiniz.
        </li>
      </ul>

      <h2>Adım 3: FIFO ile kripto vergi hesaplama</h2>
      <p>
        Gerçekleşen kazanç ve kayıplar <strong>FIFO (İlk Giren İlk
        Çıkar)</strong> yöntemiyle hesaplanır: bir varlığı sattığınızda,
        maliyet olarak o varlıktan elinizde en uzun süredir duran (ilk
        alınan) lot esas alınır. Hesaplama şu şekilde ilerler:
      </p>
      <ul>
        <li>
          Her alım (BUY) işlemi ayrı bir &quot;lot&quot; olarak kaydedilir;
          her satış (SELL) işlemi, mevcut lotlardan FIFO sırasıyla
          düşülerek eşleştirilir.
        </li>
        <li>
          Hem alım hem satış anındaki tutar,{" "}
          <strong>işlem anındaki güncel TCMB döviz kuru</strong> üzerinden
          TL&apos;ye çevrilir; kazanç/kayıp bu iki TL değeri arasındaki
          farktır.
        </li>
        <li>
          Yasal <strong>istisna tutarları</strong> otomatik uygulanır ve
          dönem içindeki gerçekleşmiş zararlar kazançlardan otomatik olarak{" "}
          <strong>mahsup</strong> edilir.
        </li>
      </ul>

      <h2>Adım 4: Taslak rapor</h2>
      <p>
        Hesaplama tamamlandığında PDF ve Excel formatında bir taslak beyan
        raporu oluşur. Rapor şunları içerir:
      </p>
      <ul>
        <li>Dönem içindeki tüm alım/satım işlemlerinin tam listesi (tarih, borsa/cüzdan, sembol, miktar, birim fiyat, TL karşılığı).</li>
        <li>Her satışın FIFO ile hangi alım lotuyla eşleştiği (lot bazlı eşleşme dökümü).</li>
        <li>Lot bazında ve toplamda gerçekleşen kazanç/kayıp (TL).</li>
        <li>Uygulanan istisna tutarı ve varsa mahsup edilen geçmiş dönem zararı.</li>
        <li>İç transfer olarak hariç tutulan işlemlerin ayrı bir dökümü (şeffaflık için).</li>
        <li>Dönem sonu özet toplamları (toplam kazanç, toplam kayıp, net vergilendirilebilir tutar).</li>
        <li>Rapor genelinde &quot;taslak/tahmini&quot; uyarısı ve varsa veri tutarsızlığı notları.</li>
      </ul>
      <p>
        Raporu doğrudan panelden indirebilir, ya da tek bir paylaşım
        linkiyle mali müşavirinize gönderip incelettirebilirsiniz — ayrıca
        dosya e-postalaşmanıza gerek kalmaz. KriptoBeyan bir vergi
        danışmanlık hizmeti değildir; nihai beyanınızda raporu bir mali
        müşavirle birlikte teyit etmenizi öneririz (bkz.{" "}
        <a href="/sorumluluk-reddi">Sorumluluk Reddi</a>).
      </p>

      <h2>Güvenlik özeti</h2>
      <p>
        API anahtarlarınız yalnızca salt-okunur olarak kabul edilir, AES-256-GCM
        ile şifrelenir ve uygulama hiçbir aşamada para çekme, transfer veya
        alım-satım emri gönderemez. Ayrıntılar için{" "}
        <a href="/guvenlik">Güvenlik</a> sayfamıza bakabilirsiniz.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3 not-prose">
        <AuthAwareCta className="inline-flex items-center justify-center rounded-full bg-marble-dark px-6 py-3 text-sm font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(28,32,25,0.5)] transition-transform hover:scale-[1.03] hover:bg-marble-dark-2">
          Ücretsiz Başla
        </AuthAwareCta>
        <a
          href="/sss"
          className="inline-flex items-center justify-center rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-gold/40 hover:text-gold-deep"
        >
          Sık Sorulan Sorular
        </a>
      </div>
    </LegalPageShell>
  );
}

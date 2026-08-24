import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description:
    "KriptoBeyan hakkında sık sorulan sorular: vergi tavsiyesi, veri güvenliği, borsa bağlantıları, fiyatlandırma ve daha fazlası.",
  alternates: { canonical: `${SITE_URL}/sss` },
};

const faqGroups: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Vergi ve hesaplama",
    items: [
      {
        q: "KriptoBeyan bana vergi tavsiyesi mi veriyor?",
        a: "Hayır. KriptoBeyan bir vergi danışmanlık hizmeti değil, bir vergi hesaplama hizmetidir: işlemlerinizi FIFO yöntemiyle ve güncel mevzuata göre hesaplar, size taslak bir rapor çıkarır. Kişiye özel danışmanlık gerektiren durumlarda (örneğin karma gelir kaynakları, yurt dışı borsa kullanımı veya miras/hibe yoluyla edinilen kripto varlıklar) ya da nihai beyanınızda mutlaka bir mali müşavirle birlikte çalışmanızı öneririz. Ayrıntılar için Sorumluluk Reddi sayfamıza bakın.",
      },
      {
        q: "Hangi hesaplama yöntemini kullanıyorsunuz?",
        a: "Şu an için yalnızca FIFO (İlk Giren İlk Çıkar) yöntemi destekleniyor; bu yöntem Türkiye'deki genel muhasebe uygulamasıyla en uyumlu ve denetimde en az tartışmaya açık yöntem olduğu için tercih edildi. LIFO veya ağırlıklı ortalama maliyet gibi farklı yöntemler, talep olması halinde ileride eklenebilir.",
      },
      {
        q: "Borsadan cüzdanıma yaptığım transferler vergilendiriliyor mu?",
        a: "Hayır — kendi hesaplarınız arasındaki (borsadan cüzdana, cüzdandan borsaya, hatta farklı borsalarınız arasındaki) transferler otomatik olarak tespit edilip vergilendirilebilir kazanç/kayıp hesabından hariç tutulur. Sadece gerçek satış işlemleri (SELL, ya da bir kripto varlığın başka bir kripto varlığa çevrildiği trade işlemleri) vergilendirilebilir olay olarak değerlendirilir.",
      },
      {
        q: "Zararlarımı sonraki döneme taşıyabilir miyim (zarar mahsubu)?",
        a: "Evet, sistem aynı dönem içindeki gerçekleşmiş zararları kazançlardan otomatik olarak mahsup eder. Döneme taşınabilecek zarar tutarları taslak raporunuzda ayrıca gösterilir; nihai mahsup hakkının uygulanabilirliğini mali müşavirinizle teyit etmenizi öneririz.",
      },
      {
        q: "Rakamlar neden 'taslak/tahmini' olarak işaretleniyor?",
        a: "Otomatik hesaplama, girdiğiniz/bağladığınız verinin doğruluğuna ve eksiksizliğine bağlıdır (örneğin başka bir platformda gerçekleşmiş ama sisteme hiç bağlanmamış bir işlem hesaba katılamaz) ve mali müşavir onayından geçmemiştir. Bu nedenle her raporda taslak/tahmini uyarısı yer alır; nihai beyan öncesi bir mali müşavirin kontrolünden geçirilmesini tavsiye ederiz.",
      },
    ],
  },
  {
    title: "Güvenlik ve veri",
    items: [
      {
        q: "Borsa API anahtarlarım güvende mi?",
        a: "API anahtarlarınız AES-256-GCM ile şifrelenerek saklanır ve şifreleme anahtarı uygulamanın kendi ortam değişkenlerinden ayrı, erişimi kısıtlı bir konumda tutulur. Yalnızca salt-okunur (read-only) izinli anahtarlar kabul edilir — para çekme (withdraw) veya işlem açma (trade) izni istenmez ve böyle bir izinle gelen anahtarlar reddedilir. Ayrıntılar için Güvenlik sayfamıza bakın.",
      },
      {
        q: "Uygulamanın hesabımdan para çekme yetkisi var mı?",
        a: "Hayır, kesinlikle yok. Bağladığınız API anahtarlarının salt-okunur olması zorunludur; bu sayede KriptoBeyan yalnızca işlem geçmişinizi ve bakiyenizi okuyabilir, hiçbir şekilde para çekme, transfer veya alım-satım emri gönderemez.",
      },
      {
        q: "Hesabımı ve verilerimi silebilir miyim?",
        a: "Evet. Hesap ayarlarınızdan veya destek ekibimize yazarak hesabınızı ve ilişkili tüm verilerinizi (bağlı borsa/cüzdan bilgileri, işlem geçmişi, raporlar dahil) kalıcı olarak silme talebinde bulunabilirsiniz. Detaylar için Gizlilik Politikası ve KVKK Aydınlatma Metni sayfalarına bakın.",
      },
      {
        q: "Verilerim üçüncü taraflarla paylaşılıyor mu?",
        a: "Hayır, verileriniz pazarlama amacıyla üçüncü taraflarla paylaşılmaz veya satılmaz. Yalnızca hizmetin çalışması için gerekli alt yükleniciler (barındırma, e-posta gönderimi vb.) sınırlı ölçüde ve yalnızca hizmeti sağlamak amacıyla veriye erişebilir. Detaylar için Gizlilik Politikası sayfamıza bakın.",
      },
    ],
  },
  {
    title: "Borsalar ve entegrasyon",
    items: [
      {
        q: "Hangi borsalar destekleniyor?",
        a: "Binance, Bybit, OKX, BTCTurk, Kraken, KuCoin ve Coinbase şu anda tam destekleniyor. Paribu, Bitexen, ICRYPEX, Bitci, Gate.io, Bitget, HTX, MEXC ve Crypto.com entegrasyonları yakında ekleniyor. Listedeki bir borsayı kullanmıyorsanız CSV içe aktarımıyla da işlem geçmişinizi ekleyebilirsiniz.",
      },
      {
        q: "On-chain cüzdan takibi nasıl çalışır?",
        a: "Ethereum, BSC ve Bitcoin ağlarındaki genel (public) cüzdan adresinizi eklediğinizde, adresle ilişkili on-chain işlemler otomatik olarak okunup zaman çizelgenize dahil edilir. Bu işlem tamamen genel blok zinciri verisi üzerinden yapılır; özel anahtarınız (private key) hiçbir aşamada istenmez veya saklanmaz.",
      },
      {
        q: "Listede borsamı/cüzdan ağımı göremiyorum, ne yapmalıyım?",
        a: "Anasayfadaki 'Desteklenen Borsalar' bölümünün altındaki bağlantıdan bize yazabilirsiniz; talep sıklığına göre yeni borsa ve ağ entegrasyonlarını önceliklendiriyoruz. Bu arada ilgili borsanızdan aldığınız CSV dökümünü içe aktararak işlemlerinizi yine de hesaba katabilirsiniz.",
      },
    ],
  },
  {
    title: "Hesap ve fiyatlandırma",
    items: [
      {
        q: "Ücretsiz plan var mı?",
        a: "Evet, sınırlı işlem hacmiyle ücretsiz bir plan sunuyoruz; bu planla temel hesaplama ve taslak rapor özelliklerini deneyebilirsiniz. Daha yüksek işlem hacmi, ek borsa/cüzdan bağlantısı ve mali müşavir paylaşımı gibi özellikler için ücretli planlarımız mevcuttur. Tüm planlar için Fiyatlandırma sayfamıza bakabilirsiniz.",
      },
      {
        q: "Yıl ortasında üye olursam geçmiş işlemlerim de hesaplanır mı?",
        a: "Evet. Borsa hesabınızı veya cüzdanınızı bağladığınızda sistem, o hesaba ait geçmişe dönük tüm işlem verisini (borsanın API'sinin izin verdiği ölçüde) çeker ve FIFO hesaplamasına dahil eder; üyeliğinizin başlangıç tarihiyle sınırlı değildir.",
      },
      {
        q: "Birden fazla borsa veya cüzdan bağlarsam ek ücret öder miyim?",
        a: "Plan seviyenize bağlı olarak belirli sayıda hesap/cüzdan bağlantısı dahildir; bu sınırın üzerine çıkmak istediğinizde bir üst plana geçmeniz gerekebilir. Güncel limitler için Fiyatlandırma sayfamızdaki plan karşılaştırmasına bakabilirsiniz.",
      },
      {
        q: "Mali müşavirim benim verilerime nasıl erişiyor?",
        a: "Mali müşaviriniz size bir davet gönderir; siz kabul etmeden erişim başlamaz. Kabul ettikten sonra bile mali müşavir yalnızca vergi özeti ve veri tutarlılık uyarılarınızı görebilir — borsa API anahtarlarınıza veya ham işlem detaylarınıza asla erişemez. Erişimi dilediğiniz zaman geri alabilirsiniz.",
      },
      {
        q: "Aboneliğimi iptal edebilir miyim?",
        a: "Evet, dilediğiniz zaman hesap ayarlarınızdan aboneliğinizi iptal edebilirsiniz; iptal sonrası mevcut fatura döneminizin sonuna kadar erişiminiz devam eder. Cayma hakkı ve iade koşulları için Mesafeli Satış Sözleşmesi sayfamıza bakın.",
      },
    ],
  },
];

export default function SssPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <main className="bg-cream">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          Sık Sorulan Sorular
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Aklınıza takılabilecek sorular
        </h1>

        <div className="mt-12 flex flex-col gap-10">
          {faqGroups.map((group) => (
            <div key={group.title}>
              <h2 className="font-serif text-xl font-semibold text-ink">
                {group.title}
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {group.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-xl border border-gold/20 bg-parchment px-5 py-4 open:bg-parchment"
                  >
                    <summary className="cursor-pointer list-none text-base font-semibold text-ink marker:content-none">
                      {item.q}
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

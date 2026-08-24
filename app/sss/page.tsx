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
        a: "Hayır. KriptoBeyan bir vergi danışmanlık hizmeti değil, bir vergi hesaplama hizmetidir: işlemlerini FIFO yöntemiyle ve güncel mevzuata göre hesaplar. Kişiye özel danışmanlık gerektiren durumlarda ya da nihai beyanında bir mali müşavirle birlikte çalışmanı öneririz. Ayrıntılar için Sorumluluk Reddi sayfamıza bakın.",
      },
      {
        q: "Hangi hesaplama yöntemini kullanıyorsunuz?",
        a: "Şu an için yalnızca FIFO (İlk Giren İlk Çıkar) yöntemi destekleniyor. Farklı maliyet yöntemleri ileride eklenebilir.",
      },
      {
        q: "Borsadan cüzdanıma yaptığım transferler vergilendiriliyor mu?",
        a: "Hayır — kendi hesaplarınız arasındaki (borsadan cüzdana, cüzdandan borsaya) transferler otomatik olarak tespit edilip vergilendirilebilir kazanç/kayıp hesabından hariç tutulur. Sadece gerçek satış işlemleri (SELL) vergilendirilebilir olay olarak değerlendirilir.",
      },
      {
        q: "Rakamlar neden 'taslak/tahmini' olarak işaretleniyor?",
        a: "Otomatik hesaplama, girdiğiniz/bağladığınız verinin doğruluğuna bağlıdır ve mali müşavir onayından geçmemiştir. Bu nedenle her raporda taslak/tahmini uyarısı yer alır.",
      },
    ],
  },
  {
    title: "Güvenlik ve veri",
    items: [
      {
        q: "Borsa API anahtarlarım güvende mi?",
        a: "API anahtarlarınız AES-256-GCM ile şifrelenerek saklanır ve şifreleme anahtarı uygulamanın kendi ortam değişkenlerinden ayrı, erişimi kısıtlı bir konumda tutulur. Yalnızca salt-okunur (read-only) izinli anahtarlar kabul edilir. Ayrıntılar için Güvenlik sayfamıza bakın.",
      },
      {
        q: "Hesabımı ve verilerimi silebilir miyim?",
        a: "Evet. Hesabınızı ve ilişkili tüm verilerinizi silme talebinde bulunabilirsiniz. Detaylar için Gizlilik Politikası ve KVKK Aydınlatma Metni sayfalarına bakın.",
      },
      {
        q: "Verilerim üçüncü taraflarla paylaşılıyor mu?",
        a: "Hayır, verileriniz pazarlama amacıyla üçüncü taraflarla paylaşılmaz. Yalnızca hizmetin çalışması için gerekli alt yükleniciler (barındırma, e-posta gönderimi vb.) sınırlı ölçüde veriye erişebilir. Detaylar için Gizlilik Politikası sayfamıza bakın.",
      },
    ],
  },
  {
    title: "Hesap ve fiyatlandırma",
    items: [
      {
        q: "Ücretsiz plan var mı?",
        a: "Evet, sınırlı işlem hacmiyle ücretsiz bir plan sunuyoruz. Tüm planlar için Fiyatlandırma sayfamıza bakabilirsiniz.",
      },
      {
        q: "Mali müşavirim benim verilerime nasıl erişiyor?",
        a: "Mali müşaviriniz size bir davet gönderir; siz kabul etmeden erişim başlamaz. Kabul ettikten sonra bile mali müşavir yalnızca vergi özeti ve veri tutarlılık uyarılarınızı görebilir — borsa API anahtarlarınıza veya işlem detaylarınıza asla erişemez.",
      },
      {
        q: "Aboneliğimi iptal edebilir miyim?",
        a: "Evet, dilediğiniz zaman aboneliğinizi iptal edebilirsiniz. Cayma hakkı ve iade koşulları için Mesafeli Satış Sözleşmesi sayfamıza bakın.",
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

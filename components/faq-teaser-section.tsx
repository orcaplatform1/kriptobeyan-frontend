import Link from "next/link";

const faqs = [
  {
    q: "KriptoBeyan bana vergi tavsiyesi mi veriyor?",
    a: "Hayır. KriptoBeyan bir vergi danışmanlık hizmeti değildir; hesaplamalar taslak/tahmini niteliktedir. Kesin beyan için mutlaka bir mali müşavire danışmalısınız.",
  },
  {
    q: "Borsa API anahtarlarım güvende mi?",
    a: "API anahtarların AES-256-GCM ile şifrelenerek saklanır ve yalnızca salt-okunur (read-only) izinli anahtar kullanmanı zorunlu kılarız — para çekme yetkili anahtarları reddedilir.",
  },
  {
    q: "Verilerimi silebilir miyim?",
    a: "Evet, hesabınızı ve ilişkili tüm verilerinizi istediğiniz zaman silme talebinde bulunabilirsiniz. Detaylar için Gizlilik Politikası ve KVKK Aydınlatma Metni sayfalarına bakın.",
  },
];

export function FaqTeaserSection() {
  return (
    <section className="bg-parchment py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
            Sık sorulan sorular
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
            Aklınıza takılabilecek birkaç soru
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl border border-gold/15 bg-cream p-6"
            >
              <h3 className="font-semibold text-ink">{faq.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/sss"
            className="text-sm font-semibold text-gold-deep underline underline-offset-4"
          >
            Tüm soruları gör →
          </Link>
        </div>
      </div>
    </section>
  );
}

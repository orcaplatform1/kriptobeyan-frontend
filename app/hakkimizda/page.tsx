import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "KriptoBeyan, Türkiye'deki kripto varlık yatırımcılarının ve mali müşavirlerin kripto vergi hesaplama sürecini kolaylaştırmak için kuruldu.",
  alternates: { canonical: `${SITE_URL}/hakkimizda` },
};

export default function HakkimizdaPage() {
  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          Hakkımızda
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Kripto ile vergi arasındaki dengeyi kuruyoruz
        </h1>

        <div className="prose-legal mt-10">
          <p>
            Türkiye&apos;de kripto varlık yatırımcısı sayısı hızla artıyor,
            ancak bu varlıkların vergisel takibi hâlâ büyük ölçüde manuel —
            onlarca borsa hesabı, cüzdan adresi ve CSV dosyası arasında elle
            hesaplama yapılıyor. KriptoBeyan bu süreci otomatikleştirmek için
            kuruldu.
          </p>
          <p>
            Platform, borsa ve cüzdan verilerinizi birleştirip FIFO yöntemiyle
            kazanç/kayıp hesaplar ve beyan dönemine hazır bir taslak rapor
            üretir. Mali müşavirler için ayrı bir panel sunar; böylece
            müşteri portföylerini tek yerden, sıkı yetkilendirme
            kontrolleriyle takip edebilirler.
          </p>
          <h2>Ne değiliz</h2>
          <p>
            KriptoBeyan bir vergi danışmanlık şirketi veya aracı kurum
            değildir. Ürettiğimiz tüm rakamlar taslak/tahminidir; resmi
            beyanınız için her zaman bir mali müşavire danışmanızı öneririz.
            Detaylar için{" "}
            <a href="/sorumluluk-reddi">Sorumluluk Reddi</a> sayfamıza
            bakabilirsiniz.
          </p>
          <h2>Bize ulaşın</h2>
          <p>
            Sorularınız, geri bildirimleriniz veya iş birliği talepleriniz
            için <a href="/iletisim">İletişim</a> sayfamızdan bize
            ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </main>
  );
}

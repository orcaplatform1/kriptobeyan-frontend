import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "KriptoBeyan, Türkiye'de kripto varlık yatırımcılarının vergi hesaplama sürecini otomatikleştiren öncü platformdur — hazırlıklarımıza kripto kazançlarına yönelik vergi düzenlemesi henüz yasalaşmadan önce başladık.",
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

          <h2>Türkiye&apos;de bir ilk</h2>
          <p>
            KriptoBeyan, kripto varlıklardan doğan kazançların vergi
            hesaplamasını uçtan uca otomatikleştiren Türkiye&apos;deki ilk
            platformlardan biridir. Bu alana &quot;piyasa oturduktan sonra&quot;
            değil, işin en zor kısmının — düzenlemenin henüz netleşmediği,
            kuralların oturmadığı dönemin — içinden girdik.
          </p>
          <p>
            Hazırlıklarımıza, kripto kazançlarına yönelik vergi düzenlemesi
            Türkiye&apos;de henüz resmi olarak yasalaşmadan önce başladık.
            Bunun sebebi basit: düzenleme geldiğinde milyonlarca yatırımcının
            elinde dağınık borsa hesapları ve cüzdan geçmişleri olacaktı,
            hesaplamayı elle yapmak neredeyse imkânsız hale gelecekti. Biz bu
            altyapıyı — işlem birleştirme, FIFO hesaplama, istisna takibi —
            kanun konuşulurken kurmaya başladık ki düzenleme netleştiğinde
            kullanıcılarımız hazır olsun.
          </p>
          <p>
            Bu bizi bir &quot;takipçi&quot; değil, alanın öncülerinden biri
            yapıyor — ürünümüzü mevzuata değil, mevzuatın ihtiyaç duyacağı
            altyapıya göre tasarladık.
          </p>

          <h2>Ne yapıyoruz</h2>
          <p>
            Platform, borsa ve cüzdan verilerinizi birleştirip FIFO yöntemiyle
            kazanç/kayıp hesaplar ve beyan dönemine hazır bir taslak rapor
            üretir. Rapor üretilirken veri kalitesini otomatik olarak
            tarayan bir &quot;Yapay Zeka Kontrolörü&quot; katmanı da devreye
            girer — eksik fiyat verisi veya tutarsız bir bakiye gibi
            noktaları sade bir dille size özetler (bkz.{" "}
            <a href="/nasil-calisir">Nasıl Çalışır</a>). Mali müşavirler için
            ayrı bir panel sunar; böylece müşteri portföylerini tek yerden,
            sıkı yetkilendirme kontrolleriyle takip edebilirler.
          </p>

          <h2>Misyonumuz</h2>
          <p>
            Kripto varlık sahiplerinin vergi yükümlülüklerini, saatler
            süren manuel hesaplamalar yerine dakikalar içinde, şeffaf ve
            izlenebilir bir şekilde yerine getirebilmesini sağlamak.
          </p>

          <h2>Vizyonumuz</h2>
          <p>
            Türkiye&apos;de kripto varlık beyanı denince akla gelen ilk
            adres olmak; hem bireysel yatırımcının hem de mali müşavirin
            güvenle çalıştığı, sürekli genişleyen bir borsa/cüzdan entegrasyon
            ağına sahip bir platform inşa etmek.
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

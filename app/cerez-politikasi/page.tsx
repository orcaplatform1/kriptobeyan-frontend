import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "KriptoBeyan'ın kullandığı çerez türleri ve amaçları.",
  alternates: { canonical: `${SITE_URL}/cerez-politikasi` },
};

export default function CerezPolitikasiPage() {
  return (
    <LegalPageShell title="Çerez Politikası" updated="17 Eylül 2026">
      <h2>Çerez nedir?</h2>
      <p>
        Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza
        kaydedilen küçük metin dosyalarıdır. KriptoBeyan, borsa ve cüzdan
        verileriniz üzerinden vergi taslak raporlama deneyiminizi en verimli
        şekilde sunabilmek amacıyla yasalara uygun, sınırlı sayıda çerez
        kullanır. Hizmetlerimiz SPK mevzuatları ve ilgili mali düzenlemeler
        uyarınca herhangi bir piyasa analizi, sinyal veya yatırım danışmanlığı
        hizmeti sunmaz; resmi bir mali müşavirlik ofisi değildir.
      </p>

      <h2>Siteye ilk girişte karşınıza çıkan çerez tercihleri</h2>
      <p>
        Siteyi ilk ziyaretinizde ekranın altında bir bilgilendirme kutusu
        görürsünüz. Buradan &quot;Tüm Çerezleri Kabul Et&quot;, &quot;Zorunlu
        Olmayanları Reddet&quot; seçeneklerinden birini seçebilir, veya
        &quot;Çerez Tercihlerini Yönet&quot; ile aşağıdaki üç kategoriyi ayrı
        ayrı açıp kapatabilirsiniz. Seçiminiz tarayıcınızda yerel olarak
        hatırlanır ve dilediğiniz zaman geri çekilebilir.
      </p>

      <h2>Kullandığımız çerez kategorileri</h2>
      <table>
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Amaç</th>
            <th>Kapatılabilir mi?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Zorunlu Çerezler</td>
            <td>
              Borsa API/CSV verilerinizi yüklediğiniz güvenli kullanıcı
              paneline giriş yapabilmeniz, entegrasyon formlarının çalışması
              ve site güvenliği için zorunludur.
            </td>
            <td>Hayır (her zaman aktif)</td>
          </tr>
          <tr>
            <td>Performans ve Analiz Çerezleri</td>
            <td>
              Kullanıcıların vergi hesaplama adımlarında nerede zorlandığını
              analiz ederek yazılım altyapımızı ve online eğitim modüllerimizi
              geliştirmemize yardımcı olur.
            </td>
            <td>Evet</td>
          </tr>
          <tr>
            <td>Pazarlama ve Reklam Çerezleri</td>
            <td>
              Kripto vergi beyan dönemlerine yaklaşırken KriptoBeyan
              bünyesindeki erken kayıt indirimleri, paket güncellemeleri veya
              offline workshop duyurularından haberdar olmanızı sağlar.
            </td>
            <td>Evet</td>
          </tr>
        </tbody>
      </table>
      <p>
        Sitemizde kullanılan çerezler yalnızca; API/CSV işlem geçmişlerinizi
        güvenle birleştirerek FIFO yöntemiyle taslak kazanç/kayıp hesaplaması
        yapan panele erişebilmeniz ve eğitim faaliyetlerimizi optimize
        edebilmek amacıyla KVKK/GDPR süreçlerine uygun olarak işlenmektedir.
      </p>

      <h2>Çerezleri yönetme</h2>
      <p>
        Çoğu tarayıcı çerezleri varsayılan olarak kabul eder; tarayıcı
        ayarlarınızdan çerezleri engelleyebilir veya silebilirsiniz. Zorunlu
        çerezleri engellemeniz, platformun bazı bölümlerinin (örn. oturum
        açık kalması) düzgün çalışmamasına neden olabilir.
      </p>

      <h2>İletişim</h2>
      <p>
        Sorularınız için <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </LegalPageShell>
  );
}

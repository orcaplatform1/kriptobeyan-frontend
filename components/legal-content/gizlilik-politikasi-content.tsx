import { LegalNotice } from "@/components/legal-notice";
import { SUPPORT_EMAIL, KVKK_EMAIL } from "@/lib/site-config";

export function GizlilikPolitikasiContent() {
  return (
    <>
      <LegalNotice>
        Bu metin taslak niteliğindedir ve yayına alınmadan önce bir hukuk
        danışmanı tarafından gözden geçirilmelidir. Köşeli parantez içindeki
        alanlar ([ ]) gerçek şirket/işletme bilgileriyle doldurulmalıdır.
      </LegalNotice>

      <h2>1. Topladığımız veriler</h2>
      <h3>1.1 Hesap bilgileri</h3>
      <p>E-posta adresi, ad-soyad, telefon (opsiyonel), şifre (hash&apos;lenmiş hâliyle), rol (bireysel/mali müşavir), vergi yılı ve maliyet yöntemi tercihleri.</p>

      <h3>1.2 Borsa API anahtarları ve cüzdan adresleri</h3>
      <p>
        Bağladığınız borsa hesaplarına ait salt-okunur API anahtarları
        (şifrelenerek saklanır — bkz. <a href="/guvenlik">Güvenlik</a>{" "}
        sayfamız) ve izlemek üzere eklediğiniz kripto cüzdan adresleri.
      </p>

      <h3>1.3 İşlem verileri</h3>
      <p>
        Borsa API&apos;ları, blok zinciri (on-chain) sorguları veya
        yüklediğiniz CSV dosyaları üzerinden elde edilen alım/satım, transfer,
        staking, airdrop gibi işlem kayıtları.
      </p>

      <h3>1.4 Kullanım ve teknik veriler</h3>
      <p>IP adresi, tarayıcı bilgisi, oturum ve güvenlik günlükleri (giriş denemeleri, cihaz bilgisi).</p>

      <h2>2. Verileri hangi amaçlarla kullanıyoruz</h2>
      <ul>
        <li>Kripto vergi hesaplaması yapmak ve taslak rapor üretmek,</li>
        <li>Hesabınızı güvenli tutmak (kimlik doğrulama, dolandırıcılık/kötüye kullanım tespiti),</li>
        <li>Mali müşavir-müşteri ilişkisini yönetmek (yalnızca siz onayladıysanız),</li>
        <li>Yasal yükümlülüklerimizi yerine getirmek,</li>
        <li>Ürünü iyileştirmek (toplulaştırılmış/anonimleştirilmiş kullanım istatistikleri).</li>
      </ul>
      <p>Verileriniz pazarlama amacıyla üçüncü taraflara satılmaz veya kiralanmaz.</p>

      <h2>3. Borsa API anahtarları için özel bölüm</h2>
      <p>
        API anahtarlarınız veritabanına şifrelenmeden önce AES-256-GCM ile
        şifrelenir; şifreleme anahtarı uygulamanın kendi ortamından ayrı,
        erişimi kısıtlı bir konumda tutulur. Yalnızca salt-okunur izinli
        anahtarlar kabul edilir — para çekme yetkisi olan anahtarlar
        reddedilir. Bağlantıyı sildiğinizde ilişkili şifreli anahtar da
        veritabanından kaldırılır. Teknik ayrıntılar için{" "}
        <a href="/guvenlik">Güvenlik</a> sayfamıza bakın.
      </p>

      <h2>4. Verilerin paylaşımı</h2>
      <p>
        Verileriniz yalnızca hizmetin çalışması için gerekli alt yükleniciler
        (sunucu barındırma, e-posta gönderim altyapısı, fiyat verisi
        sağlayıcıları — CoinGecko, TCMB gibi genel piyasa verisi
        kaynakları) ile ve yalnızca gerekli ölçüde paylaşılır. Mali
        müşavirinizle paylaşım yalnızca sizin onayladığınız davet ilişkisi
        çerçevesinde, sınırlı veri setiyle gerçekleşir.
      </p>

      <h2>5. Saklama süresi</h2>
      <p>
        Verileriniz hesabınız aktif olduğu sürece saklanır. Hesabınızı
        kapattığınızda, yasal saklama yükümlülüklerimiz dışındaki veriler
        makul bir süre içinde silinir veya anonimleştirilir.
      </p>

      <h2>6. Haklarınız</h2>
      <p>
        Verilerinize erişim, düzeltme veya silme talebiniz için{" "}
        <a href={`mailto:${KVKK_EMAIL}`}>{KVKK_EMAIL}</a> adresinden bize
        ulaşabilirsiniz. KVKK kapsamındaki haklarınızın tam listesi için{" "}
        <a href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</a>
        &apos;ni inceleyin.
      </p>

      <h2>7. İletişim</h2>
      <p>
        Bu politika hakkında sorularınız için{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </>
  );
}

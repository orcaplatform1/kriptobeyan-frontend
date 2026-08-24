import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { LegalNotice } from "@/components/legal-notice";
import { SITE_URL, KVKK_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu, işleme amaçları ve veri sahibi hakları.",
  alternates: { canonical: `${SITE_URL}/kvkk-aydinlatma-metni` },
};

export default function KvkkAydinlatmaMetniPage() {
  return (
    <LegalPageShell title="KVKK Aydınlatma Metni" updated="24 Ağustos 2026">
      <LegalNotice>
        Bu metin taslak niteliğindedir ve yayına alınmadan önce bir hukuk
        danışmanı tarafından gözden geçirilmelidir. Köşeli parantez içindeki
        veri sorumlusu kimlik bilgileri ([ ]) gerçek unvan/adres/iletişim
        bilgileriyle doldurulmadan bu sayfa yürürlüğe konulmamalıdır.
      </LegalNotice>

      <h2>1. Veri Sorumlusunun Kimliği</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca,
        kişisel verileriniz veri sorumlusu sıfatıyla aşağıda belirtilen
        tarafından işlenmektedir:
      </p>
      <ul>
        <li>Unvan: [Şirket/İşletme Unvanı]</li>
        <li>Adres: [Adres]</li>
        <li>MERSİS No: [MERSİS Numarası]</li>
        <li>
          E-posta: <a href={`mailto:${KVKK_EMAIL}`}>{KVKK_EMAIL}</a>
        </li>
      </ul>

      <h2>2. Kişisel Verilerin İşlenme Amaçları</h2>
      <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
      <ul>
        <li>Üyelik/hesap oluşturma ve kimlik doğrulama süreçlerinin yürütülmesi,</li>
        <li>Bağladığınız borsa/cüzdan verileri üzerinden kripto varlık kazanç/kayıp hesaplaması yapılması ve taslak vergi raporu üretilmesi,</li>
        <li>Mali müşavir-müşteri ilişkisinin, açık rızanız/talebiniz doğrultusunda kurulması ve yönetilmesi,</li>
        <li>Bilgi güvenliği süreçlerinin yürütülmesi ve yetkisiz erişimin önlenmesi,</li>
        <li>Ücretli abonelik süreçlerinde faturalandırma ve ödeme takibi,</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi ve talep/şikâyetlerin yanıtlanması.</li>
      </ul>

      <h2>3. Kişisel Verilerin Aktarılabileceği Taraflar ve Amaçları</h2>
      <p>
        Kişisel verileriniz, yukarıdaki amaçlarla sınırlı olarak; hizmetin
        çalışması için gerekli barındırma/altyapı sağlayıcıları, e-posta
        gönderim hizmeti sağlayıcıları ve (yalnızca açık rızanızla kurulan
        bir ilişki çerçevesinde) mali müşavirinizle paylaşılabilir. Verileriniz
        yurt dışına aktarılıyorsa bu aktarım KVKK&apos;nın öngördüğü şartlara
        uygun şekilde gerçekleştirilir.
      </p>

      <h2>4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
      <p>
        Kişisel verileriniz, KriptoBeyan platformunu kullanmanız sırasında
        elektronik ortamda (kayıt formu, borsa API bağlantısı, dosya
        yüklemesi) doğrudan sizden veya sizin yetkilendirdiğiniz üçüncü
        taraf API&apos;lardan elde edilir. Bu veriler; bir sözleşmenin
        kurulması veya ifasıyla doğrudan doğruya ilgili olması, hukuki
        yükümlülüğün yerine getirilmesi, veri sorumlusunun meşru menfaati ve
        açık rızanızın bulunması hukuki sebeplerine dayanarak işlenmektedir.
      </p>

      <h2>5. Veri Sahibi Olarak Haklarınız (KVKK m.11)</h2>
      <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
      <ul>
        <li>Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
        <li>Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
        <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
        <li>KVKK m.7 çerçevesinde silinmesini/yok edilmesini isteme,</li>
        <li>Düzeltme/silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme,</li>
        <li>İşlenen verilerin münhasıran otomatik sistemlerle analizi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
        <li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
      </ul>

      <h2>6. Başvuru Yöntemi</h2>
      <p>
        Yukarıdaki haklarınızı kullanmak için talebinizi{" "}
        <a href={`mailto:${KVKK_EMAIL}`}>{KVKK_EMAIL}</a> adresine
        yazılı olarak iletebilirsiniz. Talebiniz, niteliğine göre en kısa
        sürede ve en geç 30 gün içinde sonuçlandırılacaktır.
      </p>
    </LegalPageShell>
  );
}

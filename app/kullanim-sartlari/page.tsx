import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { LegalNotice } from "@/components/legal-notice";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description: "KriptoBeyan platformunu kullanırken geçerli olan kullanım şartları ve kullanıcı sözleşmesi.",
  alternates: { canonical: `${SITE_URL}/kullanim-sartlari` },
};

export default function KullanimSartlariPage() {
  return (
    <LegalPageShell title="Kullanım Şartları" updated="24 Ağustos 2026">
      <LegalNotice>
        Bu metin taslak niteliğindedir ve yayına alınmadan önce bir hukuk
        danışmanı tarafından gözden geçirilmelidir.
      </LegalNotice>

      <h2>1. Kabul</h2>
      <p>
        KriptoBeyan&apos;a kayıt olarak veya platformu kullanarak bu Kullanım
        Şartları&apos;nı, <a href="/gizlilik-politikasi">Gizlilik
        Politikası</a>&apos;nı ve <a href="/sorumluluk-reddi">Sorumluluk
        Reddi</a> metnini kabul etmiş sayılırsınız.
      </p>

      <h2>2. Hizmetin kapsamı</h2>
      <p>
        KriptoBeyan, kripto varlık işlemlerinizi borsa API&apos;ları, cüzdan
        adresleri ve/veya CSV dosyaları üzerinden birleştirip FIFO
        yöntemiyle taslak kazanç/kayıp hesaplaması yapan ve taslak rapor
        üreten bir yazılım hizmetidir. Hizmet, resmi vergi beyan aracı veya
        mali müşavirlik hizmeti değildir (bkz. Sorumluluk Reddi).
      </p>

      <h2>3. Hesap ve kullanıcı yükümlülükleri</h2>
      <ul>
        <li>Kayıt sırasında verdiğiniz bilgilerin doğru ve güncel olmasından siz sorumlusunuz.</li>
        <li>Hesap bilgilerinizin gizliliğini korumak ve hesabınızdaki tüm faaliyetlerden sorumlu olmak sizin yükümlülüğünüzdedir.</li>
        <li>Platforma yalnızca salt-okunur (read-only) API anahtarları eklemeniz beklenir; para çekme yetkili anahtar eklemeniz halinde bu anahtarlar sistem tarafından reddedilir.</li>
        <li>Platformu yasa dışı amaçlarla, başkalarının haklarını ihlal edecek şekilde veya sistemin güvenliğini/işleyişini bozacak şekilde kullanamazsınız.</li>
      </ul>

      <h2>4. Mali müşavir hesapları</h2>
      <p>
        Mali müşavir rolündeki kullanıcılar, yalnızca kendilerini davet
        eden ve daveti kabul eden müşterilerin sınırlı verisine erişebilir.
        Bu erişimi, müşterinin açık rızası ve platform kuralları dışında
        kullanamaz, üçüncü kişilerle paylaşamazsınız.
      </p>

      <h2>5. Abonelik ve ödeme</h2>
      <p>
        Ücretli planlara ilişkin fiyatlar <a href="/fiyatlandirma">Fiyatlandırma</a>{" "}
        sayfasında belirtilir. Ödeme, iptal ve cayma hakkı koşulları için{" "}
        <a href="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</a>
        &apos;ni inceleyin.
      </p>

      <h2>6. Fikri mülkiyet</h2>
      <p>
        Platformun yazılımı, tasarımı, logosu ve içerikleri KriptoBeyan&apos;a
        aittir. Bu Kullanım Şartları, platformu kullanmanız dışında size
        herhangi bir fikri mülkiyet hakkı devretmez.
      </p>

      <h2>7. Sorumluluğun sınırlanması</h2>
      <p>
        Hizmet &quot;olduğu gibi&quot; sunulur. Yürürlükteki mevzuatın izin
        verdiği azami ölçüde, KriptoBeyan; hizmetin kesintisiz veya hatasız
        olacağını garanti etmez ve platformun kullanımından doğabilecek
        dolaylı zararlardan sorumlu tutulamaz. Ayrıntılar için{" "}
        <a href="/sorumluluk-reddi">Sorumluluk Reddi</a> sayfasına bakın.
      </p>

      <h2>8. Hesabın askıya alınması / sonlandırılması</h2>
      <p>
        Kullanım Şartları&apos;nın ihlali, kötüye kullanım şüphesi veya
        yasal bir zorunluluk halinde hesabınızı askıya alabilir veya
        kapatabiliriz. Dilediğiniz zaman hesabınızı kendiniz de
        kapatabilirsiniz.
      </p>

      <h2>9. Değişiklikler</h2>
      <p>
        Bu şartları zaman zaman güncelleyebiliriz; önemli değişikliklerde
        sizi bilgilendiririz. Güncel sürüm her zaman bu sayfada yer alır.
      </p>

      <h2>10. İletişim</h2>
      <p>
        Sorularınız için <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </LegalPageShell>
  );
}

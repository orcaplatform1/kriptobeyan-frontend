import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { LegalNotice } from "@/components/legal-notice";
import { SITE_URL, SUPPORT_EMAIL, COMPANY_INFO } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description:
    "KriptoBeyan ücretli abonelik satın alımlarında geçerli mesafeli satış sözleşmesi ve cayma hakkı koşulları.",
  alternates: { canonical: `${SITE_URL}/mesafeli-satis-sozlesmesi` },
};

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <LegalPageShell title="Mesafeli Satış Sözleşmesi" updated="24 Ağustos 2026">
      <LegalNotice>
        <strong>Önemli:</strong> Bu metin, 6502 sayılı Tüketicinin Korunması
        Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği&apos;ne genel
        yapı olarak uyumlu bir taslaktır. Aşağıdaki satıcı kimlik bilgileri
        (unvan, adres, MERSİS/vergi no) henüz gerçek/doğrulanmış değildir —
        yer tutucu olarak girilmiştir ve bir hukuk danışmanı tarafından
        onaylanmadan yürürlüğe konulmamalıdır. Ödeme akışı henüz gerçek bir
        ödeme kuruluşuna bağlanmamıştır (bkz. Fiyatlandırma sayfası notu);
        bu sözleşme ödeme entegrasyonu canlıya alınmadan önce nihai hâline
        getirilmelidir.
      </LegalNotice>

      <h2>1. Taraflar</h2>
      <p><strong>Satıcı:</strong></p>
      <ul>
        <li>Unvan: {COMPANY_INFO.unvan}</li>
        <li>Adres: {COMPANY_INFO.adres}</li>
        <li>Vergi/MERSİS No: {COMPANY_INFO.vergiNo} / {COMPANY_INFO.mersisNo}</li>
        <li>Ticaret Sicil No: {COMPANY_INFO.ticaretSicilNo}</li>
        <li>E-posta: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></li>
      </ul>
      <p>
        <strong>Alıcı:</strong> KriptoBeyan platformunda ücretli bir plana
        abone olan gerçek/tüzel kişi kullanıcı.
      </p>

      <h2>2. Sözleşmenin konusu</h2>
      <p>
        İşbu sözleşme, Alıcı&apos;nın Satıcı&apos;ya ait KriptoBeyan
        platformu üzerinden elektronik ortamda satın aldığı dijital abonelik
        hizmetinin (bkz. <a href="/fiyatlandirma">Fiyatlandırma</a> sayfası)
        satışı ve ifasına ilişkin tarafların hak ve yükümlülüklerini
        düzenler.
      </p>

      <h2>3. Hizmetin temel nitelikleri ve fiyatı</h2>
      <p>
        Satın alınan planın adı, kapsamı (işlem/müşteri limiti) ve yıllık
        bedeli, satın alma anında Alıcı&apos;ya ödeme onay ekranında ve
        e-posta ile ayrıca bildirilir. Fiyatlar KDV dahildir ve Türk
        Lirası (TRY) cinsindendir.
      </p>

      <h2>4. Ödeme ve ifa</h2>
      <p>
        Ödeme, satın alma anında belirtilen yöntemle (kredi kartı/kripto)
        tahsil edilir. Abonelik, ödemenin onaylanmasıyla birlikte aktif hâle
        gelir ve dijital hizmet anında/kısa süre içinde ifa edilmeye
        başlanır.
      </p>

      <h2>5. Cayma hakkı</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca,
        elektronik ortamda anında ifa edilen hizmetler ve dijital
        içerik/hizmet niteliğindeki sözleşmelerde, <strong>Alıcı&apos;nın
        onayıyla ifaya başlanmış olması hâlinde</strong> cayma hakkı
        kullanılamaz. Buna göre:
      </p>
      <ul>
        <li>
          Abonelik satın alma sırasında hizmetin anında ifasına
          başlanmasını onaylayan Alıcı, hizmet fiilen kullanılmaya
          başlandıktan sonra 14 günlük yasal cayma hakkını kaybeder.
        </li>
        <li>
          Alıcı, hizmeti henüz kullanmaya başlamadıysa, satın alma
          tarihinden itibaren 14 gün içinde{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> adresine
          yazılı bildirimde bulunarak cayma hakkını kullanabilir.
        </li>
      </ul>

      <h2>6. İptal ve iade</h2>
      <p>
        Alıcı, dilediği zaman aboneliğini iptal edebilir; iptal, mevcut
        ödeme döneminin sonuna kadar hizmete erişimi etkilemez ve
        otomatik yenilemeyi durdurur. Yasal cayma hakkı süresi dışındaki
        iade talepleri Satıcı&apos;nın takdirine bağlıdır.
      </p>

      <h2>7. Uyuşmazlıkların çözümü</h2>
      <p>
        İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı&apos;nca
        her yıl belirlenen parasal sınırlar dahilinde Alıcı&apos;nın veya
        Satıcı&apos;nın yerleşim yerindeki Tüketici Hakem Heyetleri ile
        Tüketici Mahkemeleri yetkilidir.
      </p>

      <h2>8. İletişim</h2>
      <p>
        Sorularınız için <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </LegalPageShell>
  );
}

import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { LegalNotice } from "@/components/legal-notice";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sorumluluk Reddi / Vergi Uyarısı",
  description:
    "KriptoBeyan bir vergi danışmanlık hizmeti değildir. Platformdaki hesaplamalar taslak/tahminidir; kesin beyan için mali müşavirinize danışın.",
  alternates: { canonical: `${SITE_URL}/sorumluluk-reddi` },
};

export default function SorumlulukReddiPage() {
  return (
    <LegalPageShell
      title="Sorumluluk Reddi / Vergi Uyarısı"
      updated="24 Ağustos 2026"
      intro="Bu sayfayı, KriptoBeyan'ı kullanmadan önce mutlaka okuyun."
    >
      <LegalNotice>
        <strong>Özet:</strong> KriptoBeyan bir vergi danışmanlık hizmeti,
        mali müşavirlik faaliyeti veya resmi beyan aracı değildir. Platformda
        gördüğünüz tüm kazanç, kayıp ve vergi tutarları <strong>taslak/
        tahmini</strong> niteliktedir. Resmi vergi beyanınızı vermeden önce
        mutlaka yetkili bir mali müşavire veya vergi danışmanına danışın.
      </LegalNotice>

      <h2>1. KriptoBeyan ne yapar, ne yapmaz</h2>
      <p>
        KriptoBeyan, bağladığınız borsa hesapları, cüzdan adresleri ve
        yüklediğiniz CSV dosyalarındaki işlem verilerini birleştirerek FIFO
        (İlk Giren İlk Çıkar) yöntemiyle otomatik bir kazanç/kayıp hesaplaması
        yapan bir yazılım aracıdır. Bu hesaplama:
      </p>
      <ul>
        <li>Sizin sağladığınız veya bağladığınız verinin doğruluğuna bağlıdır,</li>
        <li>Herhangi bir mali müşavir veya vergi uzmanı tarafından onaylanmamıştır,</li>
        <li>Güncel mevzuat değişikliklerini veya kişisel vergi durumunuzun tüm
          özelliklerini (diğer gelir kalemleri, istisnalar, önceki yıl
          zararları vb.) kapsamayabilir.</li>
      </ul>
      <p>
        Bu nedenle KriptoBeyan çıktıları — dashboard&apos;daki özetler, PDF/
        Excel raporları — her zaman <strong>taslak/tahmini</strong> olarak
        etiketlenir ve resmi beyanname yerine geçmez.
      </p>

      <h2>2. Vergi tavsiyesi değildir</h2>
      <p>
        KriptoBeyan ekibi, platformda yer alan hiçbir bilgi, hesaplama veya
        içerik yoluyla size vergi, hukuk veya yatırım tavsiyesi vermemektedir.
        Vergiye tabi olay tespiti, istisna uygulaması, beyan yükümlülüğünüzün
        kapsamı gibi konularda nihai karar ve sorumluluk size ve
        danıştığınız mali müşavire aittir.
      </p>

      <h2>3. Sorumluluğun sınırlanması</h2>
      <p>
        KriptoBeyan, platformdaki hesaplama hatalarından, eksik/yanlış veri
        girişinden, borsa API&apos;larının sağladığı verilerdeki
        tutarsızlıklardan veya bu verilere dayanarak alınan vergi/yatırım
        kararlarından doğabilecek doğrudan veya dolaylı zararlardan
        sorumlu tutulamaz. Platform &quot;olduğu gibi&quot; (as-is) sunulur.
      </p>

      <h2>4. Mali müşavir kullanıcıları için</h2>
      <p>
        Mali müşavir hesabı üzerinden erişilen müşteri özetleri de aynı
        şekilde taslak/tahminidir. KriptoBeyan çıktısı, mali müşavirin kendi
        mesleki değerlendirmesinin ve doğrulamasının yerine geçmez.
      </p>

      <h2>5. Sorularınız için</h2>
      <p>
        Bu sayfa hakkında sorularınız için <a href="/iletisim">İletişim</a>{" "}
        sayfamızdan bize ulaşabilirsiniz.
      </p>
    </LegalPageShell>
  );
}

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
    <LegalPageShell title="Çerez Politikası" updated="24 Ağustos 2026">
      <h2>Çerez nedir?</h2>
      <p>
        Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza
        kaydedilen küçük metin dosyalarıdır. KriptoBeyan, platformun
        çalışması ve kullanım deneyimini iyileştirmek için sınırlı sayıda
        çerez kullanır.
      </p>

      <h2>Kullandığımız çerez türleri</h2>
      <table>
        <thead>
          <tr>
            <th>Tür</th>
            <th>Amaç</th>
            <th>Süre</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Zorunlu / Oturum</td>
            <td>Oturum açık tutma, kimlik doğrulama (erişim/yenileme token yönetimi)</td>
            <td>Oturum süresince / kısa süreli</td>
          </tr>
          <tr>
            <td>Tercih</td>
            <td>Dil, tema gibi kullanıcı tercihlerinin hatırlanması</td>
            <td>Kalıcı (silene kadar)</td>
          </tr>
          <tr>
            <td>Analitik</td>
            <td>Ürünü iyileştirmek için toplulaştırılmış kullanım istatistikleri (aktif edilirse)</td>
            <td>Sağlayıcıya göre değişir</td>
          </tr>
        </tbody>
      </table>

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

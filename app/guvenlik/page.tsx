import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Güvenlik",
  description:
    "KriptoBeyan'ın borsa API anahtarlarını nasıl şifrelediği, read-only zorunluluğu ve genel güvenlik önlemleri.",
  alternates: { canonical: `${SITE_URL}/guvenlik` },
};

export default function GuvenlikPage() {
  return (
    <LegalPageShell
      title="Güvenlik"
      updated="24 Ağustos 2026"
      intro="Borsa API anahtarlarınızı ve kişisel verilerinizi nasıl koruduğumuzu, teknik ayrıntılarıyla anlatıyoruz."
    >
      <h2>Borsa API anahtarları</h2>
      <ul>
        <li>
          <strong>Sadece salt-okunur (read-only):</strong> Bir borsa
          bağlantısı eklerken yalnızca okuma izinli API anahtarları kabul
          edilir. Para çekme (withdraw) veya işlem açma yetkisi taşıyan
          anahtarlar sistem tarafından reddedilir; bağlantı kurulmadan önce
          izin seviyesi borsanın kendi API&apos;sinden doğrulanır.
        </li>
        <li>
          <strong>Şifreleme:</strong> API anahtarları ve gizli anahtarlar
          veritabanına yazılmadan önce AES-256-GCM ile uygulama katmanında
          şifrelenir. Şifreleme anahtarı, uygulamanın kendi ortam
          değişkenleri dosyasında değil, yalnızca sunucu yöneticisinin
          erişebildiği ayrı, kök-erişimli bir dosyada tutulur — böylece
          uygulama kodunun veya veritabanı yedeğinin ele geçirilmesi tek
          başına anahtarların çözülmesi için yeterli olmaz.
        </li>
        <li>
          <strong>Görüntülenme:</strong> API anahtarınız kaydedildikten sonra
          arayüzde bir daha tam olarak gösterilmez; yalnızca maskelenmiş
          (örn. son 4 karakter) hâli görüntülenir.
        </li>
      </ul>

      <h2>Kimlik doğrulama</h2>
      <ul>
        <li>Şifreler argon2 ile hash&apos;lenir (endüstri standardı, brute-force&apos;a karşı dirençli).</li>
        <li>Erişim ve yenileme (refresh) token&apos;ları ayrı, kısa ömürlü çiftler halinde çalışır; bir yenileme token&apos;ının tekrar kullanımı (çalınma belirtisi) tespit edilir ve ilgili oturum zinciri otomatik iptal edilir.</li>
        <li>İsteğe bağlı iki faktörlü kimlik doğrulama (TOTP tabanlı, Google Authenticator vb. ile uyumlu) desteklenir.</li>
        <li>Art arda başarısız giriş denemelerinde hesap geçici olarak kilitlenir.</li>
      </ul>

      <h2>Altyapı</h2>
      <ul>
        <li>Tüm hassas uç noktalarda (giriş, borsa senkronizasyonu, vergi hesaplama) istek sıklığı sınırlaması (rate limiting) uygulanır.</li>
        <li>HTTP güvenlik başlıkları (Helmet) ve sıkı CORS politikası aktiftir.</li>
        <li>Güvenlik açısından anlamlı olaylar (giriş, hesap kilitlenmesi, 2FA hataları, token yeniden kullanımı vb.) ayrı bir güvenlik günlüğünde tutulur.</li>
        <li>Sunucu düzeyinde güvenlik duvarı (ufw) ve saldırı tespiti (fail2ban) aktiftir; veritabanı yedekleri şifreli olarak günlük alınır.</li>
      </ul>

      <h2>Mali müşavir erişimi</h2>
      <p>
        Bir mali müşavir, ancak sizin davetini kabul etmeniz durumunda
        hesabınızla ilişkilendirilir. Bu ilişki kurulduktan sonra bile mali
        müşavir yalnızca vergi özetinizi ve veri tutarlılık uyarılarınızı
        görebilir — borsa API anahtarlarınıza, cüzdan adreslerinize veya ham
        işlem verilerinize hiçbir zaman erişemez.
      </p>

      <h2>Bir güvenlik açığı mı buldunuz?</h2>
      <p>
        Bir güvenlik zafiyeti tespit ettiyseniz lütfen önce{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> adresinden
        bize ulaşın; kamuya açık şekilde paylaşmadan önce sorunu
        değerlendirip düzeltme fırsatı vermenizi rica ederiz.
      </p>
    </LegalPageShell>
  );
}

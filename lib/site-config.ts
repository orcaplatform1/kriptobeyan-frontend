export const SITE_URL = "https://kriptobeyan.com";
export const SITE_NAME = "KriptoBeyan";
export const SITE_DESCRIPTION =
  "KriptoBeyan; Binance, BTCTurk, Paribu gibi borsa hesaplarınızı ve cüzdanlarınızı bağlayarak kripto vergi hesaplama işlemini otomatikleştirir. Kripto kazancınızı FIFO yöntemiyle hesaplar, beyan dönemine taslak raporla hazırlar.";
export const SITE_KEYWORDS = [
  "kripto vergi",
  "kripto vergi hesaplama",
  "kripto beyan",
  "kripto kazanç vergisi",
  "kripto vergi raporu",
  "değer artış kazancı kripto",
  "Binance vergi hesaplama",
  "kripto muhasebe",
];

export const SUPPORT_EMAIL = "destek@kriptobeyan.com";
export const KVKK_EMAIL = "kvkk@kriptobeyan.com";

/**
 * UYARI — bunlar GERÇEK şirket bilgileri DEĞİL. Kullanıcının açık isteği
 * üzerine ("rastgele yap şimdilik") yer tutucu/örnek değerler girildi;
 * hiçbir tescil/MERSİS/vergi dairesi sorgusu yapılmadı, bu numaralar
 * uydurmadır. KVKK Aydınlatma Metni ve Mesafeli Satış Sözleşmesi
 * sayfalarındaki uyarı kutuları bu yüzden kaldırılmadı — gerçek şirket
 * kurulunca (veya gerçek kişi veri sorumlusu olarak devam edilecekse)
 * bu blok gerçek bilgilerle değiştirilmeli ve sayfalar bir hukuk
 * danışmanına onaylatılmalıdır.
 */
export const COMPANY_INFO = {
  unvan: "KriptoBeyan Bilişim Teknolojileri Limited Şirketi",
  adres: "Barbaros Mahallesi, Begonya Sokak No:1, Ataşehir/İstanbul",
  mersisNo: "0123456789000015",
  vergiDairesi: "Ataşehir Vergi Dairesi",
  vergiNo: "1234567890",
  ticaretSicilNo: "123456",
};

export interface FooterLink {
  href: string;
  label: string;
}

export const FOOTER_LINK_GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Ürün",
    links: [
      { href: "/#nasil-calisir", label: "Nasıl Çalışır" },
      { href: "/fiyatlandirma", label: "Fiyatlandırma" },
      { href: "/#muhasebeciler", label: "Mali Müşavirler İçin" },
      { href: "/guvenlik", label: "Güvenlik" },
    ],
  },
  {
    title: "Şirket",
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/sss", label: "Sık Sorulan Sorular" },
      { href: "/iletisim", label: "İletişim" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { href: "/sorumluluk-reddi", label: "Sorumluluk Reddi / Vergi Uyarısı" },
      { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
      { href: "/kvkk-aydinlatma-metni", label: "KVKK Aydınlatma Metni" },
      { href: "/cerez-politikasi", label: "Çerez Politikası" },
      { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
      { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
    ],
  },
];

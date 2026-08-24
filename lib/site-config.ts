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

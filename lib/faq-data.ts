// /sss ve /destek (Yardım ve Destek arama/kategori) sayfalarinin paylastigi
// tek kaynak — ayni soru-cevaplar iki yerde de tutarli kalsin diye.
export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    title: "Vergi ve hesaplama",
    items: [
      {
        id: "vergi-nasil-hesaplaniyor",
        q: "Vergimi nasıl hesaplıyorsunuz?",
        a: "İşlemlerinizi FIFO yöntemiyle ve güncel mevzuata göre otomatik hesaplarız, size taslak bir rapor çıkarırız. Karma gelir kaynakları, yurt dışı borsa kullanımı veya miras/hibe yoluyla edinilen kripto varlıklar gibi özel durumlarda raporunuzu doğrudan mali müşavirinizle paylaşabilirsiniz.",
      },
      {
        id: "hangi-hesaplama-yontemi",
        q: "Hangi hesaplama yöntemini kullanıyorsunuz?",
        a: "Şu an için yalnızca FIFO (İlk Giren İlk Çıkar) yöntemi destekleniyor; bu yöntem Türkiye'deki genel muhasebe uygulamasıyla en uyumlu ve denetimde en az tartışmaya açık yöntem olduğu için tercih edildi. LIFO veya ağırlıklı ortalama maliyet gibi farklı yöntemler, talep olması halinde ileride eklenebilir.",
      },
      {
        id: "transfer-vergilendirme",
        q: "Borsadan cüzdanıma yaptığım transferler vergilendiriliyor mu?",
        a: "Hayır — kendi hesaplarınız arasındaki (borsadan cüzdana, cüzdandan borsaya, hatta farklı borsalarınız arasındaki) transferler otomatik olarak tespit edilip vergilendirilebilir kazanç/kayıp hesabından hariç tutulur. Sadece gerçek satış işlemleri (SELL, ya da bir kripto varlığın başka bir kripto varlığa çevrildiği trade işlemleri) vergilendirilebilir olay olarak değerlendirilir.",
      },
      {
        id: "zarar-mahsubu",
        q: "Zararlarımı sonraki döneme taşıyabilir miyim (zarar mahsubu)?",
        a: "Evet, sistem aynı dönem içindeki gerçekleşmiş zararları kazançlardan otomatik olarak mahsup eder. Döneme taşınabilecek zarar tutarları taslak raporunuzda ayrıca gösterilir.",
      },
      {
        id: "rapor-neden-taslak",
        q: "Rapor neden 'taslak' olarak işaretleniyor?",
        a: "Rapor, bağladığınız borsa/cüzdan verisi üzerinden otomatik üretilir ve beyannameye doğrudan yapıştırabileceğiniz nihai bir hazır belge değil, beyan sürecinizi hızlandıran bir taslaktır — dilerseniz doğrudan mali müşavirinizle paylaşabilirsiniz.",
      },
      {
        id: "hangi-kripto-varliklar",
        q: "Hangi kripto varlıkları takip edebilirim?",
        a: "Bağladığınız borsa, cüzdan veya CSV'de yer alan her kripto varlık ve token otomatik tanınır — ayrı bir 'desteklenen coin listesi' veya kısıtlama yoktur.",
      },
      {
        id: "hangi-ulke",
        q: "Sadece Türkiye için mi vergi hesaplıyorsunuz?",
        a: "Evet, şu an yalnızca Türkiye mevzuatına göre, TL bazında ve TCMB kuru üzerinden hesaplama yapıyoruz. Farklı bir ülke için beyan hazırlıyorsanız KriptoBeyan şu an uygun değil.",
      },
    ],
  },
  {
    title: "Güvenlik ve veri",
    items: [
      {
        id: "api-anahtari-guvenligi",
        q: "Borsa API anahtarlarım güvende mi?",
        a: "API anahtarlarınız AES-256-GCM ile şifrelenerek saklanır ve şifreleme anahtarı uygulamanın kendi ortam değişkenlerinden ayrı, erişimi kısıtlı bir konumda tutulur. Yalnızca salt-okunur (read-only) izinli anahtarlar kabul edilir — para çekme (withdraw) veya işlem açma (trade) izni istenmez ve böyle bir izinle gelen anahtarlar reddedilir. Ayrıntılar için Güvenlik sayfamıza bakın.",
      },
      {
        id: "para-cekme-yetkisi",
        q: "Uygulamanın hesabımdan para çekme yetkisi var mı?",
        a: "Hayır, kesinlikle yok. Bağladığınız API anahtarlarının salt-okunur olması zorunludur; bu sayede KriptoBeyan yalnızca işlem geçmişinizi ve bakiyenizi okuyabilir, hiçbir şekilde para çekme, transfer veya alım-satım emri gönderemez.",
      },
      {
        id: "hesap-silme",
        q: "Hesabımı ve verilerimi silebilir miyim?",
        a: "Evet. Hesap ayarlarınızdan veya destek ekibimize yazarak hesabınızı ve ilişkili tüm verilerinizi (bağlı borsa/cüzdan bilgileri, işlem geçmişi, raporlar dahil) kalıcı olarak silme talebinde bulunabilirsiniz. Detaylar için Gizlilik Politikası ve KVKK Aydınlatma Metni sayfalarına bakın.",
      },
      {
        id: "veri-paylasimi",
        q: "Verilerim üçüncü taraflarla paylaşılıyor mu?",
        a: "Hayır, verileriniz pazarlama amacıyla üçüncü taraflarla paylaşılmaz veya satılmaz. Yalnızca hizmetin çalışması için gerekli alt yükleniciler (barındırma, e-posta gönderimi vb.) sınırlı ölçüde ve yalnızca hizmeti sağlamak amacıyla veriye erişebilir. Detaylar için Gizlilik Politikası sayfamıza bakın.",
      },
    ],
  },
  {
    title: "Borsalar ve entegrasyon",
    items: [
      {
        id: "desteklenen-borsalar",
        q: "Hangi borsalar destekleniyor?",
        a: "Binance, Binance TR, Bybit, Bybit TR, OKX, OKX TR, BTCTurk, Kraken, KuCoin, Coinbase, Gate.io, HTX, Bitget, MEXC, Paribu ve ICRYPEX şu anda tam destekleniyor. Bitexen ve Crypto.com entegrasyonları yakında ekleniyor. Listedeki bir borsayı kullanmıyorsanız CSV içe aktarımıyla da işlem geçmişinizi ekleyebilirsiniz.",
      },
      {
        id: "on-chain-takip",
        q: "On-chain cüzdan takibi nasıl çalışır?",
        a: "Ethereum, BSC ve Bitcoin ağlarındaki genel (public) cüzdan adresinizi eklediğinizde, adresle ilişkili on-chain işlemler otomatik olarak okunup zaman çizelgenize dahil edilir. Bu işlem tamamen genel blok zinciri verisi üzerinden yapılır; özel anahtarınız (private key) hiçbir aşamada istenmez veya saklanmaz.",
      },
      {
        id: "borsa-listede-yok",
        q: "Listede borsamı/cüzdan ağımı göremiyorum, ne yapmalıyım?",
        a: "Anasayfadaki 'Desteklenen Borsalar' bölümünün altındaki bağlantıdan bize yazabilirsiniz; talep sıklığına göre yeni borsa ve ağ entegrasyonlarını önceliklendiriyoruz. Bu arada ilgili borsanızdan aldığınız CSV dökümünü içe aktararak işlemlerinizi yine de hesaba katabilirsiniz.",
      },
    ],
  },
  {
    title: "Hesap ve fiyatlandırma",
    items: [
      {
        id: "ucretsiz-plan",
        q: "Ücretsiz plan var mı?",
        a: "Evet, sınırlı işlem hacmiyle ücretsiz bir plan sunuyoruz; bu planla temel hesaplama ve taslak rapor özelliklerini deneyebilirsiniz. Daha yüksek işlem hacmi, ek borsa/cüzdan bağlantısı ve mali müşavir paylaşımı gibi özellikler için ücretli planlarımız mevcuttur. Tüm planlar için Fiyatlandırma sayfamıza bakabilirsiniz.",
      },
      {
        id: "yil-ortasi-uyelik",
        q: "Yıl ortasında üye olursam geçmiş işlemlerim de hesaplanır mı?",
        a: "Evet. Borsa hesabınızı veya cüzdanınızı bağladığınızda sistem, o hesaba ait geçmişe dönük tüm işlem verisini (borsanın API'sinin izin verdiği ölçüde) çeker ve FIFO hesaplamasına dahil eder; üyeliğinizin başlangıç tarihiyle sınırlı değildir.",
      },
      {
        id: "ek-ucret",
        q: "Birden fazla borsa veya cüzdan bağlarsam ek ücret öder miyim?",
        a: "Plan seviyenize bağlı olarak belirli sayıda hesap/cüzdan bağlantısı dahildir; bu sınırın üzerine çıkmak istediğinizde bir üst plana geçmeniz gerekebilir. Güncel limitler için Fiyatlandırma sayfamızdaki plan karşılaştırmasına bakabilirsiniz.",
      },
      {
        id: "musavir-erisimi",
        q: "Mali müşavirim benim verilerime nasıl erişiyor?",
        a: "Mali müşaviriniz size bir davet gönderir; siz kabul etmeden erişim başlamaz. Kabul ettikten sonra bile mali müşavir yalnızca vergi özeti ve veri tutarlılık uyarılarınızı görebilir — borsa API anahtarlarınıza veya ham işlem detaylarınıza asla erişemez. Erişimi dilediğiniz zaman geri alabilirsiniz.",
      },
      {
        id: "abonelik-iptali",
        q: "Aboneliğimi iptal edebilir miyim?",
        a: "Evet, dilediğiniz zaman hesap ayarlarınızdan aboneliğinizi iptal edebilirsiniz; iptal sonrası mevcut fatura döneminizin sonuna kadar erişiminiz devam eder. Cayma hakkı ve iade koşulları için Mesafeli Satış Sözleşmesi sayfamıza bakın.",
      },
    ],
  },
];

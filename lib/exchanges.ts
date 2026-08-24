// Adaptörü gerçek HMAC-imzalı entegrasyona sahip borsalar (bağlanabilir).
// Sıralama kullanıcı istegi (2026-08-24): once kuresel borsalar hacme gore,
// sonra Turk borsalari hacme gore - karisik/rastgele dizilim olmasin.
export const LIVE_EXCHANGES = [
  // Kuresel (hacme gore)
  "Binance",
  "Bybit",
  "OKX",
  "Coinbase",
  "Kraken",
  "KuCoin",
  "Gate.io",
  "HTX",
  "Bitget",
  "MEXC",
  // Turk borsalari (hacme gore)
  "BTCTurk",
  "Paribu",
  "ICRYPEX",
  // SPK lisansli yerel TR tuzel kisiler (2026-08-24 eklendi)
  "Binance TR",
  "OKX TR",
  "Bybit TR",
];

// Adaptörü henüz stub olan borsalar — dürüstlük ilkesi gereği "yakında"
// olarak işaretleniyor, bağlanabilirmiş gibi gösterilmiyor. Ayni sıralama
// mantığı: once kuresel (hacme gore), sonra Turk borsalari (hacme gore).
// (2026-08-24: Crypto.com'un guncel API semasi cakisan/eski kaynaklarla
// dogrulanamadi; Bitexen'de deposit/withdrawal gecmisi uc noktasi yok;
// Bitci icin herkese acik bir API bulunamadi — ayrica Bitci artik
// "SAFEbit" olarak yeniden markalanmis (bitci.com.tr -> safebit.com.tr).)
export const UPCOMING_EXCHANGES = [
  // Kuresel (hacme gore)
  "Crypto.com",
  // Turk borsalari (hacme gore)
  "Bitexen",
  "Bitci",
];

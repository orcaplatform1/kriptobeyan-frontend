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
  // Turk borsalari (hacme gore)
  "BTCTurk",
];

// Adaptörü henüz stub olan borsalar — dürüstlük ilkesi gereği "yakında"
// olarak işaretleniyor, bağlanabilirmiş gibi gösterilmiyor. Ayni sıralama
// mantığı: once kuresel (hacme gore), sonra Turk borsalari (hacme gore).
export const UPCOMING_EXCHANGES = [
  // Kuresel (hacme gore)
  "Gate.io",
  "HTX",
  "Bitget",
  "MEXC",
  "Crypto.com",
  // Turk borsalari (hacme gore)
  "Paribu",
  "Bitexen",
  "ICRYPEX",
  "Bitci",
];

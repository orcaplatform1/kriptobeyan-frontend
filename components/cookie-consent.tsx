"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "kb-cookie-consent";

type CookiePrefs = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? "bg-marble-dark" : "bg-gold/25"
      }`}
    >
      <span
        className={`inline-block size-4 transform rounded-full bg-cream shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function save(prefs: CookiePrefs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gold/20 bg-parchment p-5 shadow-[0_24px_60px_-20px_rgba(28,32,25,0.35)]">
        {!showPreferences ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="text-sm text-ink-soft">
              <p>
                KriptoBeyan olarak, borsa ve cüzdan verileriniz üzerinden vergi taslak raporlama deneyiminizi en
                verimli şekilde sunabilmek adına yasalara uygun çerezler kullanıyoruz.
              </p>
              <p className="mt-2">
                Hizmetlerimiz, SPK mevzuatları ve ilgili mali düzenlemeler uyarınca herhangi bir piyasa analizi,
                sinyal veya yatırım danışmanlığı hizmeti sunmaz; resmi bir mali müşavirlik ofisi değildir. Sitemizde
                kullanılan çerezler yalnızca; API/CSV işlem geçmişlerinizi güvenle birleştirerek FIFO yöntemiyle
                taslak kazanç/kayıp hesaplaması yapan panele erişebilmeniz ve eğitim faaliyetlerimizi optimize
                edebilmek amacıyla KVKK/GDPR süreçlerine uygun olarak işlenmektedir.
              </p>
              <p className="mt-2">
                Detaylar için{" "}
                <Link href="/cerez-politikasi" className="font-medium text-gold-deep hover:underline">
                  Çerez Politikası&apos;nı
                </Link>{" "}
                inceleyebilirsin.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:ml-auto">
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="rounded-full border border-gold/25 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-cream"
              >
                ⚙️ Çerez Tercihlerini Yönet
              </button>
              <button
                type="button"
                onClick={() => save({ necessary: true, analytics: false, marketing: false })}
                className="rounded-full border border-gold/25 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-cream"
              >
                🟥 Zorunlu Olmayanları Reddet
              </button>
              <button
                type="button"
                onClick={() => save({ necessary: true, analytics: true, marketing: true })}
                className="rounded-full bg-marble-dark px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
              >
                🟩 Tüm Çerezleri Kabul Et
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">Çerez Tercihleri</p>
              <p className="mt-1 text-sm text-ink-soft">
                Hangi çerez kategorilerine izin vereceğini aşağıdan seçebilirsin.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-gold/20 bg-cream/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">🌐 Zorunlu Çerezler (Her Zaman Aktif)</p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    Borsa API/CSV verilerinizi yüklediğiniz güvenli kullanıcı paneline giriş yapabilmeniz,
                    entegrasyon formlarının çalışması ve site güvenliği için zorunludur. (Kapatılamaz)
                  </p>
                </div>
                <Toggle checked onChange={() => {}} disabled label="Zorunlu çerezler (her zaman aktif)" />
              </div>

              <div className="h-px bg-gold/15" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">📊 Performans ve Analiz Çerezleri</p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    Kullanıcıların vergi hesaplama adımlarında nerede zorlandığını analiz ederek, yazılım
                    altyapımızı ve online eğitim modüllerimizi geliştirmemize yardımcı olur.
                  </p>
                </div>
                <Toggle
                  checked={analytics}
                  onChange={setAnalytics}
                  label="Performans ve analiz çerezlerini aç/kapat"
                />
              </div>

              <div className="h-px bg-gold/15" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">📢 Pazarlama ve Reklam Çerezleri</p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    Kripto vergi beyan dönemlerine yaklaşırken KriptoBeyan bünyesindeki erken kayıt indirimleri,
                    paket güncellemeleri veya offline workshop duyurularından haberdar olmanızı sağlar.
                  </p>
                </div>
                <Toggle
                  checked={marketing}
                  onChange={setMarketing}
                  label="Pazarlama ve reklam çerezlerini aç/kapat"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-cream"
              >
                Geri
              </button>
              <button
                type="button"
                onClick={() => save({ necessary: true, analytics, marketing })}
                className="rounded-full bg-marble-dark px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
              >
                Tercihleri Kaydet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

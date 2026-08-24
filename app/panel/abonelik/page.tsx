"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ApiError,
  CRYPTO_PROVIDER_LABELS,
  attachPaymentReceipt,
  createPayment,
  getAccessToken,
  getMyUsage,
  getPlansAuthed,
  listMyPayments,
  roleFromAccessToken,
  uploadPaymentReceipt,
  type CryptoAsset,
  type CryptoProvider,
  type Payment,
  type Plan,
  type UsageSummary,
  type UserRole,
} from "@/lib/auth-client";
import { formatTRY } from "@/lib/api";

// NOT: Gercek sirket banka hesabi henuz kurulmadi (bkz. site-config.ts
// COMPANY_INFO uyarisi) — asagidaki IBAN bilerek yer tutucudur, gercek
// hesap acilinca degistirilmeli.
const BANK_DETAILS = {
  bankName: "———— Bankası",
  accountHolder: "KriptoBeyan Bilişim Teknolojileri Ltd. Şti.",
  iban: "TR00 0000 0000 0000 0000 0000 00",
};

const CRYPTO_ASSETS: CryptoAsset[] = ["BTC", "ETH", "USDT"];
const CRYPTO_PROVIDERS: CryptoProvider[] = ["BINANCE", "BYBIT", "OKX"];

const METHOD_LABELS: Record<string, string> = {
  CARD: "Kredi/Banka Kartı",
  BANK_TRANSFER: "Havale/EFT",
  CRYPTO: "Kripto",
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Bekliyor", className: "bg-gold/15 text-gold-deep" },
  COMPLETED: { label: "Onaylandı", className: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "Reddedildi", className: "bg-red-100 text-red-700" },
  FAILED: { label: "Başarısız", className: "bg-red-100 text-red-700" },
};

type View = "package" | "card" | "bank-transfer" | "crypto";

function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function AbonelikPage() {
  return (
    <Suspense fallback={null}>
      <AbonelikPageInner />
    </Suspense>
  );
}

function AbonelikPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [view, setView] = useState<View>("package");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [cryptoProvider, setCryptoProvider] = useState<CryptoProvider>("BINANCE");
  const [cryptoAsset, setCryptoAsset] = useState<CryptoAsset>("USDT");
  const [cryptoPayment, setCryptoPayment] = useState<
    (Payment & { cryptoWalletAddress: string | null }) | null
  >(null);
  const [cryptoReceiptFile, setCryptoReceiptFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const userRole = token ? roleFromAccessToken(token) : null;
      setRole(userRole);
      const [plansRes, usageRes, paymentsRes] = await Promise.all([
        getPlansAuthed(userRole ?? undefined),
        getMyUsage(),
        listMyPayments(),
      ]);
      // Ucretsiz planlar ve mevcut aktif plandan ucuz/esit planlar burada
      // gosterilmez — asagisi zaten yukseltme sayilmiyor (bkz. PaymentService
      // ayni kontrolu sunucuda da yapiyor, bu sadece secilemez secenekleri
      // baştan gizlemek icin).
      const activePriceTRY = usageRes.activePlan ? Number(usageRes.activePlan.priceTRY) : 0;
      setPlans(
        plansRes.filter(
          (p) => Number(p.priceTRY) > 0 && Number(p.priceTRY) > activePriceTRY,
        ),
      );
      setUsage(usageRes);
      setPayments(paymentsRes);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/giris?redirect=/panel/abonelik");
        return;
      }
      setError(err instanceof ApiError ? err.message : "Veriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/giris?redirect=/panel/abonelik");
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (ready) load();
  }, [ready, load]);

  useEffect(() => {
    const fromQuery = searchParams.get("plan");
    if (fromQuery) setSelectedPlanId(fromQuery);
  }, [searchParams]);

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId) ?? null,
    [plans, selectedPlanId],
  );

  // Sadece goruntu amacli tahmin — gercek fark ve yukseltme tespiti her
  // zaman sunucuda yapilir (bkz. PaymentService.createPayment), burada
  // sadece kullaniciya odeme ekranina girmeden once dogru tutari gostermek
  // icin ayni hesap tekrarlanir.
  const activePlan = usage?.activePlan ?? null;
  const isUpgradeSelection = !!(
    activePlan &&
    selectedPlan &&
    activePlan.id !== selectedPlan.id &&
    activePlan.type === selectedPlan.type &&
    Number(selectedPlan.priceTRY) > Number(activePlan.priceTRY)
  );
  const displayAmountTRY =
    isUpgradeSelection && activePlan && selectedPlan
      ? String(Number(selectedPlan.priceTRY) - Number(activePlan.priceTRY))
      : (selectedPlan?.priceTRY ?? "0");

  function resetFormState() {
    setFormError(null);
    setFormSuccess(null);
    setReceiptFile(null);
    setCryptoPayment(null);
    setCryptoReceiptFile(null);
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
  }

  function backToPackage() {
    setView("package");
    resetFormState();
  }

  const cardFormValid =
    cardName.trim().length > 2 &&
    cardNumber.replace(/\s/g, "").length === 16 &&
    cardExpiry.length === 5 &&
    cardCvv.length >= 3;

  async function submitCard() {
    if (!selectedPlan) return;
    setSubmitting(true);
    setFormError(null);
    try {
      // Kart bilgileri (numara/CVV) backend'e ASLA gonderilmiyor — gercek
      // odeme saglayicisi baglanana kadar sadece yontem bilgisiyle bekleyen
      // bir odeme kaydi olusturuluyor (bkz. PaymentService yorumu).
      await createPayment({ planId: selectedPlan.id, method: "CARD" });
      setFormSuccess("Ödeme talebin oluşturuldu, kart altyapımız tamamlandığında işlemin otomatik tamamlanacak.");
      await load();
      backToPackage();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Ödeme talebi oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitBankTransfer() {
    if (!selectedPlan) return;
    if (!receiptFile) {
      setFormError("Lütfen dekont dosyasını yükle.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const { key } = await uploadPaymentReceipt(receiptFile);
      await createPayment({
        planId: selectedPlan.id,
        method: "BANK_TRANSFER",
        receiptUrl: key,
      });
      setFormSuccess("Ödeme talebin oluşturuldu, dekontun incelenip onaylandığında planın otomatik açılacak.");
      await load();
      backToPackage();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Ödeme talebi oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  }

  async function createCryptoRequest() {
    if (!selectedPlan) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const payment = await createPayment({
        planId: selectedPlan.id,
        method: "CRYPTO",
        cryptoProvider,
        cryptoAsset,
      });
      setCryptoPayment(payment);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Ödeme talebi oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitCryptoReceipt() {
    if (!cryptoPayment || !cryptoReceiptFile) {
      setFormError("Lütfen işlem kanıtı (ekran görüntüsü/tx hash görseli) yükle.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await attachPaymentReceipt(cryptoPayment.id, cryptoReceiptFile);
      setFormSuccess("İşlem kanıtın yüklendi, incelenip onaylandığında planın otomatik açılacak.");
      await load();
      backToPackage();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Kanıt yüklenemedi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) return null;

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          Panel
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Abonelik ve ödemeler
        </h1>

        {usage && (
          <p className="mt-3 text-ink-soft">
            Mevcut plan:{" "}
            <strong className="text-ink">{usage.planName ?? "Ücretsiz"}</strong>
            {usage.endDate && (
              <> · {new Date(usage.endDate).toLocaleDateString("tr-TR")} tarihine kadar</>
            )}
          </p>
        )}

        {loading && <p className="mt-10 text-ink-soft">Yükleniyor…</p>}

        {!loading && error && (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {view === "package" && (
              <div className="mt-8 rounded-2xl border border-gold/20 bg-parchment p-6">
                <h2 className="font-serif text-lg font-semibold text-ink">
                  Plan seç
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        selectedPlanId === plan.id
                          ? "border-gold bg-cream"
                          : "border-gold/20 bg-cream/60 hover:border-gold/50"
                      }`}
                    >
                      <p className="font-serif text-lg font-semibold text-ink">
                        {plan.name}
                      </p>
                      <p className="mt-1 text-ink-soft">{formatTRY(plan.priceTRY)}</p>
                    </button>
                  ))}
                  {plans.length === 0 && (
                    <p className="text-sm text-ink-soft">
                      Şu an satın alınabilecek ücretli bir plan yok.
                    </p>
                  )}
                </div>

                {selectedPlan && (
                  <div className="mt-6 border-t border-gold/20 pt-6">
                    {isUpgradeSelection ? (
                      <p className="text-sm text-ink-soft">
                        <span className="mr-1.5 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold-deep">
                          Yükseltme
                        </span>
                        <strong className="text-ink">{activePlan!.name}</strong> planından{" "}
                        <strong className="text-ink">{selectedPlan.name}</strong>&apos;a
                        geçiş için sadece aradaki farkı,{" "}
                        <strong className="text-ink">{formatTRY(displayAmountTRY)}</strong>{" "}
                        ödeyeceksin — bitiş tarihin değişmez.
                      </p>
                    ) : (
                      <p className="text-sm text-ink-soft">
                        <strong className="text-ink">{selectedPlan.name}</strong> için{" "}
                        {formatTRY(displayAmountTRY)} ödeyeceksin.
                      </p>
                    )}
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <button
                        onClick={() => {
                          resetFormState();
                          setView("card");
                        }}
                        className="rounded-xl border border-gold/25 bg-cream px-4 py-4 text-center text-sm font-semibold text-ink transition-colors hover:border-gold"
                      >
                        Kredi/Banka Kartı
                      </button>
                      <button
                        onClick={() => {
                          resetFormState();
                          setView("bank-transfer");
                        }}
                        className="rounded-xl border border-gold/25 bg-cream px-4 py-4 text-center text-sm font-semibold text-ink transition-colors hover:border-gold"
                      >
                        Havale / EFT
                      </button>
                      <button
                        onClick={() => {
                          resetFormState();
                          setView("crypto");
                        }}
                        className="rounded-xl border border-gold/25 bg-cream px-4 py-4 text-center text-sm font-semibold text-ink transition-colors hover:border-gold"
                      >
                        Kripto
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {view === "card" && selectedPlan && (
              <div className="mt-8 rounded-2xl border border-gold/20 bg-parchment p-6">
                <button onClick={backToPackage} className="text-sm text-ink-soft hover:text-ink">
                  ← Geri
                </button>
                <h2 className="mt-3 font-serif text-lg font-semibold text-ink">
                  Kredi/Banka Kartı
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Kart bilgilerin sunucularımızda saklanmaz.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Kart üzerindeki isim"
                    className="rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                  />
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    inputMode="numeric"
                    className="rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="AA/YY"
                      inputMode="numeric"
                      className="rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                    />
                    <input
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="CVV"
                      inputMode="numeric"
                      className="rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                    />
                  </div>
                </div>
                {formError && <p className="mt-3 text-sm text-red-700">{formError}</p>}
                <button
                  onClick={submitCard}
                  disabled={!cardFormValid || submitting}
                  className="mt-5 w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
                >
                  {submitting ? "Gönderiliyor…" : "Ödemeyi Tamamla"}
                </button>
              </div>
            )}

            {view === "bank-transfer" && selectedPlan && (
              <div className="mt-8 rounded-2xl border border-gold/20 bg-parchment p-6">
                <button onClick={backToPackage} className="text-sm text-ink-soft hover:text-ink">
                  ← Geri
                </button>
                <h2 className="mt-3 font-serif text-lg font-semibold text-ink">
                  Havale / EFT
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Aşağıdaki hesaba <strong className="text-ink">{formatTRY(displayAmountTRY)}</strong>{" "}
                  gönderip dekontunu yükle — onaylandığında planın otomatik açılır.
                </p>
                <div className="mt-4 flex flex-col gap-2 rounded-xl border border-gold/15 bg-cream p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft">Banka</span>
                    <span className="font-medium text-ink">{BANK_DETAILS.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft">Hesap Sahibi</span>
                    <span className="font-medium text-ink">{BANK_DETAILS.accountHolder}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft">IBAN</span>
                    <span className="font-medium text-ink">{BANK_DETAILS.iban}</span>
                  </div>
                </div>
                <label className="mt-4 flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-dashed border-gold/30 bg-cream p-6 text-center text-sm text-ink-soft">
                  {receiptFile ? receiptFile.name : "Dekont (PDF veya görsel) yüklemek için tıkla"}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                {formError && <p className="mt-3 text-sm text-red-700">{formError}</p>}
                <button
                  onClick={submitBankTransfer}
                  disabled={submitting || !receiptFile}
                  className="mt-5 w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
                >
                  {submitting ? "Gönderiliyor…" : "Dekontu Gönder"}
                </button>
              </div>
            )}

            {view === "crypto" && selectedPlan && (
              <div className="mt-8 rounded-2xl border border-gold/20 bg-parchment p-6">
                <button onClick={backToPackage} className="text-sm text-ink-soft hover:text-ink">
                  ← Geri
                </button>
                <h2 className="mt-3 font-serif text-lg font-semibold text-ink">
                  Kripto ile öde
                </h2>

                {!cryptoPayment ? (
                  <>
                    {isUpgradeSelection ? (
                      <p className="mt-1 text-sm text-ink-soft">
                        <span className="mr-1.5 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold-deep">
                          Yükseltme
                        </span>
                        Sadece <strong className="text-ink">{formatTRY(displayAmountTRY)}</strong> tutarındaki
                        farkın kripto karşılığı kilitlenecek — bitiş tarihin değişmez.
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-ink-soft">
                        Sağlayıcı ve varlık seçtiğinde güncel kurla kilitli tutarı göreceksin.
                      </p>
                    )}
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
                          Sağlayıcı
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {CRYPTO_PROVIDERS.map((p) => (
                            <button
                              key={p}
                              onClick={() => setCryptoProvider(p)}
                              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                                cryptoProvider === p
                                  ? "bg-marble-dark text-cream"
                                  : "border border-gold/25 text-ink-soft hover:bg-cream"
                              }`}
                            >
                              {CRYPTO_PROVIDER_LABELS[p]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
                          Varlık
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {CRYPTO_ASSETS.map((a) => (
                            <button
                              key={a}
                              onClick={() => setCryptoAsset(a)}
                              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                                cryptoAsset === a
                                  ? "bg-marble-dark text-cream"
                                  : "border border-gold/25 text-ink-soft hover:bg-cream"
                              }`}
                            >
                              {a}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {formError && <p className="mt-3 text-sm text-red-700">{formError}</p>}
                    <button
                      onClick={createCryptoRequest}
                      disabled={submitting}
                      className="mt-5 w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
                    >
                      {submitting ? "Oluşturuluyor…" : "Ödeme talebi oluştur"}
                    </button>
                  </>
                ) : (
                  <>
                    {cryptoPayment.isUpgrade && (
                      <span className="mt-3 inline-flex w-fit rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold-deep">
                        Yükseltme — sadece fark
                      </span>
                    )}
                    <div className="mt-4 flex flex-col gap-2 rounded-xl border border-gold/15 bg-cream p-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-ink-soft">Sağlayıcı</span>
                        <span className="font-medium text-ink">
                          {cryptoPayment.cryptoProvider && CRYPTO_PROVIDER_LABELS[cryptoPayment.cryptoProvider]}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-ink-soft">Gönderilecek tutar</span>
                        <span className="font-medium text-ink">
                          {cryptoPayment.cryptoAmountLocked} {cryptoPayment.cryptoAsset}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-ink-soft">Kilitli kur</span>
                        <span className="font-medium text-ink">
                          1 {cryptoPayment.cryptoAsset} ≈ {formatTRY(cryptoPayment.cryptoRateTRY ?? "0")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-ink-soft">Adres</span>
                        <span className="font-medium text-ink">
                          {cryptoPayment.cryptoWalletAddress ?? "destek ekibinden isteyin"}
                        </span>
                      </div>
                    </div>
                    {!cryptoPayment.cryptoWalletAddress && (
                      <p className="mt-3 text-sm text-ink-soft">
                        Bu sağlayıcı için otomatik adres henüz tanımlı değil —{" "}
                        <a href="mailto:destek@kriptobeyan.com" className="text-gold-deep hover:underline">
                          destek@kriptobeyan.com
                        </a>{" "}
                        ile iletişime geçip ödeme talep numaranı ({cryptoPayment.id.slice(0, 8)}) paylaş.
                      </p>
                    )}
                    <label className="mt-4 flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-dashed border-gold/30 bg-cream p-6 text-center text-sm text-ink-soft">
                      {cryptoReceiptFile
                        ? cryptoReceiptFile.name
                        : "Gönderim kanıtı (ekran görüntüsü/tx hash) yüklemek için tıkla"}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => setCryptoReceiptFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    {formError && <p className="mt-3 text-sm text-red-700">{formError}</p>}
                    <button
                      onClick={submitCryptoReceipt}
                      disabled={submitting || !cryptoReceiptFile}
                      className="mt-5 w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
                    >
                      {submitting ? "Gönderiliyor…" : "Kanıtı gönder"}
                    </button>
                  </>
                )}
              </div>
            )}

            {formSuccess && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                {formSuccess}
              </div>
            )}

            <div className="mt-14">
              <h2 className="font-serif text-xl font-semibold text-ink">
                Ödeme geçmişi
              </h2>
              {payments.length === 0 ? (
                <p className="mt-4 text-ink-soft">Henüz bir ödeme kaydın yok.</p>
              ) : (
                <ul className="mt-4 flex flex-col gap-2.5">
                  {payments.map((p) => {
                    const status = STATUS_LABELS[p.status];
                    return (
                      <li
                        key={p.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold/20 bg-parchment px-4 py-3 text-sm"
                      >
                        <div>
                          <p className="font-medium text-ink">
                            {p.plan?.name ?? "Plan"} · {formatTRY(p.amount)}
                          </p>
                          <p className="text-xs text-ink-soft">
                            {new Date(p.createdAt).toLocaleDateString("tr-TR")} ·{" "}
                            {METHOD_LABELS[p.method]}
                            {p.isUpgrade && " · Yükseltme"}
                          </p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ApiError,
  login,
  postLoginRedirectPath,
  registerAccount,
  resendPhoneCode,
  roleFromAccessToken,
  saveTokens,
  verifyPhoneCode,
  type UserRole,
} from "@/lib/auth-client";
import { countryCodes } from "@/lib/data/country-codes";
import { LegalModal, type LegalDoc } from "@/components/legal-modal";
import { PasswordInput } from "@/components/password-input";
import { CustomSelect } from "@/components/custom-select";

const MIN_PASSWORD_LENGTH = 6;
const USERNAME_MIN_LENGTH = 4;
const USERNAME_MAX_LENGTH = 16;

function KayitOlContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+90");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState<UserRole>("INDIVIDUAL");
  const [termsRead, setTermsRead] = useState(false);
  const [privacyRead, setPrivacyRead] = useState(false);
  const [openDoc, setOpenDoc] = useState<LegalDoc | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Kayit basarili olunca panele gitmeden once telefon dogrulama adimi
  // gosterilir — giris bu adima bakmiyor (email dogrulamayla ayni yumusak
  // davranis, bkz. AuthService), bu yuzden "daha sonra dogrula" ile
  // atlanabiliyor.
  const [step, setStep] = useState<"form" | "verify-phone">("form");
  const [redirectPath, setRedirectPath] = useState("/panel");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const acceptedTerms = termsRead && privacyRead;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
      setError(`Kullanıcı adı ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} karakter olmalı.`);
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Parola en az ${MIN_PASSWORD_LENGTH} karakter olmalı.`);
      return;
    }
    if (password !== passwordConfirm) {
      setError("Parolalar birbiriyle uyuşmuyor.");
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Telefon numarası ülke kodundan sonra tam 10 rakam olmalı.");
      return;
    }
    if (!acceptedTerms) {
      setError("Devam etmek için Kullanım Şartları ve Gizlilik Politikası'nı okuyup onaylamalısın.");
      return;
    }

    setLoading(true);
    try {
      await registerAccount({
        email,
        username,
        password,
        role,
        fullName: fullName || undefined,
        phone: `${phoneCountryCode}${phoneNumber}`,
        phoneCountryCode,
      });
      // Hesap dogrulama e-postasi beklemeden de giris yapilabiliyor
      // (bkz. auth.service.ts login — emailVerified kontrolu yok), bu
      // yuzden kayittan hemen sonra otomatik giris yapip telefon dogrulama
      // adimini gosteriyoruz (giris yine engellenmiyor, "daha sonra
      // dogrula" ile atlanabiliyor).
      const result = await login(email, "email", password);
      if ("twoFactorRequired" in result) {
        router.push("/giris");
        return;
      }
      saveTokens(result);
      setRedirectPath(
        postLoginRedirectPath(roleFromAccessToken(result.accessToken), redirect),
      );
      setStep("verify-phone");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Kayıt başarısız, lütfen tekrar dene.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: FormEvent) {
    e.preventDefault();
    setCodeError(null);
    setCodeLoading(true);
    try {
      await verifyPhoneCode(code);
      router.push(redirectPath);
    } catch (err) {
      setCodeError(
        err instanceof ApiError ? err.message : "Kod doğrulanamadı, tekrar dene.",
      );
    } finally {
      setCodeLoading(false);
    }
  }

  async function handleResendCode() {
    setCodeError(null);
    setResendMessage(null);
    try {
      await resendPhoneCode();
      setResendMessage("Yeni kod gönderildi.");
    } catch (err) {
      setCodeError(
        err instanceof ApiError ? err.message : "Kod gönderilemedi, tekrar dene.",
      );
    }
  }

  function handleApproveDoc() {
    if (openDoc === "terms") setTermsRead(true);
    if (openDoc === "privacy") setPrivacyRead(true);
    setOpenDoc(null);
  }

  if (step === "verify-phone") {
    return (
      <main className="bg-cream">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
          <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
            Telefon doğrulama
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
            Telefonuna gönderilen kodu gir
          </h1>
          <p className="mt-3 text-ink-soft">
            {phoneCountryCode}
            {phoneNumber} numarasına 6 haneli bir doğrulama kodu gönderdik.
          </p>

          <form onSubmit={handleVerifyCode} className="mt-8 space-y-4" noValidate>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-ink">
                Doğrulama kodu
              </label>
              <input
                id="code"
                inputMode="numeric"
                required
                maxLength={6}
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-center text-lg tracking-[0.3em] text-ink outline-none transition-colors focus:border-gold"
              />
            </div>

            {codeError && <p className="text-sm text-red-700">{codeError}</p>}
            {resendMessage && (
              <p className="text-sm text-emerald-700">{resendMessage}</p>
            )}

            <button
              type="submit"
              disabled={codeLoading || code.length !== 6}
              className="w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
            >
              {codeLoading ? "Doğrulanıyor…" : "Doğrula"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResendCode}
              className="font-medium text-gold-deep hover:underline"
            >
              Kodu tekrar gönder
            </button>
            <button
              type="button"
              onClick={() => router.push(redirectPath)}
              className="font-medium text-ink-soft hover:text-ink"
            >
              Daha sonra doğrula
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          Kayıt ol
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
          Ücretsiz hesap oluştur
        </h1>
        <p className="mt-3 text-ink-soft">
          Borsa hesaplarını bağlamadan önce e-posta ve parolanla bir hesap oluştur.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          <div>
            <span className="block text-sm font-medium text-ink">
              Hesap türü
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("INDIVIDUAL")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  role === "INDIVIDUAL"
                    ? "border-gold bg-marble-dark text-cream"
                    : "border-gold/25 bg-parchment text-ink-soft"
                }`}
              >
                Bireysel
              </button>
              <button
                type="button"
                onClick={() => setRole("ACCOUNTANT")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  role === "ACCOUNTANT"
                    ? "border-gold bg-marble-dark text-cream"
                    : "border-gold/25 bg-parchment text-ink-soft"
                }`}
              >
                Mali Müşavir
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-ink">
              Ad Soyad
            </label>
            <input
              id="fullName"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-ink">
              Kullanıcı Adı
            </label>
            <input
              id="username"
              required
              minLength={USERNAME_MIN_LENGTH}
              maxLength={USERNAME_MAX_LENGTH}
              pattern="[a-zA-Z0-9_]+"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
            />
            <p className="mt-1.5 text-xs text-ink-soft">
              Sadece harf, rakam ve alt çizgi — girişte de kullanabilirsin.
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-ink">
              Telefon
            </label>
            <div className="mt-1.5 flex gap-2">
              <CustomSelect
                value={phoneCountryCode}
                onChange={setPhoneCountryCode}
                className="w-[100px] shrink-0 rounded-lg border border-gold/25 bg-parchment px-2 py-2.5 text-sm text-ink focus:border-gold"
                options={countryCodes.map((c) => ({
                  value: c.dialCode,
                  label: `${c.flag} ${c.dialCode}`,
                }))}
              />
              <input
                id="phoneNumber"
                inputMode="numeric"
                required
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
              />
            </div>
            <p className="mt-1.5 text-xs text-ink-soft">
              Kayıttan sonra SMS ile gönderilecek kodla doğrulanacak.
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink"
            >
              Parola
            </label>
            <PasswordInput
              id="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
            />
            <p className="mt-1.5 text-xs text-ink-soft">
              En az {MIN_PASSWORD_LENGTH} karakter.
            </p>
          </div>
          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-ink"
            >
              Parola (tekrar)
            </label>
            <PasswordInput
              id="passwordConfirm"
              required
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
            />
          </div>

          <div>
            <label className="flex items-start gap-2.5 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={acceptedTerms}
                readOnly
                aria-readonly
                className="mt-0.5 h-4 w-4 rounded border-gold/40 accent-gold-deep"
              />
              <span>
                <button
                  type="button"
                  onClick={() => setOpenDoc("terms")}
                  className="font-medium text-gold-deep hover:underline"
                >
                  Kullanım Şartları
                </button>
                {termsRead && <span className="text-emerald-700"> ✓</span>}{" "}
                ve{" "}
                <button
                  type="button"
                  onClick={() => setOpenDoc("privacy")}
                  className="font-medium text-gold-deep hover:underline"
                >
                  Gizlilik Politikası
                </button>
                {privacyRead && <span className="text-emerald-700"> ✓</span>}
                &apos;nı okudum, kabul ediyorum.
              </span>
            </label>
            <p className="mt-1.5 pl-[1.625rem] text-xs text-ink-soft/80">
              Bu kutucuk elle işaretlenmez — her iki metni de açıp sonundaki
              &quot;Okudum, onaylıyorum&quot;a bastığında otomatik işaretlenir.
            </p>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
          >
            {loading ? "Hesap oluşturuluyor…" : "Ücretsiz hesap oluştur"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Zaten hesabın var mı?{" "}
          <Link
            href={
              redirect
                ? `/giris?redirect=${encodeURIComponent(redirect)}`
                : "/giris"
            }
            className="font-medium text-gold-deep hover:underline"
          >
            Giriş yap
          </Link>
        </p>
      </div>

      {openDoc && (
        <LegalModal
          doc={openDoc}
          onApprove={handleApproveDoc}
          onClose={() => setOpenDoc(null)}
        />
      )}
    </main>
  );
}

export default function KayitOlPage() {
  return (
    <Suspense fallback={null}>
      <KayitOlContent />
    </Suspense>
  );
}

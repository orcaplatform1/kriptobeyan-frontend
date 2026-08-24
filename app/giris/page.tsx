"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ApiError,
  login,
  postLoginRedirectPath,
  roleFromAccessToken,
  saveTokens,
  type LoginMethod,
} from "@/lib/auth-client";
import { countryCodes } from "@/lib/data/country-codes";
import { PasswordInput } from "@/components/password-input";
import { CustomSelect } from "@/components/custom-select";

const METHODS: { value: LoginMethod; label: string }[] = [
  { value: "username", label: "Kullanıcı Adı" },
  { value: "email", label: "E-posta" },
  { value: "phone", label: "Telefon" },
];

function GirisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [method, setMethod] = useState<LoginMethod>("username");
  const [identifier, setIdentifier] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+90");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [needsTwoFactor, setNeedsTwoFactor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const finalIdentifier =
        method === "phone" ? `${phoneCountryCode}${identifier}` : identifier;
      const result = await login(
        finalIdentifier,
        method,
        password,
        needsTwoFactor ? totpCode : undefined,
      );
      if ("twoFactorRequired" in result) {
        setNeedsTwoFactor(true);
        return;
      }
      saveTokens(result);
      const role = roleFromAccessToken(result.accessToken);
      router.push(postLoginRedirectPath(role, redirect));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Giriş başarısız, lütfen tekrar dene.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-cream">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          Giriş
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
          Hesabına giriş yap
        </h1>
        <p className="mt-3 text-ink-soft">
          Kripto vergi hesaplama paneline erişmek için giriş yap.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          <div>
            <span className="block text-sm font-medium text-ink">Giriş Yöntemi</span>
            <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-xl border border-gold/25 bg-parchment p-1">
              {METHODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  disabled={needsTwoFactor}
                  onClick={() => {
                    setMethod(m.value);
                    setIdentifier("");
                  }}
                  className={`rounded-lg py-2 text-xs font-semibold transition-colors sm:text-sm ${
                    method === m.value
                      ? "bg-marble-dark text-cream"
                      : "text-ink-soft hover:text-ink"
                  } disabled:opacity-60`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-ink">
              {method === "username" ? "Kullanıcı Adı" : method === "email" ? "E-posta" : "Telefon"}
            </label>
            {method === "phone" ? (
              <div className="mt-1.5 flex gap-2">
                <CustomSelect
                  value={phoneCountryCode}
                  onChange={setPhoneCountryCode}
                  disabled={needsTwoFactor}
                  className="w-[100px] shrink-0 rounded-lg border border-gold/25 bg-parchment px-2 py-2.5 text-sm text-ink focus:border-gold"
                  options={countryCodes.map((c) => ({
                    value: c.dialCode,
                    label: `${c.flag} ${c.dialCode}`,
                  }))}
                />
                <input
                  id="identifier"
                  inputMode="numeric"
                  required
                  maxLength={10}
                  disabled={needsTwoFactor}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold disabled:opacity-60"
                />
              </div>
            ) : (
              <input
                id="identifier"
                type={method === "email" ? "email" : "text"}
                required
                autoComplete={method === "email" ? "email" : "username"}
                disabled={needsTwoFactor}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold disabled:opacity-60"
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ink"
              >
                Parola
              </label>
              <Link
                href="/sifre-sifirla"
                className="text-xs font-medium text-gold-deep hover:underline"
              >
                Şifremi unuttum
              </Link>
            </div>
            <PasswordInput
              id="password"
              required
              autoComplete="current-password"
              disabled={needsTwoFactor}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold disabled:opacity-60"
            />
          </div>

          {needsTwoFactor && (
            <div>
              <label
                htmlFor="totp"
                className="block text-sm font-medium text-ink"
              >
                Doğrulama kodu (2FA)
              </label>
              <input
                id="totp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                autoFocus
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="123456"
                className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
              />
              <p className="mt-1.5 text-xs text-ink-soft">
                Kimlik doğrulama uygulamandaki 6 haneli kodu gir.
              </p>
            </div>
          )}

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
          >
            {loading
              ? "Giriş yapılıyor…"
              : needsTwoFactor
                ? "Doğrula ve giriş yap"
                : "Giriş yap"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Hesabın yok mu?{" "}
          <Link
            href="/kayit-ol"
            className="font-medium text-gold-deep hover:underline"
          >
            Ücretsiz kayıt ol
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function GirisPage() {
  return (
    <Suspense fallback={null}>
      <GirisContent />
    </Suspense>
  );
}

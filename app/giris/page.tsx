"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, login, saveTokens } from "@/lib/auth-client";

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
      const result = await login(
        email,
        password,
        needsTwoFactor ? totpCode : undefined,
      );
      if ("twoFactorRequired" in result) {
        setNeedsTwoFactor(true);
        return;
      }
      saveTokens(result);
      router.push("/panel");
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
            <label
              htmlFor="email"
              className="block text-sm font-medium text-ink"
            >
              E-posta
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              disabled={needsTwoFactor}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold disabled:opacity-60"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink"
            >
              Parola
            </label>
            <input
              id="password"
              type="password"
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

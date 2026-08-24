"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, login, registerAccount, saveTokens } from "@/lib/auth-client";

const MIN_PASSWORD_LENGTH = 10;

export default function KayitOlPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Parola en az ${MIN_PASSWORD_LENGTH} karakter olmalı.`);
      return;
    }
    if (password !== passwordConfirm) {
      setError("Parolalar birbiriyle uyuşmuyor.");
      return;
    }
    if (!acceptedTerms) {
      setError("Devam etmek için Kullanım Şartları'nı kabul etmelisin.");
      return;
    }

    setLoading(true);
    try {
      await registerAccount(email, password);
      // Hesap dogrulama e-postasi beklemeden de giris yapilabiliyor
      // (bkz. auth.service.ts login — emailVerified kontrolu yok), bu
      // yuzden kayittan hemen sonra otomatik giris yapip panele yonlendiriyoruz.
      const result = await login(email, password);
      if ("twoFactorRequired" in result) {
        router.push("/giris");
        return;
      }
      saveTokens(result);
      router.push("/panel");
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
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
            <input
              id="passwordConfirm"
              type="password"
              required
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
            />
          </div>

          <label className="flex items-start gap-2.5 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gold/40 accent-gold-deep"
            />
            <span>
              <Link
                href="/kullanim-sartlari"
                className="font-medium text-gold-deep hover:underline"
              >
                Kullanım Şartları
              </Link>{" "}
              ve{" "}
              <Link
                href="/gizlilik-politikasi"
                className="font-medium text-gold-deep hover:underline"
              >
                Gizlilik Politikası
              </Link>
              &apos;nı okudum, kabul ediyorum.
            </span>
          </label>

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
            href="/giris"
            className="font-medium text-gold-deep hover:underline"
          >
            Giriş yap
          </Link>
        </p>
      </div>
    </main>
  );
}

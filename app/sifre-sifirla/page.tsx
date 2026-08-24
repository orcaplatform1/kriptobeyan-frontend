"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, requestPasswordReset, resetPassword } from "@/lib/auth-client";
import { PasswordInput } from "@/components/password-input";

const MIN_PASSWORD_LENGTH = 6;

function RequestResetForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Bir şeyler ters gitti, lütfen tekrar dene.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
          E-postanı kontrol et
        </h1>
        <p className="mt-3 text-ink-soft">
          Eğer <strong className="text-ink">{email}</strong> ile bir hesap
          varsa, şifre sıfırlama bağlantısı gönderildi (30 dakika geçerli).
        </p>
        <Link
          href="/giris"
          className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-gold/30 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-parchment"
        >
          Girişe dön
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
        Şifreni sıfırla
      </h1>
      <p className="mt-3 text-ink-soft">
        Hesabına kayıtlı e-posta adresini gir, sana bir sıfırlama bağlantısı
        gönderelim.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
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
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
        >
          {loading ? "Gönderiliyor…" : "Sıfırlama bağlantısı gönder"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        Şifreni hatırladın mı?{" "}
        <Link href="/giris" className="font-medium text-gold-deep hover:underline">
          Giriş yap
        </Link>
      </p>
    </>
  );
}

function SetNewPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`Parola en az ${MIN_PASSWORD_LENGTH} karakter olmalı.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Parolalar birbiriyle uyuşmuyor.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Bağlantı geçersiz veya süresi dolmuş, yeniden istek gönder.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
          Şifren güncellendi
        </h1>
        <p className="mt-3 text-ink-soft">
          Yeni şifrenle giriş yapabilirsin. Diğer tüm oturumların güvenlik
          amacıyla kapatıldı.
        </p>
        <button
          onClick={() => router.push("/giris")}
          className="mt-8 w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
        >
          Giriş yap
        </button>
      </>
    );
  }

  return (
    <>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
        Yeni şifre belirle
      </h1>
      <p className="mt-3 text-ink-soft">Hesabın için yeni bir şifre gir.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-ink"
          >
            Yeni parola
          </label>
          <PasswordInput
            id="newPassword"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
          />
          <p className="mt-1.5 text-xs text-ink-soft">
            En az {MIN_PASSWORD_LENGTH} karakter.
          </p>
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-ink"
          >
            Yeni parola (tekrar)
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
        >
          {loading ? "Kaydediliyor…" : "Şifreyi güncelle"}
        </button>
      </form>
    </>
  );
}

function SifreSifirlaContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <main className="bg-cream">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          Şifre sıfırlama
        </p>
        {token ? <SetNewPasswordForm token={token} /> : <RequestResetForm />}
      </div>
    </main>
  );
}

export default function SifreSifirlaPage() {
  return (
    <Suspense fallback={null}>
      <SifreSifirlaContent />
    </Suspense>
  );
}

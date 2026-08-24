"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ApiError, resendVerification, verifyEmail } from "@/lib/auth-client";

type Status = "verifying" | "success" | "error";

function EmailDogrulaContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>(token ? "verifying" : "error");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState("");
  const [resendState, setResendState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  useEffect(() => {
    if (!token) return;
    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setErrorMessage(
          err instanceof ApiError
            ? err.message
            : "Doğrulama sırasında bir hata oluştu.",
        );
        setStatus("error");
      });
  }, [token]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setResendState("sending");
    try {
      await resendVerification(resendEmail);
      setResendState("sent");
    } catch {
      setResendState("error");
    }
  }

  return (
    <main className="bg-cream">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          E-posta doğrulama
        </p>

        {status === "verifying" && (
          <>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
              Doğrulanıyor…
            </h1>
            <p className="mt-3 text-ink-soft">
              Bağlantı kontrol ediliyor, bir saniye.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
              E-postan doğrulandı
            </h1>
            <p className="mt-3 text-ink-soft">
              Hesabın artık tam olarak doğrulanmış durumda.
            </p>
            <Link
              href="/giris"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
            >
              Giriş yap
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
              Bağlantı geçersiz veya süresi dolmuş
            </h1>
            <p className="mt-3 text-ink-soft">
              {errorMessage ??
                "Bu doğrulama bağlantısı geçerli değil. Aşağıya e-posta adresini yazarak yeni bir bağlantı isteyebilirsin."}
            </p>

            {resendState === "sent" ? (
              <p className="mt-6 rounded-lg border border-gold/25 bg-parchment px-4 py-3 text-sm text-ink-soft">
                Eğer bu e-posta ile bir hesap varsa, yeni bir doğrulama
                bağlantısı gönderildi.
              </p>
            ) : (
              <form onSubmit={handleResend} className="mt-6 space-y-3">
                <div>
                  <label
                    htmlFor="resend-email"
                    className="block text-sm font-medium text-ink"
                  >
                    E-posta
                  </label>
                  <input
                    id="resend-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
                  />
                </div>
                {resendState === "error" && (
                  <p className="text-sm text-red-700">
                    Gönderilemedi, lütfen tekrar dene.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={resendState === "sending"}
                  className="w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
                >
                  {resendState === "sending"
                    ? "Gönderiliyor…"
                    : "Doğrulama bağlantısını tekrar gönder"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function EmailDogrulaPage() {
  return (
    <Suspense fallback={null}>
      <EmailDogrulaContent />
    </Suspense>
  );
}

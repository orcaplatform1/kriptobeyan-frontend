"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ApiError,
  acceptAccountantInvite,
  getAccessToken,
} from "@/lib/auth-client";

type Status = "checking" | "needs-auth" | "accepting" | "success" | "error";

function MuhasebeciDavetiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("checking");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Davet bağlantısı eksik veya geçersiz.");
      return;
    }
    if (!getAccessToken()) {
      setStatus("needs-auth");
      return;
    }
    setStatus("accepting");
    acceptAccountantInvite(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setErrorMessage(
          err instanceof ApiError
            ? err.message
            : "Davet kabul edilemedi, lütfen tekrar dene.",
        );
        setStatus("error");
      });
  }, [token]);

  const currentUrl =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "/muhasebeci-daveti";

  return (
    <main className="bg-cream">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          Mali müşavir daveti
        </p>

        {(status === "checking" || status === "accepting") && (
          <>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
              Kontrol ediliyor…
            </h1>
          </>
        )}

        {status === "needs-auth" && (
          <>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
              Önce giriş yapmalısın
            </h1>
            <p className="mt-3 text-ink-soft">
              Bu daveti kabul etmek için bir KriptoBeyan hesabına giriş
              yapman gerekiyor. Hesabın yoksa önce ücretsiz kayıt ol.
            </p>
            <Link
              href={`/giris?redirect=${encodeURIComponent(currentUrl)}`}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
            >
              Giriş yap
            </Link>
            <Link
              href={`/kayit-ol?redirect=${encodeURIComponent(currentUrl)}`}
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-gold/30 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-parchment"
            >
              Kayıt ol
            </Link>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
              Davet kabul edildi
            </h1>
            <p className="mt-3 text-ink-soft">
              Mali müşavirin artık vergi özetine erişebilecek. Borsa API
              key&apos;lerin hiçbir zaman görünmez.
            </p>
            <button
              onClick={() => router.push("/panel")}
              className="mt-8 w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
            >
              Panele git
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
              Davet kabul edilemedi
            </h1>
            <p className="mt-3 text-ink-soft">
              {errorMessage ?? "Bir şeyler ters gitti."}
            </p>
            <Link
              href="/panel"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-gold/30 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-parchment"
            >
              Panele dön
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function MuhasebeciDavetiPage() {
  return (
    <Suspense fallback={null}>
      <MuhasebeciDavetiContent />
    </Suspense>
  );
}

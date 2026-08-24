"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  emailFromAccessToken,
  getAccessToken,
  logout,
} from "@/lib/auth-client";

export default function PanelPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/giris");
      return;
    }
    setEmail(emailFromAccessToken(token));
    setReady(true);
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    router.push("/");
  }

  if (!ready) return null;

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          Panel
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Hoş geldin{email ? `, ${email}` : ""}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
          Giriş başarılı. Borsa/cüzdan bağlama ve vergi raporu araçları
          yakında burada olacak.
        </p>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-8 rounded-full border border-gold/30 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-parchment disabled:opacity-60"
        >
          {loggingOut ? "Çıkış yapılıyor…" : "Çıkış yap"}
        </button>
      </div>
    </main>
  );
}

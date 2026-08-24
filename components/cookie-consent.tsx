"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "kb-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function respond(choice: "accepted" | "rejected") {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-gold/20 bg-parchment p-5 shadow-[0_24px_60px_-20px_rgba(28,32,25,0.35)] sm:flex-row sm:items-center sm:gap-6">
        <p className="text-sm text-ink-soft">
          KriptoBeyan&apos;da deneyimini iyileştirmek (oturum açık tutma,
          kullanım analizi) için çerezler kullanıyoruz. Detaylar için{" "}
          <Link href="/cerez-politikasi" className="font-medium text-gold-deep hover:underline">
            Çerez Politikası&apos;nı
          </Link>{" "}
          inceleyebilirsin.
        </p>
        <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={() => respond("rejected")}
            className="rounded-full border border-gold/25 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-cream"
          >
            Reddet
          </button>
          <button
            type="button"
            onClick={() => respond("accepted")}
            className="rounded-full bg-marble-dark px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}

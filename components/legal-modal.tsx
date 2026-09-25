"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { KullanimSartlariContent } from "@/components/legal-content/kullanim-sartlari-content";
import { GizlilikPolitikasiContent } from "@/components/legal-content/gizlilik-politikasi-content";
import { KvkkContent } from "@/components/legal-content/kvkk-content";

export type LegalDoc = "terms" | "privacy" | "kvkk";

const TITLES: Record<LegalDoc, string> = {
  terms: "Kullanım Şartları",
  privacy: "Gizlilik Politikası",
  kvkk: "KVKK Aydınlatma Metni",
};

/**
 * Yasal metin penceresi: "Okudum, anladım, kabul ediyorum" düğmesi metnin EN ALTINA inilene kadar pasiftir.
 * Düğmeye basınca ilgili kutucuk otomatik işaretlenir (elle işaretlenemez).
 */
export function LegalModal({
  doc,
  onApprove,
  onClose,
}: {
  doc: LegalDoc;
  onApprove: () => void;
  onClose: () => void;
}) {
  const [atEnd, setAtEnd] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const check = useCallback(() => {
    const el = ref.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight <= 6) setAtEnd(true);
  }, []);

  useEffect(() => {
    setAtEnd(false);
    const t = setTimeout(check, 80);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); };
  }, [doc, check, onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6">
      <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-cream shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gold/15 px-6 py-4">
          <h2 className="font-serif text-lg font-semibold text-ink">{TITLES[doc]}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-parchment hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div ref={ref} onScroll={check} tabIndex={0} className="prose-legal overflow-y-auto px-6 py-5">
          {doc === "terms" ? <KullanimSartlariContent /> : doc === "kvkk" ? <KvkkContent /> : <GizlilikPolitikasiContent />}
          <p className="mt-6 text-center text-xs text-ink-soft/70">— Metnin sonu —</p>
        </div>

        <div className="border-t border-gold/15 px-6 py-4">
          <p className="mb-2 text-center text-xs text-ink-soft/80">
            {atEnd ? "Metnin sonuna geldin." : "Düğmenin aktifleşmesi için metni en alta kadar kaydır."}
          </p>
          <button
            type="button"
            disabled={!atEnd}
            onClick={onApprove}
            className="w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Okudum, anladım, kabul ediyorum
          </button>
        </div>
      </div>
    </div>
  );
}

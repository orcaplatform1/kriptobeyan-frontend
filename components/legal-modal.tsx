"use client";

import { KullanimSartlariContent } from "@/components/legal-content/kullanim-sartlari-content";
import { GizlilikPolitikasiContent } from "@/components/legal-content/gizlilik-politikasi-content";

export type LegalDoc = "terms" | "privacy";

const TITLES: Record<LegalDoc, string> = {
  terms: "Kullanım Şartları",
  privacy: "Gizlilik Politikası",
};

export function LegalModal({
  doc,
  onApprove,
  onClose,
}: {
  doc: LegalDoc;
  onApprove: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6">
      <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-cream shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gold/15 px-6 py-4">
          <h2 className="font-serif text-lg font-semibold text-ink">
            {TITLES[doc]}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-parchment hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="prose-legal overflow-y-auto px-6 py-5">
          {doc === "terms" ? <KullanimSartlariContent /> : <GizlilikPolitikasiContent />}
        </div>

        <div className="border-t border-gold/15 px-6 py-4">
          <button
            type="button"
            onClick={onApprove}
            className="w-full rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
          >
            Okudum, onaylıyorum
          </button>
        </div>
      </div>
    </div>
  );
}

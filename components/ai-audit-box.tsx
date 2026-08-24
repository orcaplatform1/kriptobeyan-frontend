"use client";

import { useEffect, useState } from "react";
import { ApiError, getAiAudit, type AiAuditResult } from "@/lib/auth-client";

const SEVERITY_STYLE: Record<
  "info" | "warning" | "critical",
  { border: string; bg: string; text: string; label: string }
> = {
  info: {
    border: "border-gold/25",
    bg: "bg-parchment",
    text: "text-ink",
    label: "Bilgilendirme",
  },
  warning: {
    border: "border-amber-300",
    bg: "bg-amber-50",
    text: "text-amber-900",
    label: "Dikkat",
  },
  critical: {
    border: "border-red-300",
    bg: "bg-red-50",
    text: "text-red-800",
    label: "Önemli",
  },
};

export function AiAuditBox({ taxYear }: { taxYear: number }) {
  const [result, setResult] = useState<AiAuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getAiAudit(taxYear)
      .then((res) => {
        if (!cancelled) setResult(res);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "Yapay Zeka Kontrolörü şu anda çalıştırılamadı.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [taxYear]);

  return (
    <div className="mt-10 rounded-xl border border-gold/20 bg-cream p-5">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden>
          🤖
        </span>
        <h3 className="font-serif text-lg font-semibold text-ink">
          Yapay Zeka Kontrolörü
        </h3>
      </div>

      {loading && (
        <p className="mt-3 text-sm text-ink-soft">
          Rapor anomali açısından kontrol ediliyor…
        </p>
      )}

      {!loading && error && (
        <p className="mt-3 text-sm text-ink-soft">
          {error} — bu kontrol raporunun kendisini etkilemez.
        </p>
      )}

      {!loading && !error && result && result.status === "clean" && (
        <p className="mt-3 text-sm text-emerald-700">
          ✓ Otomatik kontrol tamamlandı, veri kalitesinde bir sorun
          bulunamadı.
        </p>
      )}

      {!loading && !error && result && result.status === "issues" && (
        <div className="mt-3 space-y-3">
          {result.ai ? (
            <div
              className={`rounded-lg border p-4 ${SEVERITY_STYLE[result.ai.severity].border} ${SEVERITY_STYLE[result.ai.severity].bg}`}
            >
              <span
                className={`text-xs font-semibold tracking-wide uppercase ${SEVERITY_STYLE[result.ai.severity].text}`}
              >
                {SEVERITY_STYLE[result.ai.severity].label}
              </span>
              <p className={`mt-1 text-sm ${SEVERITY_STYLE[result.ai.severity].text}`}>
                {result.ai.summary}
              </p>
              {result.ai.recommendations.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                  {result.ai.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-gold/25 bg-parchment p-4">
              <p className="text-sm text-ink">
                {result.aiConfigured
                  ? "Otomatik kontrol bazı noktalar tespit etti, ama Türkçe özet şu an oluşturulamadı — aşağıdaki bulguları gözden geçirmen önerilir."
                  : "Otomatik kontrol bazı noktalar tespit etti (Türkçe özet özelliği henüz aktif değil) — aşağıdaki bulguları gözden geçirmen önerilir."}
              </p>
            </div>
          )}

          <details className="text-sm text-ink-soft">
            <summary className="cursor-pointer font-medium text-ink">
              Tespit edilen {result.findings.length} bulgu
            </summary>
            <ul className="mt-2 space-y-2 border-l border-gold/20 pl-4">
              {result.findings.map((f, i) => (
                <li key={i}>{f.description}</li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}

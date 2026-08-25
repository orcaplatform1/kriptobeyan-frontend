"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ApiError,
  getAccessToken,
  getAccountantClientSummary,
  roleFromAccessToken,
  type AccountantClientSummary,
} from "@/lib/auth-client";

function formatTRY(value: string): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export default function MusteriDetayPage({
  params,
}: {
  params: Promise<{ clientUserId: string }>;
}) {
  const { clientUserId } = use(params);
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [summary, setSummary] = useState<AccountantClientSummary | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace(`/giris?redirect=/musavir-paneli/${clientUserId}`);
      return;
    }
    setAuthorized(roleFromAccessToken(token) === "ACCOUNTANT");
    setChecked(true);
  }, [router, clientUserId]);

  useEffect(() => {
    if (!checked || !authorized) return;
    setLoading(true);
    getAccountantClientSummary(clientUserId)
      .then(setSummary)
      .catch((err) => {
        setError(
          err instanceof ApiError
            ? err.message
            : "Müşteri özeti yüklenemedi.",
        );
      })
      .finally(() => setLoading(false));
  }, [checked, authorized, clientUserId]);

  if (!checked) return null;

  if (!authorized) {
    return (
      <main className="bg-cream">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
          <h1 className="font-serif text-3xl font-semibold text-ink">
            Bu sayfa sadece mali müşavir hesapları içindir
          </h1>
          <Link
            href="/panel"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
          >
            Panele dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
        <Link
          href="/musavir-paneli"
          className="text-sm font-medium text-gold-deep hover:underline"
        >
          ← Müşteri listesine dön
        </Link>

        {loading && <p className="mt-6 text-ink-soft">Yükleniyor…</p>}
        {!loading && error && (
          <p className="mt-6 text-sm text-red-700">{error}</p>
        )}

        {!loading && !error && summary && (
          <>
            <p className="mt-6 text-xs font-semibold tracking-wide text-gold-deep uppercase">
              Müşteri
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
              {summary.client?.email ?? "—"}
            </h1>
            <p className="mt-2 text-ink-soft">
              Aktif vergi yılı: {summary.client?.activeTaxYear ?? "—"} ·
              Mükellef türü: {summary.client?.taxpayerType ?? "—"}
            </p>

            {summary.unresolvedFlags.length > 0 && (
              <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5">
                <h2 className="font-serif text-lg font-semibold text-red-800">
                  Çözülmemiş uyarılar
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-red-700">
                  {summary.unresolvedFlags.map((flag) => (
                    <li key={flag.id}>{flag.description}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10">
              <h2 className="font-serif text-lg font-semibold text-ink">
                İndirdiği raporlar
              </h2>
              {summary.reports.length === 0 ? (
                <p className="mt-4 text-ink-soft">
                  Müşteri henüz bir rapor indirmemiş.
                </p>
              ) : (
                <ul className="mt-4 flex flex-col gap-2">
                  {summary.reports.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-lg border border-gold/15 bg-parchment px-4 py-2.5 text-sm text-ink"
                    >
                      {r.taxYear} · {r.format === "PDF" ? "PDF" : "Excel"} ·{" "}
                      <span className="text-ink-soft">
                        {new Date(r.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-10">
              <h2 className="font-serif text-lg font-semibold text-ink">
                Vergi yılı özetleri
              </h2>
              {summary.summaries.length === 0 ? (
                <p className="mt-4 text-ink-soft">
                  Henüz hesaplanmış bir vergi özeti yok.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto rounded-xl border border-gold/20">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gold/20 bg-parchment text-xs font-semibold tracking-wide text-ink-soft uppercase">
                        <th className="px-4 py-3">Yıl</th>
                        <th className="px-4 py-3">Net kazanç/kayıp</th>
                        <th className="px-4 py-3">Tahmini vergi</th>
                        <th className="px-4 py-3">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.summaries.map((s) => (
                        <tr
                          key={s.taxYear}
                          className="border-b border-gold/10 last:border-0"
                        >
                          <td className="px-4 py-3 font-medium text-ink">
                            {s.taxYear}
                          </td>
                          <td
                            className={`px-4 py-3 font-medium ${
                              Number(s.netCapitalGainTRY) >= 0
                                ? "text-emerald-700"
                                : "text-red-700"
                            }`}
                          >
                            {formatTRY(s.netCapitalGainTRY)}
                          </td>
                          <td className="px-4 py-3 text-ink-soft">
                            {formatTRY(s.estimatedTaxableAmountTRY)}
                          </td>
                          <td className="px-4 py-3 text-ink-soft">
                            {s.isDraft ? "Taslak" : "Kesinleşti"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

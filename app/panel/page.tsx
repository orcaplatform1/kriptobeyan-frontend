"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ApiError,
  downloadReport,
  emailFromAccessToken,
  generateReport,
  getAccessToken,
  getDashboardOverview,
  getDashboardPositions,
  getDashboardSources,
  getMyProfile,
  listMyReports,
  logout,
  runTaxCalculation,
  type DashboardOverview,
  type DashboardPosition,
  type DashboardSources,
  type GeneratedReport,
  type PlanRequiredErrorData,
  type ReportFormat,
} from "@/lib/auth-client";
import { SourceConnections } from "@/components/source-connections";
import { CustomSelect } from "@/components/custom-select";
import { AiAuditBox } from "@/components/ai-audit-box";

const CURRENT_YEAR = new Date().getFullYear();
const SELECTABLE_YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

function formatTRY(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value);
}

function SummaryCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-700"
      : tone === "negative"
        ? "text-red-700"
        : "text-ink";
  return (
    <div className="rounded-xl border border-gold/20 bg-parchment p-5">
      <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
        {label}
      </p>
      <p className={`mt-2 font-serif text-2xl font-semibold ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}

function isPlanRequiredError(err: unknown): err is ApiError & { data: PlanRequiredErrorData } {
  return (
    err instanceof ApiError &&
    !!err.data &&
    typeof err.data === "object" &&
    (err.data as { error?: string }).error === "PLAN_REQUIRED"
  );
}

function PlanRequiredBanner({
  notice,
}: {
  notice: { message: string; recommendedPlanId: string | null; recommendedPlanName: string | null };
}) {
  const router = useRouter();
  return (
    <div className="mt-4 rounded-xl border border-gold/30 bg-gold/10 px-5 py-4 text-sm text-ink">
      <p>{notice.message}</p>
      {notice.recommendedPlanId && (
        <button
          onClick={() => router.push(`/panel/abonelik?plan=${notice.recommendedPlanId}`)}
          className="mt-3 rounded-full bg-marble-dark px-4 py-2 text-xs font-semibold text-cream hover:bg-marble-dark-2"
        >
          → {notice.recommendedPlanName ?? "Uygun plana"} geç
        </button>
      )}
    </div>
  );
}

function ExemptionBar({
  label,
  used,
  total,
  usedPercent,
}: {
  label: string;
  used: number;
  total: number | null;
  usedPercent: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-ink-soft">
          {formatTRY(used)}
          {total != null ? ` / ${formatTRY(total)}` : ""}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gold/15">
        <div
          className="h-full rounded-full bg-gold-deep"
          style={{ width: `${Math.min(100, Math.max(0, usedPercent))}%` }}
        />
      </div>
    </div>
  );
}

export default function PanelPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [taxYear, setTaxYear] = useState(CURRENT_YEAR);

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [positions, setPositions] = useState<DashboardPosition[] | null>(
    null,
  );
  const [sources, setSources] = useState<DashboardSources | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [calcNotice, setCalcNotice] = useState<PlanRequiredErrorData | null>(null);
  const [reportFormat, setReportFormat] = useState<ReportFormat>("PDF");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [genNotice, setGenNotice] = useState<PlanRequiredErrorData | null>(null);

  const loadReports = useCallback(async () => {
    try {
      setReports(await listMyReports());
    } catch {
      // rapor listesi yuklenemezse sessizce bos birak, panelin geri kalani calismaya devam etsin
    }
  }, []);

  async function handleCalculate() {
    setCalculating(true);
    setCalcError(null);
    setCalcNotice(null);
    try {
      await runTaxCalculation(taxYear);
      await loadDashboard(taxYear);
    } catch (err) {
      if (isPlanRequiredError(err)) {
        setCalcNotice(err.data);
      } else {
        setCalcError(err instanceof ApiError ? err.message : "Hesaplama yapılamadı.");
      }
    } finally {
      setCalculating(false);
    }
  }

  async function handleGenerateReport() {
    setGenerating(true);
    setGenError(null);
    setGenNotice(null);
    try {
      const report = await generateReport(taxYear, reportFormat);
      await downloadReport(report);
      await loadReports();
    } catch (err) {
      if (isPlanRequiredError(err)) {
        setGenNotice(err.data);
      } else {
        setGenError(err instanceof ApiError ? err.message : "Rapor oluşturulamadı.");
      }
    } finally {
      setGenerating(false);
    }
  }

  const loadDashboard = useCallback(
    async (year: number) => {
      setLoading(true);
      setError(null);
      try {
        const [overviewRes, positionsRes, sourcesRes] = await Promise.all([
          getDashboardOverview(year),
          getDashboardPositions(),
          getDashboardSources(),
        ]);
        setOverview(overviewRes);
        setPositions(positionsRes);
        setSources(sourcesRes);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/giris");
          return;
        }
        setError(
          err instanceof ApiError
            ? err.message
            : "Panel verileri yüklenemedi, lütfen sayfayı yenile.",
        );
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/giris");
      return;
    }
    setEmail(emailFromAccessToken(token));
    setReady(true);
    getMyProfile()
      .then((profile) => setDisplayName(profile.fullName))
      .catch(() => {
        // isim cekilemezse asagida email'e dusuluyor, kritik degil
      });
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    loadDashboard(taxYear);
    loadReports();
  }, [ready, taxYear, loadDashboard, loadReports]);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    router.push("/");
  }

  if (!ready) return null;

  const hasSources =
    sources &&
    (sources.connections.length > 0 ||
      sources.wallets.length > 0 ||
      sources.csvImports.length > 0);

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
              Panel
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
              Hoş geldin{displayName || email ? `, ${displayName || email}` : ""}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-full border border-gold/30 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-parchment disabled:opacity-60"
          >
            {loggingOut ? "Çıkış yapılıyor…" : "Çıkış yap"}
          </button>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <label htmlFor="taxYear" className="text-sm font-medium text-ink">
            Vergi yılı
          </label>
          <CustomSelect
            id="taxYear"
            value={String(taxYear)}
            onChange={(v) => setTaxYear(Number(v))}
            className="w-20 rounded-lg border border-gold/25 bg-parchment px-3 py-1.5 text-sm text-ink focus:border-gold"
            options={SELECTABLE_YEARS.map((year) => ({
              value: String(year),
              label: String(year),
            }))}
          />
          {overview?.isDraft && (
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-deep">
              Taslak
            </span>
          )}
          <button
            onClick={handleCalculate}
            disabled={calculating}
            className="ml-auto rounded-full bg-marble-dark px-4 py-2 text-xs font-semibold text-cream hover:bg-marble-dark-2 disabled:opacity-60"
          >
            {calculating ? "Hesaplanıyor…" : "Hesapla"}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-ink-soft">
          Rakamlar otomatik güncellenmez — kaynak eklediğinde/değiştirdiğinde &quot;Hesapla&quot;ya
          tekrar bas.
        </p>

        {calcError && <p className="mt-3 text-sm text-red-700">{calcError}</p>}
        {calcNotice && <PlanRequiredBanner notice={calcNotice} />}

        {loading && (
          <p className="mt-10 text-ink-soft">Panel yükleniyor…</p>
        )}

        {!loading && error && (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && overview && (
          <>
            {!hasSources && (
              <div className="mt-10 rounded-xl border border-gold/25 bg-parchment px-5 py-4 text-sm text-ink-soft">
                Henüz bir borsa hesabı, cüzdan veya CSV içe aktarımı
                bağlamadın — bu yüzden aşağıdaki rakamlar sıfır görünüyor.
                Aşağıdan bir kaynak bağlayabilirsin.
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                label="Net kazanç/kayıp"
                value={formatTRY(overview.netCapitalGainTRY)}
                tone={
                  overview.netCapitalGainTRY > 0
                    ? "positive"
                    : overview.netCapitalGainTRY < 0
                      ? "negative"
                      : "neutral"
                }
              />
              <SummaryCard
                label="Gerçekleşen kazanç"
                value={formatTRY(overview.totalRealizedGainTRY)}
                tone="positive"
              />
              <SummaryCard
                label="Gerçekleşen kayıp"
                value={formatTRY(overview.totalRealizedLossTRY)}
                tone="negative"
              />
              <SummaryCard
                label="Tahmini vergiye tabi tutar"
                value={formatTRY(overview.estimatedTaxableAmountTRY)}
              />
              <SummaryCard
                label="Diğer gelirler (staking/airdrop/LP)"
                value={formatTRY(overview.occasionalIncomeTRY)}
                tone="positive"
              />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-gold/20 bg-parchment p-5">
                <ExemptionBar
                  label="Değer artışı istisnası"
                  used={overview.capitalGainsExemption.used}
                  total={overview.capitalGainsExemption.total}
                  usedPercent={overview.capitalGainsExemption.usedPercent}
                />
              </div>
              <div className="rounded-xl border border-gold/20 bg-parchment p-5">
                <ExemptionBar
                  label="Arızi kazanç istisnası (staking/airdrop/LP)"
                  used={overview.occasionalIncomeExemption.used}
                  total={overview.occasionalIncomeExemption.total}
                  usedPercent={overview.occasionalIncomeExemption.usedPercent}
                />
              </div>
            </div>

            <AiAuditBox taxYear={taxYear} />

            <div className="mt-14 rounded-xl border border-gold/20 bg-parchment p-5">
              <h2 className="font-serif text-lg font-semibold text-ink">
                Vergi raporu indir
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                {taxYear} yılı için PDF veya Excel rapor oluşturup indir. Rapor indirmek ücretli
                bir plan gerektirir.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <CustomSelect
                  value={reportFormat}
                  onChange={(v) => setReportFormat(v as ReportFormat)}
                  className="w-32 rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink focus:border-gold"
                  options={[
                    { value: "PDF", label: "PDF" },
                    { value: "EXCEL", label: "Excel" },
                  ]}
                />
                <button
                  onClick={handleGenerateReport}
                  disabled={generating}
                  className="rounded-full bg-marble-dark px-4 py-2 text-xs font-semibold text-cream hover:bg-marble-dark-2 disabled:opacity-60"
                >
                  {generating ? "Oluşturuluyor…" : "Oluştur ve indir"}
                </button>
              </div>
              {genError && <p className="mt-3 text-sm text-red-700">{genError}</p>}
              {genNotice && <PlanRequiredBanner notice={genNotice} />}

              {reports.length > 0 && (
                <div className="mt-6 border-t border-gold/15 pt-4">
                  <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
                    İndirdiğim raporlar
                  </p>
                  <ul className="mt-2 flex flex-col gap-2">
                    {reports.map((r) => (
                      <li
                        key={r.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-gold/15 bg-cream px-3 py-2 text-sm"
                      >
                        <span className="text-ink">
                          {r.taxYear} · {r.format === "PDF" ? "PDF" : "Excel"} ·{" "}
                          <span className="text-ink-soft">
                            {new Date(r.createdAt).toLocaleDateString("tr-TR")}
                          </span>
                        </span>
                        <button
                          onClick={() => downloadReport(r)}
                          className="text-xs font-semibold text-gold-deep hover:underline"
                        >
                          İndir
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-14">
              <h2 className="font-serif text-xl font-semibold text-ink">
                Elde tuttuğun pozisyonlar
              </h2>
              {positions && positions.length > 0 ? (
                <div className="mt-4 overflow-x-auto rounded-xl border border-gold/20">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gold/20 bg-parchment text-xs font-semibold tracking-wide text-ink-soft uppercase">
                        <th className="px-4 py-3">Varlık</th>
                        <th className="px-4 py-3">Miktar</th>
                        <th className="px-4 py-3">Maliyet</th>
                        <th className="px-4 py-3">Güncel değer</th>
                        <th className="px-4 py-3">Gerçekleşmemiş K/Z</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((pos) => (
                        <tr key={pos.asset} className="border-b border-gold/10 last:border-0">
                          <td className="px-4 py-3 font-medium text-ink">
                            {pos.asset}
                          </td>
                          <td className="px-4 py-3 text-ink-soft">
                            {pos.quantity}
                          </td>
                          <td className="px-4 py-3 text-ink-soft">
                            {formatTRY(pos.costBasisTRY)}
                          </td>
                          <td className="px-4 py-3 text-ink-soft">
                            {pos.currentValueTRY != null
                              ? formatTRY(pos.currentValueTRY)
                              : "—"}
                          </td>
                          <td
                            className={`px-4 py-3 font-medium ${
                              pos.unrealizedPnlTRY == null
                                ? "text-ink-soft"
                                : pos.unrealizedPnlTRY >= 0
                                  ? "text-emerald-700"
                                  : "text-red-700"
                            }`}
                          >
                            {pos.unrealizedPnlTRY != null
                              ? formatTRY(pos.unrealizedPnlTRY)
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 text-ink-soft">
                  Elde tuttuğun bir pozisyon görünmüyor.
                </p>
              )}
            </div>

            <div className="mt-14">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-xl font-semibold text-ink">
                  Kaynak bağla
                </h2>
                <div className="flex gap-4">
                  <Link
                    href="/destek"
                    className="text-sm font-semibold text-gold-deep hover:underline"
                  >
                    Destek merkezi →
                  </Link>
                  <Link
                    href="/panel/abonelik"
                    className="text-sm font-semibold text-gold-deep hover:underline"
                  >
                    Abonelik ve ödemeler →
                  </Link>
                </div>
              </div>
              <div className="mt-4">
                <SourceConnections onSourcesChanged={() => loadDashboard(taxYear)} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

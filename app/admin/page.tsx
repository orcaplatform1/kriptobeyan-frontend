"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomSelect } from "@/components/custom-select";
import {
  ApiError,
  adminApprovePayment,
  adminDeleteUser,
  adminGetSalesStats,
  adminGetUser,
  adminGrantStaff,
  adminListPayments,
  adminListPlans,
  adminListUsers,
  adminRejectPayment,
  adminRevokeStaff,
  adminUpdatePlan,
  adminUpdateUser,
  getAccessToken,
  openPaymentReceipt,
  type AdminPayment,
  type AdminPlan,
  type AdminUserDetail,
  type AdminUserRow,
  type PaymentStatus,
  type SalesStats,
  type SalesStatsRow,
  type UserRole,
} from "@/lib/auth-client";

type Status = "checking" | "forbidden" | "error" | "ready";
type Tab = "plans" | "payments" | "users";

const TABS: { id: Tab; label: string }[] = [
  { id: "plans", label: "Planlar" },
  { id: "payments", label: "Ödemeler" },
  { id: "users", label: "Kullanıcılar" },
];

function formatTRY(value: number | string) {
  return `${Number(value).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ₺`;
}

// ================= Planlar =================

function PlanRow({ plan }: { plan: AdminPlan }) {
  const [priceTRY, setPriceTRY] = useState(plan.priceTRY);
  const [transactionLimit, setTransactionLimit] = useState(
    plan.transactionLimit != null ? String(plan.transactionLimit) : "",
  );
  const [clientLimit, setClientLimit] = useState(
    plan.clientLimit != null ? String(plan.clientLimit) : "",
  );
  const [isActive, setIsActive] = useState(plan.isActive);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await adminUpdatePlan(plan.id, {
        priceTRY: Number(priceTRY),
        ...(plan.type === "INDIVIDUAL"
          ? {
              transactionLimit:
                transactionLimit === "" ? undefined : Number(transactionLimit),
            }
          : {
              clientLimit: clientLimit === "" ? undefined : Number(clientLimit),
            }),
        isActive,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-b border-gold/10 last:border-0">
      <td className="px-4 py-3 font-medium text-ink">{plan.name}</td>
      <td className="px-4 py-3 text-ink-soft">{plan.type}</td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={0}
          step="0.01"
          value={priceTRY}
          onChange={(e) => setPriceTRY(e.target.value)}
          className="w-28 rounded-lg border border-gold/25 bg-parchment px-2.5 py-1.5 text-ink outline-none focus:border-gold"
        />
      </td>
      <td className="px-4 py-3">
        {plan.type === "INDIVIDUAL" ? (
          <input
            type="number"
            min={0}
            placeholder="Sınırsız"
            value={transactionLimit}
            onChange={(e) => setTransactionLimit(e.target.value)}
            className="w-28 rounded-lg border border-gold/25 bg-parchment px-2.5 py-1.5 text-ink outline-none focus:border-gold"
          />
        ) : (
          <input
            type="number"
            min={0}
            placeholder="Sınırsız"
            value={clientLimit}
            onChange={(e) => setClientLimit(e.target.value)}
            className="w-28 rounded-lg border border-gold/25 bg-parchment px-2.5 py-1.5 text-ink outline-none focus:border-gold"
          />
        )}
      </td>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-gold/40 accent-gold-deep"
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-marble-dark px-4 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {saved && (
          <span className="ml-2 text-xs font-medium text-emerald-700">
            Kaydedildi
          </span>
        )}
        {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
      </td>
    </tr>
  );
}

function PlansSection({ plans }: { plans: AdminPlan[] }) {
  const individualPlans = plans.filter((p) => p.type === "INDIVIDUAL");
  const accountantPlans = plans.filter((p) => p.type === "ACCOUNTANT");

  return (
    <div>
      <p className="text-ink-soft">
        Fiyat, limit ve aktiflik durumunu buradan düzenleyebilirsin.
      </p>
      {[
        { title: "Bireysel planlar", rows: individualPlans },
        { title: "Mali müşavir planları", rows: accountantPlans },
      ].map(
        ({ title, rows }) =>
          rows.length > 0 && (
            <div key={title} className="mt-8">
              <h2 className="font-serif text-xl font-semibold text-ink">{title}</h2>
              <div className="mt-4 overflow-x-auto rounded-xl border border-gold/20">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gold/20 bg-parchment text-xs font-semibold tracking-wide text-ink-soft uppercase">
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Tür</th>
                      <th className="px-4 py-3">Fiyat (₺)</th>
                      <th className="px-4 py-3">
                        {title === "Bireysel planlar" ? "İşlem limiti" : "Müşteri limiti"}
                      </th>
                      <th className="px-4 py-3">Aktif</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((plan) => (
                      <PlanRow key={plan.id} plan={plan} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ),
      )}
    </div>
  );
}

// ================= Ödemeler =================

const PAYMENT_STATUS_TABS: { value: PaymentStatus; label: string }[] = [
  { value: "PENDING", label: "Bekleyen" },
  { value: "COMPLETED", label: "Onaylı" },
  { value: "REJECTED", label: "Reddedilen" },
  { value: "FAILED", label: "Başarısız" },
];

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CARD: "Kart",
  BANK_TRANSFER: "Havale/EFT",
  CRYPTO: "Kripto",
};

const PERIOD_TABS: { value: keyof SalesStats; label: string }[] = [
  { value: "daily", label: "Günlük" },
  { value: "monthly", label: "Aylık" },
  { value: "yearly", label: "Yıllık" },
];

function formatPeriodLabel(period: string, granularity: keyof SalesStats) {
  const d = new Date(period);
  if (granularity === "daily") return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
  if (granularity === "monthly") return d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
  return d.toLocaleDateString("tr-TR", { year: "numeric" });
}

function SalesStatsSection() {
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<keyof SalesStats>("daily");

  useEffect(() => {
    adminGetSalesStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const rows: SalesStatsRow[] = stats?.[period] ?? [];
  const totalRevenue = rows.reduce((sum, r) => sum + r.revenue, 0);
  const totalCount = rows.reduce((sum, r) => sum + r.count, 0);
  const totalUpgradeRevenue = rows.reduce((sum, r) => sum + r.upgradeRevenue, 0);
  const totalUpgradeCount = rows.reduce((sum, r) => sum + r.upgradeCount, 0);

  return (
    <div className="rounded-2xl border border-gold/20 bg-parchment p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-lg font-semibold text-ink">Ciro istatistiği</h2>
        <div className="flex overflow-hidden rounded-lg border border-gold/25">
          {PERIOD_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setPeriod(t.value)}
              className={`px-3 py-1 text-xs font-semibold ${
                period === t.value ? "bg-marble-dark text-cream" : "bg-cream text-ink-soft"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-ink-soft">Yükleniyor…</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Bu dönemde onaylı ödeme yok.</p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:w-96">
            <div className="rounded-xl bg-cream p-3">
              <p className="text-xs text-ink-soft">Toplam ciro</p>
              <p className="mt-1 font-serif text-lg font-semibold text-ink">{formatTRY(totalRevenue)}</p>
            </div>
            <div className="rounded-xl bg-cream p-3">
              <p className="text-xs text-ink-soft">Toplam ödeme</p>
              <p className="mt-1 font-serif text-lg font-semibold text-ink">{totalCount}</p>
            </div>
          </div>
          {totalUpgradeCount > 0 && (
            <p className="mt-3 text-xs text-ink-soft">
              Bunun{" "}
              <strong className="text-gold-deep">
                {formatTRY(totalUpgradeRevenue)} ({totalUpgradeCount} işlem)
              </strong>{" "}
              kadarı plan yükseltmesi — yeni/yenileme satışı değil.
            </p>
          )}
          <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-gold/15">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gold/15 bg-cream text-xs font-semibold tracking-wide text-ink-soft uppercase">
                  <th className="px-3 py-2">Dönem</th>
                  <th className="px-3 py-2">Ödeme</th>
                  <th className="px-3 py-2">Ciro</th>
                  <th className="px-3 py-2">Yükseltme</th>
                </tr>
              </thead>
              <tbody>
                {[...rows].reverse().map((r) => (
                  <tr key={r.period} className="border-b border-gold/10 last:border-0">
                    <td className="px-3 py-2 text-ink">{formatPeriodLabel(r.period, period)}</td>
                    <td className="px-3 py-2 text-ink">{r.count}</td>
                    <td className="px-3 py-2 text-ink">{formatTRY(r.revenue)}</td>
                    <td className="px-3 py-2 text-ink-soft">
                      {r.upgradeCount > 0 ? `${formatTRY(r.upgradeRevenue)} (${r.upgradeCount})` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function PaymentsSection() {
  const [status, setStatus] = useState<PaymentStatus>("PENDING");
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    try {
      const res = await adminListPayments(status, page);
      setPayments(res.data);
      setPagination(res.pagination);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  async function handleApprove(id: string) {
    setBusyId(id);
    try {
      await adminApprovePayment(id);
      await reload();
    } catch {
      // liste yeniden yuklenirken hata gorunur zaten
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id: string) {
    setBusyId(id);
    try {
      await adminRejectPayment(id);
      await reload();
    } catch {
      // liste yeniden yuklenirken hata gorunur zaten
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SalesStatsSection />

      <div className="flex w-fit overflow-hidden rounded-xl border border-gold/25">
        {PAYMENT_STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={`px-4 py-1.5 text-sm font-semibold ${
              status === tab.value ? "bg-marble-dark text-cream" : "bg-parchment text-ink-soft"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gold/20">
        {loading ? (
          <p className="p-6 text-sm text-ink-soft">Yükleniyor…</p>
        ) : payments.length === 0 ? (
          <p className="p-6 text-sm text-ink-soft">Bu durumda ödeme yok.</p>
        ) : (
          <div className="divide-y divide-gold/10">
            {payments.map((p) => (
              <div key={p.id} className="bg-parchment p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">{p.user.email}</p>
                    <p className="text-xs text-ink-soft">
                      {p.plan?.name ?? "Plan"} · {PAYMENT_METHOD_LABELS[p.method]}
                      {p.isUpgrade && (
                        <span className="ml-1.5 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold-deep">
                          Yükseltme
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-base font-semibold text-ink">
                      {formatTRY(p.amount)}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {new Date(p.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {p.receiptUrl && (
                    <button
                      onClick={() => openPaymentReceipt(p.id)}
                      className="text-xs font-semibold text-gold-deep hover:underline"
                    >
                      Dekont/kanıtı görüntüle
                    </button>
                  )}
                  {p.method === "CRYPTO" && p.cryptoAmountLocked && (
                    <span className="text-xs text-ink-soft">
                      {p.cryptoAmountLocked} {p.cryptoAsset}
                    </span>
                  )}
                  {status === "PENDING" && (
                    <div className="ml-auto flex gap-2">
                      <button
                        onClick={() => handleApprove(p.id)}
                        disabled={busyId === p.id}
                        className="rounded-full bg-marble-dark px-3.5 py-1.5 text-xs font-semibold text-cream hover:bg-marble-dark-2 disabled:opacity-60"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
                        disabled={busyId === p.id}
                        className="rounded-full border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        Reddet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full border border-gold/25 px-4 py-1.5 text-sm text-ink disabled:opacity-40"
          >
            Önceki
          </button>
          <span className="text-sm text-ink-soft">
            {page} / {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-gold/25 px-4 py-1.5 text-sm text-ink disabled:opacity-40"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}

// ================= Kullanıcılar =================

function roleLabel(user: AdminUserRow) {
  if (user.staffRecord) return "Admin/Staff";
  return user.role === "ACCOUNTANT" ? "Mali Müşavir" : "Bireysel";
}

function UserDetailPanel({
  userId,
  onClose,
  onChanged,
}: {
  userId: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("INDIVIDUAL");
  const [emailVerified, setEmailVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const u = await adminGetUser(userId);
      setUser(u);
      setFullName(u.fullName ?? "");
      setPhone(u.phone ?? "");
      setRole(u.role);
      setEmailVerified(u.emailVerified);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Kullanıcı yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await adminUpdateUser(userId, { fullName, phone, role, emailVerified });
      await load();
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUnlock() {
    setSaving(true);
    try {
      await adminUpdateUser(userId, { unlock: true });
      await load();
      onChanged();
    } finally {
      setSaving(false);
    }
  }

  async function handleStaffToggle() {
    setSaving(true);
    setError(null);
    try {
      if (user?.staffRecord) {
        await adminRevokeStaff(userId);
      } else {
        await adminGrantStaff(userId);
      }
      await load();
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "İşlem yapılamadı.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await adminDeleteUser(userId);
      onChanged();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Silinemedi.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6">
      <div className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-cream shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-gold/15 px-6 py-4">
          <h2 className="font-serif text-lg font-semibold text-ink">Kullanıcı detayı</h2>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-parchment hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {loading || !user ? (
            <p className="text-sm text-ink-soft">Yükleniyor…</p>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-ink-soft">
                  {user.email} · @{user.username}
                </p>
                <p className="mt-1 text-xs text-ink-soft">
                  Kayıt: {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  {user.lastSeenAt && ` · Son görülme: ${new Date(user.lastSeenAt).toLocaleString("tr-TR")}`}
                </p>
                {user.lockedUntil && new Date(user.lockedUntil) > new Date() && (
                  <p className="mt-1 text-xs font-semibold text-red-700">
                    Hesap kilitli ({new Date(user.lockedUntil).toLocaleString("tr-TR")}&apos;e kadar)
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-gold/15 bg-parchment p-3 text-xs text-ink-soft">
                <span>Borsa: {user._count.exchangeConnections}</span>
                <span>Cüzdan: {user._count.walletAddresses}</span>
                <span>CSV: {user._count.csvImports}</span>
                <span>Ödeme: {user._count.payments}</span>
                <span className="col-span-2">
                  Aktif plan: {user.activeSubscription?.plan.name ?? "—"}
                  {user.activeSubscription &&
                    ` (${new Date(user.activeSubscription.endDate).toLocaleDateString("tr-TR")}'e kadar)`}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
                  Ad Soyad
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
                  Telefon
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
                  Rol
                </label>
                <CustomSelect
                  value={role}
                  onChange={(v) => setRole(v as UserRole)}
                  className="mt-1.5 w-full rounded-lg border border-gold/25 bg-parchment px-3 py-2 text-sm text-ink focus:border-gold"
                  options={[
                    { value: "INDIVIDUAL", label: "Bireysel" },
                    { value: "ACCOUNTANT", label: "Mali Müşavir" },
                  ]}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={emailVerified}
                  onChange={(e) => setEmailVerified(e.target.checked)}
                  className="h-4 w-4 rounded border-gold/40 accent-gold-deep"
                />
                E-posta doğrulanmış
              </label>

              {error && <p className="text-sm text-red-700">{error}</p>}

              <div className="flex flex-wrap gap-2 border-t border-gold/15 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-marble-dark px-4 py-2 text-xs font-semibold text-cream hover:bg-marble-dark-2 disabled:opacity-60"
                >
                  Kaydet
                </button>
                {user.lockedUntil && new Date(user.lockedUntil) > new Date() && (
                  <button
                    onClick={handleUnlock}
                    disabled={saving}
                    className="rounded-full border border-gold/25 px-4 py-2 text-xs font-semibold text-ink hover:bg-parchment disabled:opacity-60"
                  >
                    Kilidi kaldır
                  </button>
                )}
                <button
                  onClick={handleStaffToggle}
                  disabled={saving}
                  className="rounded-full border border-gold/25 px-4 py-2 text-xs font-semibold text-ink hover:bg-parchment disabled:opacity-60"
                >
                  {user.staffRecord ? "Admin yetkisini kaldır" : "Admin yap"}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className={`ml-auto rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-60 ${
                    confirmDelete
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "border border-red-200 text-red-700 hover:bg-red-50"
                  }`}
                >
                  {confirmDelete ? "Emin misin? Tekrar tıkla" : "Kullanıcıyı sil"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UsersSection() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [staffOnly, setStaffOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openUserId, setOpenUserId] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    try {
      const res = await adminListUsers({
        role: roleFilter === "ALL" ? undefined : roleFilter,
        staffOnly,
        search: search || undefined,
        page,
      });
      setUsers(res.data);
      setPagination(res.pagination);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, staffOnly]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    reload();
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="E-posta, kullanıcı adı veya isim ara…"
          className="min-w-[220px] flex-1 rounded-lg border border-gold/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-gold"
        />
        <CustomSelect
          value={roleFilter}
          onChange={(v) => {
            setRoleFilter(v as UserRole | "ALL");
            setPage(1);
          }}
          className="w-40 rounded-lg border border-gold/25 bg-parchment px-3 py-2 text-sm text-ink focus:border-gold"
          options={[
            { value: "ALL", label: "Tüm roller" },
            { value: "INDIVIDUAL", label: "Bireysel" },
            { value: "ACCOUNTANT", label: "Mali Müşavir" },
          ]}
        />
        <label className="flex items-center gap-2 rounded-lg border border-gold/25 bg-parchment px-3 py-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={staffOnly}
            onChange={(e) => {
              setStaffOnly(e.target.checked);
              setPage(1);
            }}
            className="h-4 w-4 rounded border-gold/40 accent-gold-deep"
          />
          Sadece admin/staff
        </label>
        <button
          type="submit"
          className="rounded-lg bg-marble-dark px-4 py-2 text-sm font-semibold text-cream hover:bg-marble-dark-2"
        >
          Ara
        </button>
      </form>

      <p className="text-xs text-ink-soft">{pagination.total} kullanıcı</p>

      <div className="overflow-x-auto rounded-2xl border border-gold/20">
        {loading ? (
          <p className="p-6 text-sm text-ink-soft">Yükleniyor…</p>
        ) : users.length === 0 ? (
          <p className="p-6 text-sm text-ink-soft">Kullanıcı bulunamadı.</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gold/20 bg-parchment text-xs font-semibold tracking-wide text-ink-soft uppercase">
                <th className="px-4 py-3">Kullanıcı</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Doğrulama</th>
                <th className="px-4 py-3">Kayıt</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gold/10 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{u.email}</p>
                    <p className="text-xs text-ink-soft">@{u.username}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        u.staffRecord
                          ? "bg-gold/15 text-gold-deep"
                          : "bg-parchment text-ink-soft"
                      }`}
                    >
                      {roleLabel(u)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-soft">
                    {u.emailVerified ? "E-posta ✓" : "E-posta ✗"}
                    {u.lockedUntil && new Date(u.lockedUntil) > new Date() && (
                      <span className="ml-1.5 text-red-700">· Kilitli</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-soft">
                    {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => setOpenUserId(u.id)}
                      className="rounded-full border border-gold/25 px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-parchment"
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full border border-gold/25 px-4 py-1.5 text-sm text-ink disabled:opacity-40"
          >
            Önceki
          </button>
          <span className="text-sm text-ink-soft">
            {page} / {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-gold/25 px-4 py-1.5 text-sm text-ink disabled:opacity-40"
          >
            Sonraki
          </button>
        </div>
      )}

      {openUserId && (
        <UserDetailPanel
          userId={openUserId}
          onClose={() => setOpenUserId(null)}
          onChanged={reload}
        />
      )}
    </div>
  );
}

// ================= Sayfa =================

export default function AdminPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("plans");

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/giris?redirect=/admin");
      return;
    }
    adminListPlans()
      .then((res) => {
        setPlans(res);
        setStatus("ready");
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 403) {
          setStatus("forbidden");
          return;
        }
        setError(err instanceof ApiError ? err.message : "Planlar yüklenemedi.");
        setStatus("error");
      });
  }, [router]);

  if (status === "checking") return null;

  if (status === "forbidden") {
    return (
      <main className="bg-cream">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
          <h1 className="font-serif text-3xl font-semibold text-ink">
            Bu sayfa için admin yetkin yok
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

  if (status === "error") {
    return (
      <main className="bg-cream">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">Admin</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Yönetim paneli
        </h1>

        <div className="mt-6 flex w-fit gap-1 rounded-xl border border-gold/20 bg-parchment p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.id ? "bg-marble-dark text-cream" : "text-ink-soft hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "plans" && <PlansSection plans={plans} />}
          {tab === "payments" && <PaymentsSection />}
          {tab === "users" && <UsersSection />}
        </div>
      </div>
    </main>
  );
}

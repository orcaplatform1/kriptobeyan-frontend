"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ApiError,
  adminListPlans,
  adminUpdatePlan,
  getAccessToken,
  type AdminPlan,
} from "@/lib/auth-client";

type Status = "checking" | "forbidden" | "error" | "ready";

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

export default function AdminPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [error, setError] = useState<string | null>(null);

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
        setError(
          err instanceof ApiError ? err.message : "Planlar yüklenemedi.",
        );
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

  const individualPlans = plans.filter((p) => p.type === "INDIVIDUAL");
  const accountantPlans = plans.filter((p) => p.type === "ACCOUNTANT");

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          Admin
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Plan yönetimi
        </h1>
        <p className="mt-3 text-ink-soft">
          Fiyat, limit ve aktiflik durumunu buradan düzenleyebilirsin.
        </p>

        {[
          { title: "Bireysel planlar", rows: individualPlans },
          { title: "Mali müşavir planları", rows: accountantPlans },
        ].map(
          ({ title, rows }) =>
            rows.length > 0 && (
              <div key={title} className="mt-10">
                <h2 className="font-serif text-xl font-semibold text-ink">
                  {title}
                </h2>
                <div className="mt-4 overflow-x-auto rounded-xl border border-gold/20">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gold/20 bg-parchment text-xs font-semibold tracking-wide text-ink-soft uppercase">
                        <th className="px-4 py-3">Plan</th>
                        <th className="px-4 py-3">Tür</th>
                        <th className="px-4 py-3">Fiyat (₺)</th>
                        <th className="px-4 py-3">
                          {title === "Bireysel planlar"
                            ? "İşlem limiti"
                            : "Müşteri limiti"}
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
    </main>
  );
}

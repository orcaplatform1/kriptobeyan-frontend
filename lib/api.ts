export interface Plan {
  id: string;
  name: string;
  type: "INDIVIDUAL" | "ACCOUNTANT";
  priceTRY: string;
  transactionLimit: number | null;
  clientLimit: number | null;
  isActive: boolean;
}

// Sunucu tarafı fetch'ler backend'e nginx proxy'si üzerinden değil,
// doğrudan localhost'tan gider (aynı VPS, daha hızlı, dışa bağımlı değil).
const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:3003";

export async function getPlans(): Promise<Plan[]> {
  try {
    const res = await fetch(`${INTERNAL_API_URL}/subscription/plans`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const plans = (await res.json()) as Plan[];
    return plans.filter((plan) => plan.isActive);
  } catch {
    // Backend geçici olarak erişilemez olsa bile sayfa build/render
    // edilebilmeli — fiyatlandırma bölümü bu durumda sessizce gizlenir.
    return [];
  }
}

export function formatTRY(value: string): string {
  const amount = Number(value);
  if (amount === 0) return "Ücretsiz";
  return `${new Intl.NumberFormat("tr-TR").format(amount)} ₺`;
}

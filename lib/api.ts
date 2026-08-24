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

export interface SiteContent {
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroDescription: string;
  heroPrimaryCtaLabel: string;
  heroSecondaryCtaLabel: string;
  footerDescription: string;
  footerCopyrightText: string | null;
  footerSupportEmail: string | null;
}

// Admin panelden duzenlenebilir hero/footer metinleri (bkz. backend
// SiteContentService) - kullanici istegi 2026-08-24: "footer hero yazılar
// panelden olsun". Backend erisilemezse (veya kayit henuz olusmadiysa) null
// doner; bilesenler bu durumda kendi SABIT varsayilan metinlerine duser,
// yani sayfa hicbir zaman bu yuzden bozulmaz.
export async function getSiteContent(): Promise<SiteContent | null> {
  try {
    const res = await fetch(`${INTERNAL_API_URL}/site-content`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as SiteContent;
  } catch {
    return null;
  }
}

export function formatTRY(value: string): string {
  const amount = Number(value);
  if (amount === 0) return "Ücretsiz";
  return `${new Intl.NumberFormat("tr-TR").format(amount)} ₺`;
}

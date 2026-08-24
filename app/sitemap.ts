import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// Statik sayfalar — her deploy'da lastModified = build anı olarak güncellenir.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/fiyatlandirma", priority: 0.9, changeFrequency: "weekly" },
  { path: "/hakkimizda", priority: 0.6, changeFrequency: "monthly" },
  { path: "/sss", priority: 0.7, changeFrequency: "monthly" },
  { path: "/iletisim", priority: 0.5, changeFrequency: "yearly" },
  { path: "/guvenlik", priority: 0.6, changeFrequency: "monthly" },
  { path: "/sorumluluk-reddi", priority: 0.5, changeFrequency: "yearly" },
  { path: "/gizlilik-politikasi", priority: 0.3, changeFrequency: "yearly" },
  { path: "/kvkk-aydinlatma-metni", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cerez-politikasi", priority: 0.3, changeFrequency: "yearly" },
  { path: "/kullanim-sartlari", priority: 0.3, changeFrequency: "yearly" },
  { path: "/mesafeli-satis-sozlesmesi", priority: 0.3, changeFrequency: "yearly" },
];

/**
 * Dinamik içerik girdileri — henüz bir blog/içerik modülü (Prisma modeli)
 * yok, bu yüzden şu an boş döner ve sitemap sadece STATIC_ROUTES'u içerir.
 *
 * İleride bir içerik modeli eklenince (örn. `BlogPost`), burada backend'in
 * public bir endpoint'inden (veya doğrudan Prisma'dan, backend içindeyse)
 * yayınlanmış içerikleri çekip aşağıdaki şekilde eşleyin — kod değişikliği
 * sadece bu fonksiyonun içinde kalır, getSitemap() birleştirmeyi otomatik
 * yapar:
 *
 *   const posts = await fetch(`${INTERNAL_API_URL}/blog/published`).then(r => r.json());
 *   return posts.map((post) => ({
 *     url: `${SITE_URL}/blog/${post.slug}`,
 *     lastModified: new Date(post.updatedAt),
 *     changeFrequency: "monthly",
 *     priority: 0.6,
 *   }));
 */
async function getDynamicEntries(): Promise<MetadataRoute.Sitemap> {
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildTime = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: buildTime,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const dynamicEntries = await getDynamicEntries();

  return [...staticEntries, ...dynamicEntries];
}

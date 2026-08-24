import fs from "node:fs";
import path from "node:path";

// Site Haritası sayfasi (app/sitemap/page.tsx) icin: app/ klasorunu TARAYARAK
// gercek sayfa listesini cikarir - yeni bir sayfa eklendiginde (page.tsx)
// kod degisikligi/redeploy disinda hicbir sey yapmadan otomatik burada da
// gorunur (kullanici istegi 2026-08-24: "otomatik tarayan versiyonu kur").
//
// Haric tutulanlar (auth gerektiren panel/admin veya token/parametreyle
// calisan tek-seferlik islem sayfalari - bir "site haritasi"nda anlamli
// degiller):
const EXCLUDED_TOP_SEGMENTS = new Set([
  "admin",
  "panel",
  "musavir-paneli",
  "muhasebeci-daveti",
  "e-posta-dogrula",
  "sifre-sifirla",
  "sitemap",
  "api",
]);

// Bilinen sayfalar icin duzgun Turkce baslik + grup - burada olmayan
// (yeni eklenen) bir sayfa otomatik olarak yol adindan turetilen bir
// baslikla "Diğer" grubuna duser, boylece hicbir sayfa listeden EKSIK
// kalmaz (sadece etiketi/gruplamasi elle iyilestirilene kadar sade kalir).
const PAGE_META: Record<string, { label: string; group: string }> = {
  "/": { label: "Anasayfa", group: "Genel" },
  "/giris": { label: "Giriş Yap", group: "Genel" },
  "/kayit-ol": { label: "Kayıt Ol", group: "Genel" },
  "/nasil-calisir": { label: "Nasıl Çalışır", group: "Ürün" },
  "/fiyatlandirma": { label: "Fiyatlandırma", group: "Ürün" },
  "/guvenlik": { label: "Güvenlik", group: "Ürün" },
  "/hakkimizda": { label: "Hakkımızda", group: "Şirket" },
  "/sss": { label: "Sık Sorulan Sorular", group: "Şirket" },
  "/iletisim": { label: "İletişim", group: "Şirket" },
  "/destek": { label: "Destek", group: "Şirket" },
  "/sorumluluk-reddi": { label: "Sorumluluk Reddi / Vergi Uyarısı", group: "Yasal" },
  "/gizlilik-politikasi": { label: "Gizlilik Politikası", group: "Yasal" },
  "/kvkk-aydinlatma-metni": { label: "KVKK Aydınlatma Metni", group: "Yasal" },
  "/cerez-politikasi": { label: "Çerez Politikası", group: "Yasal" },
  "/kullanim-sartlari": { label: "Kullanım Şartları", group: "Yasal" },
  "/mesafeli-satis-sozlesmesi": { label: "Mesafeli Satış Sözleşmesi", group: "Yasal" },
};

const GROUP_ORDER = ["Genel", "Ürün", "Şirket", "Yasal", "Diğer"];

function titleize(segment: string): string {
  return segment
    .split("-")
    .map((w) => (w.length ? w.charAt(0).toLocaleUpperCase("tr") + w.slice(1) : w))
    .join(" ");
}

function walk(dir: string, segments: string[], routes: string[][]) {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  const hasPage = entries.some((e) => e.isFile() && e.name === "page.tsx");
  if (hasPage) routes.push(segments);

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    // Rota grubu klasoru: "(grup)" URL'e yansimaz, icine yine de bakariz.
    if (name.startsWith("(") && name.endsWith(")")) {
      walk(path.join(dir, name), segments, routes);
      continue;
    }
    // Dinamik segment ([id], [slug]...): gercek deger olmadan gecerli bir
    // link uretilemez, bu alt agaci tamamen atla.
    if (name.startsWith("[")) continue;
    // Private klasor kurali (Next.js "_folder" build'e dahil edilmez).
    if (name.startsWith("_")) continue;
    walk(path.join(dir, name), [...segments, name], routes);
  }
}

export type SitePage = { href: string; label: string; group: string };

export function getSitePages(): SitePage[] {
  const appDir = path.join(process.cwd(), "app");
  const routes: string[][] = [];
  walk(appDir, [], routes);

  const pages: SitePage[] = routes
    .filter((segments) => !EXCLUDED_TOP_SEGMENTS.has(segments[0]))
    .map((segments) => {
      const href = segments.length ? `/${segments.join("/")}` : "/";
      const meta = PAGE_META[href];
      return {
        href,
        label: meta?.label ?? titleize(segments[segments.length - 1] ?? "Anasayfa"),
        group: meta?.group ?? "Diğer",
      };
    });

  return pages.sort((a, b) => {
    const gi = GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
    if (gi !== 0) return gi;
    return a.href.localeCompare(b.href, "tr");
  });
}

export function getSitePagesByGroup(): { title: string; links: { href: string; label: string }[] }[] {
  const pages = getSitePages();
  const groups = new Map<string, { href: string; label: string }[]>();
  for (const page of pages) {
    if (!groups.has(page.group)) groups.set(page.group, []);
    groups.get(page.group)!.push({ href: page.href, label: page.label });
  }
  return GROUP_ORDER.filter((g) => groups.has(g)).map((title) => ({
    title,
    links: groups.get(title)!,
  }));
}

import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

// Ortak SEO ve sosyal paylaşım kartı değerleri (Open Graph + Twitter Card)
export const HOME_TITLE = "KriptoBeyan | Vergi Hesaplama ve Beyan Asistanı";
export const HOME_DESCRIPTION =
  "Borsa hesaplarınızı ve cüzdanlarınızı bağlayın; KriptoBeyan kripto kazancınızı FIFO yöntemiyle hesaplar, beyan dönemine taslak raporla hazırlar.";
export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} logosu`,
};

const clip = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

type PageSeo = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
};

export function pageMetadata({ title, description, path, absoluteTitle }: PageSeo): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const desc = clip(description, 160);
  const suffix = ` | ${SITE_NAME}`;
  const shortTitle = clip(title, 60 - suffix.length);
  const fullTitle = absoluteTitle ? clip(title, 60) : `${shortTitle}${suffix}`;
  return {
    title: absoluteTitle ? { absolute: fullTitle } : shortTitle,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description: desc,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [OG_IMAGE.url],
    },
  };
}

// Giriş gerektiren sayfalar ve varsayılan: site geneli kart
export function defaultCard(): Metadata {
  const card = pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/", absoluteTitle: true });
  delete card.alternates;
  return card;
}

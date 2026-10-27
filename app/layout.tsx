import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { ScaleAnimationProvider } from "@/components/scale-animation-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { VisitorTracker } from "@/components/visitor-tracker";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS } from "@/lib/site-config";
import { getSiteContent } from "@/lib/api";
import "./globals.css";

const jakartaFont = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#f6efe1",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Kripto Vergi Hesaplama ve Beyan Asistanı`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const siteContent = await getSiteContent();
  return (
    <html
      lang="tr"
      className={`${jakartaFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ScaleAnimationProvider>
          <SiteHeader />
          {children}
          <SiteFooter content={siteContent} />
          <CookieConsent />
          <VisitorTracker />
        </ScaleAnimationProvider>
      </body>
    </html>
  );
}

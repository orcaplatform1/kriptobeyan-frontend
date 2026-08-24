import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { ExchangesSection } from "@/components/exchanges-section";
import { AccountantsSection } from "@/components/accountants-section";
import { PricingTeaserSection } from "@/components/pricing-teaser-section";
import { FaqTeaserSection } from "@/components/faq-teaser-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS } from "@/lib/site-config";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Kripto Vergi Hesaplama ve Beyan Asistanı",
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} — Kripto Vergi Hesaplama ve Beyan Asistanı`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    title: `${SITE_NAME} — Kripto Vergi Hesaplama ve Beyan Asistanı`,
    description: SITE_DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description: SITE_DESCRIPTION,
      email: "destek@kriptobeyan.com",
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "TRY",
      },
    },
  ],
};

export default async function Home() {
  const siteContent = await getSiteContent();
  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="flex flex-1 flex-col">
        <HeroSection content={siteContent} />
        <ExchangesSection />
        <HowItWorksSection />
        <AccountantsSection />
        <PricingTeaserSection />
        <FaqTeaserSection />
        <FinalCtaSection />
      </main>
    </>
  );
}

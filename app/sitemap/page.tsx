import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site-config";
import { getSitePagesByGroup } from "@/lib/site-pages";

export const metadata: Metadata = {
  title: "Site Haritası",
  description: "KriptoBeyan'daki tüm sayfalara tek yerden ulaşın.",
  alternates: { canonical: `${SITE_URL}/sitemap` },
};

export default function SitemapPage() {
  const sections = getSitePagesByGroup();

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          Site Haritası
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Tüm sayfalar
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-serif text-lg font-semibold text-ink">
                {section.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-soft transition-colors hover:text-gold-deep"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

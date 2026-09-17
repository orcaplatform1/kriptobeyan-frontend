import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site-config";
import { faqGroups } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description:
    "KriptoBeyan hakkında sık sorulan sorular: vergi hesaplama, veri güvenliği, borsa bağlantıları, fiyatlandırma ve daha fazlası.",
  alternates: { canonical: `${SITE_URL}/sss` },
};

export default function SssPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <main className="bg-cream">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          Sık Sorulan Sorular
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Aklınıza takılabilecek sorular
        </h1>

        <div className="mt-12 flex flex-col gap-10">
          {faqGroups.map((group) => (
            <div key={group.title}>
              <h2 className="font-serif text-xl font-semibold text-ink">
                {group.title}
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {group.items.map((item) => (
                  <details
                    key={item.id}
                    id={item.id}
                    className="group scroll-mt-24 rounded-xl border border-gold/20 bg-parchment px-5 py-4 open:bg-parchment"
                  >
                    <summary className="cursor-pointer list-none text-base font-semibold text-ink marker:content-none">
                      {item.q}
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

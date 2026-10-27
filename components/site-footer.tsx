import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINK_GROUPS } from "@/lib/site-config";
import type { SiteContent } from "@/lib/api";

function renderCopyrightWithBrandHighlight(text: string) {
  const marker = "Traders.TR";
  const parts = text.split(marker);
  if (parts.length === 1) return text;
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <span key={i} className="whitespace-nowrap">
            <span className="text-traders-white">Traders</span>
            <span className="text-traders-blue">.TR</span>{" "}
            <img
              src="/footerflag.png"
              alt=""
              aria-hidden
              className="inline-block h-[1em] w-[1em] translate-y-[0.1em] object-contain align-baseline"
            />
          </span>,
          part,
        ],
  );
}

export function SiteFooter({ content }: { content?: SiteContent | null }) {
  const description =
    content?.footerDescription ?? "Türkiye'nin kripto varlık vergi beyan asistanı.";
  const copyrightText =
    content?.footerCopyrightText ||
    `© ${new Date().getFullYear()} KriptoBeyan. Tüm hakları saklıdır. KriptoBeyan bir Traders.TR ticari markasıdır.`;

  return (
    <footer className="border-t border-gold/15 bg-marble-dark">
      <div className="container-edit grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 md:grid-cols-4 md:py-20">
        {/* Marka sütunu */}
        <div className="sm:col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative h-7 w-7 shrink-0">
              <Image
                src="/logo.png"
                alt="KriptoBeyan"
                fill
                sizes="28px"
                className="object-contain"
              />
            </span>
            <span className="font-heading text-base font-semibold text-cream">
              KriptoBeyan
            </span>
          </Link>
          <p className="mt-4 max-w-[24ch] text-sm leading-relaxed text-cream/50">
            {description}
          </p>
        </div>

        {/* Link grupları */}
        {FOOTER_LINK_GROUPS.map((group) => (
          <div key={group.title}>
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-gold-light/60">
              {group.title}
            </span>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-cream/50 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Sorumluluk reddi */}
      <div className="border-t border-cream/5">
        <div className="container-edit py-6">
          <p className="mx-auto max-w-3xl text-center text-[11px] leading-relaxed text-cream/25">
            KriptoBeyan&apos;dan alınan bilgiler profesyonel tavsiye olarak
            değerlendirilmemelidir. KriptoBeyan bir finansal danışman değildir.
            Web sitesindeki bilgilerin sizin özel durumunuzla nasıl ilişkili
            olduğunu kontrol etmek için bağımsız yasal, finansal, vergi veya
            diğer konularda danışmanlık almayı düşünmelisiniz.
          </p>
        </div>
      </div>

      {/* Alt çizgi */}
      <div className="border-t border-cream/5">
        <div className="container-edit flex flex-col items-center gap-4 py-5 sm:flex-row sm:justify-between">
          <span className="text-[12px] text-cream/35">
            {renderCopyrightWithBrandHighlight(copyrightText)}
          </span>
          <Link
            href="/sitemap"
            className="text-[12px] text-cream/35 transition-colors hover:text-cream/70"
          >
            Site Haritası
          </Link>
        </div>
      </div>
    </footer>
  );
}

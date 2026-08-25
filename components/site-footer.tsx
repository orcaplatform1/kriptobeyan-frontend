import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINK_GROUPS } from "@/lib/site-config";
import type { SiteContent } from "@/lib/api";

// Telif metni admin panelden (SiteContentSettings.footerCopyrightText) duz
// metin olarak geliyor — "Traders.TR" gecen kismini kullanici istegiyle
// (2026-08-24: "Traders'i premium kırmızı, .TR'yi premium beyaz yap, yanına
// bayrak simgesi koy") ozel stille vurgulayip yaninda bayrak ikonu gostermek
// icin metni bu sabit alt dizeye gore boluyoruz, geri kalani duz metin
// kaliyor. ORCA'daki (traders.tr) site-footer.tsx ile ayni desen/class.
function renderCopyrightWithBrandHighlight(text: string) {
  const marker = "Traders.TR";
  const parts = text.split(marker);
  if (parts.length === 1) return text;
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <span key={i} className="whitespace-nowrap">
            <span className="text-traders-red">Traders</span>
            <span className="text-traders-white">.TR</span>{" "}
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
    `© ${new Date().getFullYear()} KriptoBeyan. Tüm hakları saklıdır. KriptoBeyan bir Traders.TR ticari markasıdır. Bu platformda yer alan tüm içerikler, tasarımlar, marka unsurları ve fikrî mülkiyet hakları ilgili yasal mevzuat kapsamında korunmaktadır.`;

  return (
    <footer className="bg-marble-dark text-cream/70">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="relative h-7 w-7 shrink-0">
                <Image
                  src="/logo.png"
                  alt="KriptoBeyan"
                  fill
                  sizes="28px"
                  className="object-contain"
                />
              </span>
              <span className="font-serif text-base font-semibold text-cream">
                KriptoBeyan
              </span>
            </Link>
            <p className="mt-4 max-w-[22ch] text-sm leading-relaxed text-cream/55">
              {description}
            </p>
          </div>

          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold tracking-wide text-gold-light uppercase">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/65 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-cream/10 pt-6 text-xs text-cream/45 sm:flex-row sm:gap-4">
          <p>{renderCopyrightWithBrandHighlight(copyrightText)}</p>
          <Link href="/sitemap" className="transition-colors hover:text-cream/80">
            Site Haritası
          </Link>
        </div>
      </div>
    </footer>
  );
}

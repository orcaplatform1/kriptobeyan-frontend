import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINK_GROUPS, SUPPORT_EMAIL } from "@/lib/site-config";

export function SiteFooter() {
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
              Türkiye&apos;nin kripto varlık vergi beyan asistanı.
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

        <div className="mt-14 rounded-xl border border-cream/10 bg-white/[0.03] px-5 py-4 text-xs leading-relaxed text-cream/55">
          <strong className="text-cream/80">Vergi uyarısı:</strong> KriptoBeyan
          bir vergi danışmanlık hizmeti değildir. Platformdaki tüm hesaplamalar
          taslak/tahmini niteliktedir ve resmi beyan yerine geçmez. Kesin
          rakamlar için mutlaka bir mali müşavire danışın. Ayrıntılar için{" "}
          <Link href="/sorumluluk-reddi" className="underline hover:text-cream">
            Sorumluluk Reddi
          </Link>{" "}
          sayfamıza bakın.
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} KriptoBeyan. Tüm hakları saklıdır.</p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-cream/80">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}

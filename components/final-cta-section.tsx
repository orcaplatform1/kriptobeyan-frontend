import { AuthAwareCta } from "./auth-aware-cta";

export function FinalCtaSection() {
  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <h2 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Beyan dönemi gelmeden dengenizi kurun
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
          Hesaplarınızı bağlayın, ilk taslak vergi raporunuzu birkaç dakikada
          görün.
        </p>
        <span className="btn-gold-comet relative mt-8 inline-flex">
          <AuthAwareCta className="inline-flex items-center justify-center rounded-full bg-marble-dark px-8 py-4 text-base font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(28,32,25,0.45)] transition-transform hover:scale-[1.02] hover:bg-marble-dark-2">
            Ücretsiz Başla
          </AuthAwareCta>
        </span>

        {/* Mobil uygulama henuz gelistirilmedi (kullanici istegi 2026-08-24:
            "mobil uygulamayı da yapacağız") — bu yuzden gercek magaza
            linkleri yerine "yakında" rozetleri, yanlis/mevcut-olmayan bir
            indirme baglantisi vermemek icin bilerek tiklanamaz/pasif. */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex cursor-default items-center gap-2.5 rounded-xl border border-ink/15 bg-marble-dark px-4 py-2.5 opacity-90">
            <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 fill-cream">
              <path d="M17.05 12.536c-.02-2.09 1.71-3.09 1.79-3.14-1-1.46-2.55-1.66-3.1-1.68-1.32-.13-2.57.78-3.24.78-.66 0-1.7-.76-2.79-.74-1.44.02-2.77.84-3.51 2.12-1.5 2.6-.38 6.44 1.07 8.55.71 1.03 1.56 2.19 2.67 2.15 1.07-.04 1.48-.7 2.78-.7 1.29 0 1.66.7 2.79.68 1.16-.02 1.89-1.05 2.6-2.09.82-1.2 1.15-2.36 1.17-2.42-.03-.01-2.24-.86-2.26-3.4-.02-2.13 1.74-3.15 1.82-3.2-1-1.47-2.55-1.63-3.09-1.66-1.32-.14-2.51.75-3.16.75zM14.6 5.6c.6-.72 1-1.72.89-2.72-.86.04-1.9.58-2.51 1.29-.55.63-1.03 1.65-.9 2.62.95.07 1.92-.48 2.52-1.19z" />
            </svg>
            <span className="text-left leading-tight">
              <span className="block text-[0.6rem] text-cream/70">Yakında</span>
              <span className="block text-sm font-semibold text-cream">App Store</span>
            </span>
          </span>
          <span className="inline-flex cursor-default items-center gap-2.5 rounded-xl border border-ink/15 bg-marble-dark px-4 py-2.5 opacity-90">
            <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0">
              <path fill="#00D2FF" d="M3.6 2.6c-.3.3-.5.8-.5 1.4v16c0 .6.2 1.1.5 1.4l.1.1L13 12.2v-.4L3.7 2.5z" />
              <path fill="#00F076" d="M16.15 15.35 13 12.2v-.4l3.15-3.15.07.04 3.73 2.12c1.06.6 1.06 1.58 0 2.18l-3.73 2.12z" />
              <path fill="#FF3A44" d="M16.22 15.31 13 12l3.22-3.31L20 10.85z" />
              <path fill="#FFCE00" d="M16.22 8.69 3.7 2.5c.3-.31.75-.35 1.26-.06l11.26 6.25z" />
              <path fill="#FF3A44" d="M16.22 15.31 4.96 21.56c-.5.28-.95.25-1.25-.06l11.51-6.19z" />
            </svg>
            <span className="text-left leading-tight">
              <span className="block text-[0.6rem] text-cream/70">Yakında</span>
              <span className="block text-sm font-semibold text-cream">Google Play</span>
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

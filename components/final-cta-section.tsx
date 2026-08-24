import Link from "next/link";

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
          <Link
            href="/kayit-ol"
            className="inline-flex items-center justify-center rounded-full bg-marble-dark px-8 py-4 text-base font-semibold text-cream shadow-[0_8px_24px_-8px_rgba(28,32,25,0.45)] transition-transform hover:scale-[1.02] hover:bg-marble-dark-2"
          >
            Ücretsiz Başla
          </Link>
        </span>
      </div>
    </section>
  );
}

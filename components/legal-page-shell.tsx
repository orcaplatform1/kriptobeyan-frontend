import type { ReactNode } from "react";

export function LegalPageShell({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="mb-3 text-xs font-semibold tracking-wide text-gold-deep uppercase">
          Son güncelleme: {updated}
        </p>
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{intro}</p>
        ) : null}
        <div className="prose-legal mt-10">{children}</div>
      </div>
    </main>
  );
}

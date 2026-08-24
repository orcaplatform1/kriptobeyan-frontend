export function LegalNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 rounded-xl border border-gold/30 bg-parchment px-5 py-4 text-sm leading-relaxed text-ink-soft">
      {children}
    </div>
  );
}

import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { KullanimSartlariContent } from "@/components/legal-content/kullanim-sartlari-content";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description: "KriptoBeyan platformunu kullanırken geçerli olan kullanım şartları ve kullanıcı sözleşmesi.",
  alternates: { canonical: `${SITE_URL}/kullanim-sartlari` },
};

export default function KullanimSartlariPage() {
  return (
    <LegalPageShell title="Kullanım Şartları" updated="24 Ağustos 2026">
      <KullanimSartlariContent />
    </LegalPageShell>
  );
}

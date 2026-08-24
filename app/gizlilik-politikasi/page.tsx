import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { GizlilikPolitikasiContent } from "@/components/legal-content/gizlilik-politikasi-content";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "KriptoBeyan'ın hangi verileri topladığı, ne için kullandığı ve nasıl sakladığı hakkında gizlilik politikası.",
  alternates: { canonical: `${SITE_URL}/gizlilik-politikasi` },
};

export default function GizlilikPolitikasiPage() {
  return (
    <LegalPageShell title="Gizlilik Politikası" updated="24 Ağustos 2026">
      <GizlilikPolitikasiContent />
    </LegalPageShell>
  );
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPageShell } from "@/components/legal-page-shell";
import { GizlilikPolitikasiContent } from "@/components/legal-content/gizlilik-politikasi-content";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Gizlilik Politikası",
  description: "KriptoBeyan'ın hangi verileri topladığı, ne için kullandığı ve nasıl sakladığı hakkında gizlilik politikası.",
  path: "/gizlilik-politikasi",
});

export default function GizlilikPolitikasiPage() {
  return (
    <LegalPageShell title="Gizlilik Politikası" updated="24 Ağustos 2026">
      <GizlilikPolitikasiContent />
    </LegalPageShell>
  );
}

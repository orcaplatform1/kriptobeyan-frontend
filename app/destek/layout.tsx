import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Destek",
  description: "KriptoBeyan destek merkezi: vergi hesaplama, borsa bağlantıları ve hesabınızla ilgili talep oluşturun.",
  path: "/destek",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

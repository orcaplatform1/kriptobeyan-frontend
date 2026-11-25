import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Kayıt Ol",
  description: "Ücretsiz KriptoBeyan hesabı oluşturun; borsa ve cüzdanlarınızı bağlayarak kripto vergi hesaplamanızı otomatikleştirin.",
  path: "/kayit-ol",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

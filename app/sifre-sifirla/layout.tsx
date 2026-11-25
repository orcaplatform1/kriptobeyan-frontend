import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Şifre Sıfırla",
  description: "KriptoBeyan hesabınızın şifresini sıfırlayın ve hesabınıza yeniden erişin.",
  path: "/sifre-sifirla",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

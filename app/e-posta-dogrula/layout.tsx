import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "E-posta Doğrulama",
  description: "KriptoBeyan hesabınızın e-posta adresini doğrulayın.",
  path: "/e-posta-dogrula",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

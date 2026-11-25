import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Giriş Yap",
  description: "KriptoBeyan hesabınıza giriş yapın; borsa bağlantılarınızı, vergi hesaplamalarınızı ve taslak raporlarınızı yönetin.",
  path: "/giris",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

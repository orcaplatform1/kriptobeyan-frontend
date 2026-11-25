import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mali Müşavir Daveti",
  description: "Mali müşavirinizin KriptoBeyan davetini görüntüleyin ve kripto portföyünüze yetkili erişim izni verin.",
  path: "/muhasebeci-daveti",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

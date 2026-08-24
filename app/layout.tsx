import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ScaleAnimationProvider } from "@/components/scale-animation-context";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KriptoBeyan — Kripto Varlık Vergi Beyan Asistanı",
  description:
    "Borsa hesaplarınızı ve cüzdanlarınızı bağlayın, kripto varlık kazançlarınızı otomatik hesaplayın ve beyan dönemine taslak raporla hazırlanın.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ScaleAnimationProvider>
          <SiteHeader />
          {children}
        </ScaleAnimationProvider>
      </body>
    </html>
  );
}

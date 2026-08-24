import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 15+'da varsayilan 'attachment' oldu (bkz. next/dist/docs) —
    // remote/keyfi gorseller icin guvenlik onlemi ama burada tum gorseller
    // kendi public/ klasorumuzden, indirmeye zorlamanin anlami yok ve bazi
    // gizlilik odakli tarayicilarda (attachment header'ini indirme sayan)
    // gorsel bozuk/kucuk gorunmesine yol acabiliyor.
    contentDispositionType: "inline",
  },
};

export default nextConfig;

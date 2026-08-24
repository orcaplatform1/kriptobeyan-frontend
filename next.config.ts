import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 15+'da varsayilan 'attachment' oldu (bkz. next/dist/docs) —
    // remote/keyfi gorseller icin guvenlik onlemi ama burada tum gorseller
    // kendi public/ klasorumuzden, indirmeye zorlamanin anlami yok ve bazi
    // gizlilik odakli tarayicilarda (attachment header'ini indirme sayan)
    // gorsel bozuk/kucuk gorunmesine yol acabiliyor.
    contentDispositionType: "inline",
    // Varsayilan deviceSizes 2048/3840 de icerir; ama public/ altindaki en
    // genis kaynak gorsel (hero-base.png) sadece 1536px — bu buyuk boyutlar
    // sharp'a gereksiz BUYUTME (upscale) yaptiriyor, bu da yavas ve ilk
    // istekte nginx/next timeout'una (504/499) yol aciyordu — bkz. access.log
    // 5.229.99.182'nin tekrarlayan w=3840 hero-base.png istekleri, hero
    // gorselinin kullanicida bozuk/yuklenmemis gorunmesinin sebebi buydu.
    deviceSizes: [640, 750, 828, 1080, 1200, 1536],
  },
};

export default nextConfig;

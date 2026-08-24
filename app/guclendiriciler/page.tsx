import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Güçlendiricilerimiz",
  description:
    "KriptoBeyan'ı ayakta tutan teknolojiler: altyapı, arayüz, güvenlik, piyasa/kur veri kaynakları ve Yapay Zeka Kontrolörü'nü besleyen Claude (Anthropic).",
  alternates: { canonical: `${SITE_URL}/guclendiriciler` },
};

interface TechItem {
  name: string;
  desc: string;
}

interface TechGroup {
  title: string;
  items: TechItem[];
}

const GROUPS: TechGroup[] = [
  {
    title: "Altyapı",
    items: [
      {
        name: "NestJS",
        desc: "Borsa senkronizasyonu, FIFO vergi hesaplaması ve rapor üretimi gibi tüm ağır işleri yürüten API sunucusu.",
      },
      {
        name: "PostgreSQL + Prisma",
        desc: "İşlem geçmişiniz, hesaplanan vergi lotlarınız ve raporlarınız tip güvenli bir veri tabanı katmanı üzerinden saklanır.",
      },
      {
        name: "Redis + BullMQ",
        desc: "Borsa hesabı bağladığınızda geçmiş verinin çekilmesi gibi zaman alan işler arka planda kuyruğa alınır — panelde beklemezsiniz.",
      },
    ],
  },
  {
    title: "Arayüz",
    items: [
      {
        name: "Next.js",
        desc: "Sunucu tarafında render edilen, hızlı açılan panel ve site arayüzü.",
      },
      {
        name: "React + TypeScript",
        desc: "Bileşen tabanlı, uçtan uca tip güvenli arayüz geliştirme.",
      },
      {
        name: "Tailwind CSS",
        desc: "Sitede ve panelde tutarlı, hızlı bir tasarım dili.",
      },
    ],
  },
  {
    title: "Güvenlik",
    items: [
      {
        name: "AES-256-GCM şifreleme",
        desc: "Borsa API anahtarlarınız veritabanında hiçbir zaman düz metin olarak tutulmaz.",
      },
      {
        name: "JWT tabanlı oturum yönetimi",
        desc: "Kısa ömürlü erişim jetonu + ayrı yenileme jetonu ikilisiyle oturum güvenliği.",
      },
    ],
  },
  {
    title: "Veri kaynakları",
    items: [
      {
        name: "TCMB döviz kuru",
        desc: "Her işlem, gerçekleştiği tarihteki resmî TCMB kuru üzerinden TL'ye çevrilir.",
      },
      {
        name: "CoinGecko",
        desc: "Geçmiş ve güncel kripto varlık piyasa fiyatı verisi.",
      },
      {
        name: "Borsa API'leri",
        desc: "Binance, Bybit, OKX, BTCTurk, Paribu ve desteklenen diğer borsaların resmî API'leri — aracısız, doğrudan senkronizasyon.",
      },
    ],
  },
  {
    title: "Yapay Zeka",
    items: [
      {
        name: "Claude (Anthropic)",
        desc: "Panelinizdeki \"Yapay Zeka Kontrolörü\" kutusunu besler: sistemin kural tabanlı olarak tespit ettiği veri kalitesi bulgularını sade bir Türkçeyle özetler, vergi hesabının kendisini değiştirmez.",
      },
    ],
  },
];

export default function GuclendiricilerPage() {
  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
        <span className="btn-gold-comet inline-flex">
          <span className="inline-flex items-center rounded-full bg-marble-dark px-4 py-1.5 text-xs font-semibold tracking-wide text-cream uppercase">
            Teknoloji
          </span>
        </span>
        <h1 className="mt-5 font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Güçlendiricilerimiz
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          KriptoBeyan&apos;ı ayakta tutan altyapıyı, veri kaynaklarını ve
          güvenlik katmanlarını şeffaf bir şekilde paylaşıyoruz.
        </p>

        <div className="mt-14 space-y-12">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="font-serif text-xl font-semibold text-ink">
                {group.title}
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-gold/20 bg-parchment p-5 transition-colors hover:border-gold/40"
                  >
                    <h3 className="font-semibold text-ink">{item.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-14 text-sm text-ink-soft">
          Bu liste, ürünümüzü şeffaflık ilkesiyle tanıtmak için hazırlanmıştır
          ve reklam/sponsorluk anlaşması içermez.
        </p>
      </div>
    </main>
  );
}

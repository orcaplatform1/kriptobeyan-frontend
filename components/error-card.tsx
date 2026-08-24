"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ban,
  ShieldX,
  Lock,
  ServerCrash,
  Clock,
  WifiOff,
  Wrench,
  Timer,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

// ORCA'daki (traders.tr/core) components/errors/error-card.tsx ile AYNI
// yapı/preset seti — kullanıcı isteği 2026-08-24: "orcadaki gibi ama
// kriptobeyan'ın kendi renk paletine göre". Sadece kart/metin renkleri bu
// sitenin altın/krem paletine uyarlandı, hata ikonunun kırmızı vurgusu
// (semantik "hata" rengi) korundu — panel genelinde zaten hata durumları
// için ayni kırmızı kullanılıyor (bkz. app/panel/page.tsx error kutusu).
export type ErrorCode =
  | "400"
  | "401"
  | "403"
  | "404"
  | "408"
  | "429"
  | "500"
  | "502"
  | "503"
  | "network"
  | "generic";

type ErrorPreset = { icon: LucideIcon; title: string; description: string };

const PRESETS: Record<ErrorCode, ErrorPreset> = {
  "400": {
    icon: AlertTriangle,
    title: "400 Hatası",
    description: "İsteğin geçersiz görünüyor. Bilgileri kontrol edip tekrar dene.",
  },
  "401": {
    icon: Lock,
    title: "401 Hatası",
    description: "Oturumun sona ermiş. Devam etmek için tekrar giriş yapman gerekiyor.",
  },
  "403": {
    icon: ShieldX,
    title: "403 Hatası",
    description: "Bu sayfaya erişim yetkin yok.",
  },
  "404": {
    icon: Ban,
    title: "404 Hatası",
    description: "Böyle bir sayfa bulunamadı.",
  },
  "408": {
    icon: Timer,
    title: "408 Hatası",
    description: "İstek zaman aşımına uğradı. Lütfen tekrar dene.",
  },
  "429": {
    icon: Clock,
    title: "429 Hatası",
    description: "Çok fazla istek gönderildi. Bir süre bekleyip tekrar dene.",
  },
  "500": {
    icon: ServerCrash,
    title: "500 Hatası",
    description: "Sunucu tarafında beklenmedik bir hata oluştu.",
  },
  "502": {
    icon: Wrench,
    title: "502 Hatası",
    description: "Sunucuya şu anda ulaşılamıyor. Kısa süre sonra tekrar dene.",
  },
  "503": {
    icon: Wrench,
    title: "503 Hatası",
    description: "Servis şu anda bakımda veya geçici olarak kullanılamıyor.",
  },
  network: {
    icon: WifiOff,
    title: "Bağlantı Hatası",
    description: "İnternet bağlantın kesilmiş görünüyor. Bağlantını kontrol edip tekrar dene.",
  },
  generic: {
    icon: AlertTriangle,
    title: "Bir Şeyler Ters Gitti",
    description: "Beklenmedik bir hata oluştu.",
  },
};

export function ErrorCard({
  code,
  title,
  description,
  redirectTo = "/",
  redirectSeconds = 5,
  onRetry,
}: {
  code: ErrorCode;
  title?: string;
  description?: string;
  redirectTo?: string;
  redirectSeconds?: number;
  onRetry?: () => void;
}) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(redirectSeconds);
  const preset = PRESETS[code];
  const Icon = preset.icon;

  useEffect(() => {
    if (seconds <= 0) {
      router.replace(redirectTo);
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, redirectTo, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-gold/20 bg-parchment p-10 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-red-50">
          <Icon className="size-8 text-red-600" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">
            {title ?? preset.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {description ?? preset.description}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm font-semibold text-gold-deep hover:underline"
          >
            Tekrar dene
          </button>
        )}
        <p className="text-xs text-ink-soft/70">
          {seconds} saniye içinde ana sayfaya yönlendirileceksiniz...
        </p>
      </div>
    </div>
  );
}

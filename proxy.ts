import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16'da "middleware" "proxy" olarak yeniden adlandırıldı (bkz.
// node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md) - dosya
// middleware.ts olsaydı hiç çalışmazdı.
//
// Bu sadece iyimser (optimistic) bir kontrol: cookie'nin VARLIĞINA bakar,
// imzasını doğrulamaz (bkz. Next.js authentication guide, "Optimistic checks
// with Proxy"). Gerçek yetkilendirme sınırı her zaman backend'deki auth guard'ı
// - buradaki tek amaç, girişi olmayan bir kullanıcının panel/admin/müşavir
// kabuğunu hiç indirmeden /giris'e yönlendirilmesi (sayfaların kendi
// client-side kontrolleri zaten aynı işi yapıyordu, bu sadece daha erken ve
// flash'sız hale getiriyor).
//
// /muhasebeci-daveti kasıtlı olarak buraya dahil DEĞİL: o sayfa hem giriş
// yapmış hem yapmamış ziyaretçi için render edilip davet linkini tıklayan
// ama henüz hesabı olmayan kişiye "önce giriş yap" mesajı gösteriyor (bkz.
// app/muhasebeci-daveti/page.tsx "needs-auth" durumu) - buradan zorla
// yönlendirmek o mesajı hiç göstermeden kullanıcıyı bounce ettirir.
export function proxy(request: NextRequest) {
  const hasSession = Boolean(
    request.cookies.get("kb_access_token") || request.cookies.get("kb_refresh_token")
  );

  if (!hasSession) {
    const loginUrl = new URL("/giris", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/admin/:path*", "/musavir-paneli/:path*", "/destek/:path*"],
};

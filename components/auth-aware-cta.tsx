"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, postLoginRedirectPath } from "@/lib/auth-client";

function loggedOutHref(planId?: string): string {
  return planId
    ? `/kayit-ol?redirect=${encodeURIComponent(`/panel/abonelik?plan=${planId}`)}`
    : "/kayit-ol";
}

// "Ücretsiz Başla" / "Bu planla başla" gibi CTA'lar her yerde sabit
// /kayit-ol'a gidiyordu — kullanıcı zaten giriş yapmışsa bile kayıt
// ekranına düşüyordu. Bu bileşen giriş durumuna göre hedefi client-side
// belirler (planId verilirse giriş yapmış kullanıcıyı doğrudan o plana
// yönlendirir, giriş yapmamışsa kayıttan sonra aynı plana döner).
export function AuthAwareCta({
  className,
  planId,
  children,
}: {
  className?: string;
  planId?: string;
  children: ReactNode;
}) {
  const [href, setHref] = useState(() => loggedOutHref(planId));

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (!user) return;
      setHref(
        planId
          ? `/panel/abonelik?plan=${planId}`
          : postLoginRedirectPath(user.role),
      );
    });
  }, [planId]);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ApiError,
  changePassword,
  getAccessToken,
  getMyProfile,
  type MyProfile,
} from "@/lib/auth-client";

function VerifyBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        verified ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}
    >
      {verified ? "Doğrulanmış" : "Doğrulanmamış"}
    </span>
  );
}

export default function HesapAyarlariPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<MyProfile | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/giris?redirect=/panel/hesap");
      return;
    }
    setReady(true);
    getMyProfile()
      .then(setProfile)
      .catch(() => {
        // profil cekilemezse asagidaki kilitli alanlar bos gorunur, kritik degil
      });
  }, [router]);

  async function handleChangePassword() {
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess("Şifren güncellendi.");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Şifre değiştirilemedi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) return null;

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-2xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">Panel</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
          Hesap Ayarları
        </h1>

        <div className="mt-8 rounded-2xl border border-gold/20 bg-parchment p-6">
          <h2 className="font-serif text-lg font-semibold text-ink">İletişim Bilgileri</h2>

          <div className="mt-4 flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
                  E-posta
                </label>
                {profile && <VerifyBadge verified={profile.emailVerified} />}
              </div>
              <p className="mt-1.5 rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink-soft">
                {profile?.email ?? "—"}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
                  Telefon
                </label>
                {profile?.phone && <VerifyBadge verified={profile.phoneVerified} />}
              </div>
              <p className="mt-1.5 rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink-soft">
                {profile?.phone ?? "—"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-ink-soft">
            E-posta veya telefonunu değiştirmek için Destek Merkezi&apos;ne talep oluştur.
          </p>
          <Link
            href="/destek?category=EMAIL_PHONE_CHANGE"
            className="mt-3 inline-block rounded-full border border-gold/30 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-cream"
          >
            Destek Merkezi&apos;ne Git
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-gold/20 bg-parchment p-6">
          <h2 className="font-serif text-lg font-semibold text-ink">Şifre Değiştir</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Hesap güvenliğin için şifreni düzenli olarak güncelle.
          </p>

          <div className="mt-4 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
                Mevcut Şifre
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
                Yeni Şifre
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
                Yeni Şifre (Tekrar)
              </label>
              <input
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
          {success && <p className="mt-3 text-sm text-emerald-700">{success}</p>}

          <button
            onClick={handleChangePassword}
            disabled={submitting || !currentPassword || !newPassword || !newPasswordConfirm}
            className="mt-4 rounded-full bg-marble-dark px-5 py-2.5 text-sm font-semibold text-cream hover:bg-marble-dark-2 disabled:opacity-60"
          >
            {submitting ? "Güncelleniyor…" : "Şifreyi Güncelle"}
          </button>
        </div>
      </div>
    </main>
  );
}

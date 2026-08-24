"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ApiError,
  createMyCoupon,
  getAccessToken,
  getAccountantOverview,
  getAccountantVerificationStatus,
  getMyCoupon,
  inviteAccountantClient,
  logout,
  openAccountantVerificationDoc,
  removeAccountantClient,
  roleFromAccessToken,
  uploadAccountantVerificationDocs,
  type AccountantClientRow,
  type AccountantVerificationStatus,
  type MyCoupon,
} from "@/lib/auth-client";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Davet gönderildi",
  ACTIVE: "Aktif",
};

export default function MusavirPaneliPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [clients, setClients] = useState<AccountantClientRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const [verification, setVerification] = useState<AccountantVerificationStatus | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [taxPlateFile, setTaxPlateFile] = useState<File | null>(null);
  const [docsUploading, setDocsUploading] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);

  const loadVerification = useCallback(async () => {
    try {
      setVerification(await getAccountantVerificationStatus());
    } catch {
      // panel kritik yolu degil, sessizce gec
    }
  }, []);

  const [coupon, setCoupon] = useState<MyCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponCopied, setCouponCopied] = useState(false);

  const loadCoupon = useCallback(async () => {
    try {
      setCoupon(await getMyCoupon());
    } catch {
      // panel kritik yolu degil
    }
  }, []);

  async function handleCreateCoupon() {
    setCouponLoading(true);
    setCouponError(null);
    try {
      setCoupon(await createMyCoupon());
    } catch (err) {
      setCouponError(err instanceof ApiError ? err.message : "Kupon oluşturulamadı.");
    } finally {
      setCouponLoading(false);
    }
  }

  function copyCouponCode() {
    if (!coupon) return;
    navigator.clipboard.writeText(coupon.code);
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2000);
  }

  const loadClients = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setClients(await getAccountantOverview());
    } catch (err) {
      setLoadError(
        err instanceof ApiError
          ? err.message
          : "Müşteri listesi yüklenemedi.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/giris?redirect=/musavir-paneli");
      return;
    }
    setAuthorized(roleFromAccessToken(token) === "ACCOUNTANT");
    setChecked(true);
  }, [router]);

  useEffect(() => {
    if (checked && authorized) {
      loadClients();
      loadVerification();
      loadCoupon();
    }
  }, [checked, authorized, loadClients, loadVerification, loadCoupon]);

  async function handleUploadDocs(e: FormEvent) {
    e.preventDefault();
    setDocsError(null);
    setDocsUploading(true);
    try {
      await uploadAccountantVerificationDocs(licenseFile, taxPlateFile);
      setLicenseFile(null);
      setTaxPlateFile(null);
      await loadVerification();
    } catch (err) {
      setDocsError(err instanceof ApiError ? err.message : "Belgeler yüklenemedi.");
    } finally {
      setDocsUploading(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    router.push("/");
  }

  async function handleInvite(e: FormEvent) {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);
    setInviteLoading(true);
    try {
      await inviteAccountantClient(inviteEmail);
      setInviteSuccess(`${inviteEmail} davet edildi.`);
      setInviteEmail("");
      await loadClients();
    } catch (err) {
      setInviteError(
        err instanceof ApiError ? err.message : "Davet gönderilemedi.",
      );
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeAccountantClient(id);
      await loadClients();
    } catch {
      // liste bir sonraki yenilemede tekrar tutarli hale gelir
    }
  }

  if (!checked) return null;

  if (!authorized) {
    return (
      <main className="bg-cream">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
          <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
            Müşavir Paneli
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
            Bu sayfa sadece mali müşavir hesapları içindir
          </h1>
          <p className="mt-3 text-ink-soft">
            Hesabın bireysel plana kayıtlı görünüyor. Mali müşavir hesabına
            geçmek için destek ile iletişime geç.
          </p>
          <Link
            href="/panel"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-marble-dark px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2"
          >
            Panele dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
              Müşavir Paneli
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
              Müşterilerin
            </h1>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-full border border-gold/30 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-parchment disabled:opacity-60"
          >
            {loggingOut ? "Çıkış yapılıyor…" : "Çıkış yap"}
          </button>
        </div>

        {verification && !verification.verified && (
          <div className="mt-10 rounded-xl border border-gold/30 bg-gold/10 p-5">
            <h2 className="font-serif text-lg font-semibold text-ink">
              Kimlik doğrulama gerekli
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Müşteri davet edebilmek için müşavirlik belgeni ve vergi
              levhanı (ya da SGK dökümanı) yükleyip admin onayı almalısın.
            </p>
            <p className="mt-1 text-xs text-ink-soft/80">
              Müşavir olduğuna dair belge kesin gerekli. İkinci belge için:
              kendi vergi mükellefiyetin varsa vergi levhası, bir müşavirlik
              ofisinde/odasında çalışıyorsan (kendi vergi levhan yoksa) SGK
              hizmet dökümanın da kabul edilir.
            </p>

            {verification.hasLicenseDoc && verification.hasTaxPlateDoc ? (
              <p className="mt-3 text-sm font-medium text-gold-deep">
                Belgelerin yüklendi, inceleniyor — onaylanınca müşteri davet
                edebileceksin.
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {verification.hasLicenseDoc && (
                <button
                  onClick={() => openAccountantVerificationDoc("me", "license", false)}
                  className="font-medium text-gold-deep hover:underline"
                >
                  Yüklenen müşavirlik belgesini görüntüle
                </button>
              )}
              {verification.hasTaxPlateDoc && (
                <button
                  onClick={() => openAccountantVerificationDoc("me", "taxPlate", false)}
                  className="font-medium text-gold-deep hover:underline"
                >
                  Yüklenen vergi levhası/SGK dökümanını görüntüle
                </button>
              )}
            </div>

            <form onSubmit={handleUploadDocs} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-dashed border-gold/40 bg-cream p-4 text-center text-sm text-ink-soft">
                {licenseFile ? licenseFile.name : "Müşavirlik belgesi (PDF/görsel)"}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => setLicenseFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-dashed border-gold/40 bg-cream p-4 text-center text-sm text-ink-soft">
                {taxPlateFile ? taxPlateFile.name : "Vergi levhası veya SGK dökümanı (PDF/görsel)"}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => setTaxPlateFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {docsError && (
                <p className="sm:col-span-2 text-sm text-red-700">{docsError}</p>
              )}
              <button
                type="submit"
                disabled={docsUploading || (!licenseFile && !taxPlateFile)}
                className="sm:col-span-2 rounded-full bg-marble-dark px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
              >
                {docsUploading ? "Yükleniyor…" : "Belgeleri gönder"}
              </button>
            </form>
          </div>
        )}

        {verification?.verified && (
          <div className="mt-10 rounded-xl border border-gold/20 bg-parchment p-5">
            <h2 className="font-serif text-lg font-semibold text-ink">
              İndirim kuponun
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Bu kodu mükelleflerine ver — kayıt sırasında kullandıklarında
              %{coupon?.discountPercent ?? 15} indirim alırlar. Kod kimin
              hesabına indirim getirdiğini takip eder, mükellefin verisine
              erişim vermez (o ayrı, kendi onaylayacağı bir davettir).
            </p>

            {coupon ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-marble-dark px-4 py-2 font-mono text-sm font-semibold tracking-wide text-cream">
                  {coupon.code}
                </span>
                <button
                  onClick={copyCouponCode}
                  className="rounded-full border border-gold/30 px-4 py-2 text-sm font-semibold text-ink hover:bg-cream"
                >
                  {couponCopied ? "Kopyalandı ✓" : "Kopyala"}
                </button>
                <span className="text-sm text-ink-soft">
                  {coupon.redemptionCount} kullanım · toplam{" "}
                  {Number(coupon.totalDiscountGivenTRY).toLocaleString("tr-TR")} ₺ indirim
                </span>
              </div>
            ) : (
              <>
                {couponError && <p className="mt-3 text-sm text-red-700">{couponError}</p>}
                <button
                  onClick={handleCreateCoupon}
                  disabled={couponLoading}
                  className="mt-4 rounded-full bg-marble-dark px-5 py-2.5 text-sm font-semibold text-cream hover:bg-marble-dark-2 disabled:opacity-60"
                >
                  {couponLoading ? "Oluşturuluyor…" : "Kupon kodu oluştur"}
                </button>
              </>
            )}
          </div>
        )}

        <div className="mt-10 rounded-xl border border-gold/20 bg-parchment p-5">
          <h2 className="font-serif text-lg font-semibold text-ink">
            Yeni müşteri davet et
          </h2>
          {verification && !verification.verified ? (
            <p className="mt-3 text-sm text-ink-soft">
              Belge onayı tamamlanmadan müşteri davet edemezsin.
            </p>
          ) : (
            <>
              <form
                onSubmit={handleInvite}
                className="mt-4 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  placeholder="musteri@ornek.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 rounded-lg border border-gold/25 bg-cream px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="rounded-full bg-marble-dark px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
                >
                  {inviteLoading ? "Gönderiliyor…" : "Davet gönder"}
                </button>
              </form>
              {inviteError && (
                <p className="mt-2 text-sm text-red-700">{inviteError}</p>
              )}
              {inviteSuccess && (
                <p className="mt-2 text-sm text-emerald-700">{inviteSuccess}</p>
              )}
            </>
          )}
        </div>

        <div className="mt-10">
          {loading && <p className="text-ink-soft">Yükleniyor…</p>}
          {!loading && loadError && (
            <p className="text-sm text-red-700">{loadError}</p>
          )}
          {!loading && !loadError && clients && clients.length === 0 && (
            <p className="text-ink-soft">
              Henüz davet ettiğin bir müşteri yok.
            </p>
          )}
          {!loading && !loadError && clients && clients.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-gold/20">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gold/20 bg-parchment text-xs font-semibold tracking-wide text-ink-soft uppercase">
                    <th className="px-4 py-3">E-posta</th>
                    <th className="px-4 py-3">Durum</th>
                    <th className="px-4 py-3">Vergi yılı</th>
                    <th className="px-4 py-3">Rapor</th>
                    <th className="px-4 py-3">Açık uyarı</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-gold/10 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-ink">
                        {c.client?.email ?? c.inviteEmail}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">
                        {STATUS_LABEL[c.status] ?? c.status}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">
                        {c.client?.activeTaxYear ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">
                        {c.status === "ACTIVE"
                          ? c.hasCompletedReport
                            ? "Hazır"
                            : "Bekliyor"
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">
                        {c.status === "ACTIVE" ? c.unresolvedFlagCount : "—"}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {c.status === "ACTIVE" && c.clientUserId && (
                          <Link
                            href={`/musavir-paneli/${c.clientUserId}`}
                            className="mr-4 font-medium text-gold-deep hover:underline"
                          >
                            Detay
                          </Link>
                        )}
                        <button
                          onClick={() => handleRemove(c.id)}
                          className="font-medium text-red-700 hover:underline"
                        >
                          Kaldır
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

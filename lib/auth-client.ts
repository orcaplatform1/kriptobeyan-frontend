"use client";

export type { Plan } from "./api";
import type { Plan } from "./api";

const ACCESS_TOKEN_KEY = "kb_access_token";
const REFRESH_TOKEN_KEY = "kb_refresh_token";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface TwoFactorRequired {
  twoFactorRequired: true;
}

export function saveTokens(tokens: TokenPair) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

// PLAN_REQUIRED gibi yapisal hatalarda backend'in dondurdugu ekstra alanlar
// (used/limit/recommendedPlanId) - "kendine uygun plana yonlendir" akisi
// icin (bkz. ApiError.data).
export interface PlanRequiredErrorData {
  error: "PLAN_REQUIRED";
  message: string;
  used: number;
  limit: number | null;
  recommendedPlanId: string | null;
  recommendedPlanName: string | null;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function parseErrorBody(res: Response): Promise<{ message: string; data: unknown }> {
  if (res.status === 429) {
    return { message: "Çok fazla deneme yaptın, biraz sonra tekrar dene.", data: undefined };
  }
  try {
    const body = await res.json();
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : typeof body.message === "string"
        ? body.message
        : "Bir şeyler ters gitti, lütfen tekrar dene.";
    return { message, data: body };
  } catch {
    // yanit JSON degilse genel mesaja dus
    return { message: "Bir şeyler ters gitti, lütfen tekrar dene.", data: undefined };
  }
}

async function parseErrorMessage(res: Response): Promise<string> {
  return (await parseErrorBody(res)).message;
}

// Nest'te void donen POST uc noktalari (ör. /auth/phone/verify) bos govdeli
// 201 dondurur, sadece 204 degil — res.json() bos govdede SyntaxError
// firlatiyordu ve basarili istekler bile "basarisiz" gibi gorunuyordu.
async function parseJsonBody<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

async function apiPost<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const { message, data: errData } = await parseErrorBody(res);
    throw new ApiError(message, res.status, errData);
  }
  return parseJsonBody<T>(res);
}

export type UserRole = "INDIVIDUAL" | "ACCOUNTANT";

export async function registerAccount(data: {
  email: string;
  username: string;
  password: string;
  fullName?: string;
  phone: string;
  phoneCountryCode: string;
  role?: UserRole;
}) {
  return apiPost<{ id: string; email: string }>("/auth/register", data);
}

export type LoginMethod = "username" | "email" | "phone";

export async function login(
  identifier: string,
  method: LoginMethod,
  password: string,
  totpCode?: string,
) {
  return apiPost<TokenPair | TwoFactorRequired>("/auth/login", {
    identifier,
    method,
    password,
    totpCode,
  });
}

export async function verifyEmail(token: string) {
  return apiPost<void>("/auth/verify-email", { token });
}

export async function resendVerification(email: string) {
  return apiPost<void>("/auth/resend-verification", { email });
}

export async function verifyPhoneCode(code: string) {
  return authRequest<void>("POST", "/auth/phone/verify", { code });
}

export async function resendPhoneCode() {
  return authRequest<void>("POST", "/auth/phone/resend-code");
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  return authRequest<void>("POST", "/auth/change-password", {
    currentPassword,
    newPassword,
  });
}

export async function requestPasswordReset(email: string) {
  return apiPost<void>("/auth/request-password-reset", { email });
}

export async function resetPassword(token: string, newPassword: string) {
  return apiPost<void>("/auth/reset-password", { token, newPassword });
}

export async function logout() {
  const refreshToken = getRefreshToken();
  clearTokens();
  if (refreshToken) {
    try {
      await apiPost("/auth/logout", { refreshToken });
    } catch {
      // cikis en kotu ihtimalle sadece lokal token'lari temizler, backend'e
      // ulasamasa bile kullanici tarayicida cikis yapmis olur
    }
  }
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export function decodeAccessToken(token: string): AccessTokenPayload | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function emailFromAccessToken(token: string): string | null {
  return decodeAccessToken(token)?.email ?? null;
}

export function roleFromAccessToken(token: string): UserRole | null {
  return decodeAccessToken(token)?.role ?? null;
}

export function postLoginRedirectPath(
  role: UserRole | null,
  explicitRedirect?: string | null,
): string {
  // Sadece site-ici gorece yollara izin ver — disariya acik yonlendirme
  // (open redirect) olmasin.
  if (explicitRedirect && explicitRedirect.startsWith("/")) {
    return explicitRedirect;
  }
  return role === "ACCOUNTANT" ? "/musavir-paneli" : "/panel";
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const tokens = await apiPost<TokenPair>("/auth/refresh", { refreshToken });
    saveTokens(tokens);
    return true;
  } catch {
    return false;
  }
}

// Ayni anda birden fazla dashboard cagrisi 401 alirsa hepsi tek bir
// refresh'i paylassin, her biri kendi refresh isteğini atmasin.
let pendingRefresh: Promise<boolean> | null = null;

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

function doAuthFetch(method: HttpMethod, path: string, token: string, body?: unknown) {
  return fetch(`/api${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

async function authRequest<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
): Promise<T> {
  let token = getAccessToken();
  if (!token) throw new ApiError("Oturum bulunamadı, tekrar giriş yap.", 401);

  let res = await doAuthFetch(method, path, token, body);

  if (res.status === 401) {
    if (!pendingRefresh) {
      pendingRefresh = refreshAccessToken().finally(() => {
        pendingRefresh = null;
      });
    }
    const refreshed = await pendingRefresh;
    if (!refreshed) {
      clearTokens();
      throw new ApiError("Oturum süresi doldu, tekrar giriş yap.", 401);
    }
    token = getAccessToken()!;
    res = await doAuthFetch(method, path, token, body);
  }

  if (!res.ok) {
    const { message, data } = await parseErrorBody(res);
    throw new ApiError(message, res.status, data);
  }
  return parseJsonBody<T>(res);
}

async function authGet<T>(path: string): Promise<T> {
  return authRequest<T>("GET", path);
}

export interface DashboardOverview {
  taxYear: number;
  isDraft: boolean;
  totalRealizedGainTRY: number;
  totalRealizedLossTRY: number;
  netCapitalGainTRY: number;
  occasionalIncomeTRY: number;
  estimatedTaxableAmountTRY: number;
  capitalGainsExemption: {
    used: number;
    total: number | null;
    usedPercent: number;
  };
  occasionalIncomeExemption: {
    used: number;
    total: number | null;
    usedPercent: number;
  };
  calculatedAt: string | null;
}

export interface DashboardPosition {
  asset: string;
  quantity: number;
  costBasisTRY: number;
  currentValueTRY: number | null;
  unrealizedPnlTRY: number | null;
}

export interface DashboardSources {
  connections: { id: string; provider: string; label: string | null }[];
  wallets: { id: string; chain: string; label: string | null }[];
  csvImports: { id: string; exchangeName: string }[];
}

export interface MyProfile {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export async function getMyProfile() {
  return authRequest<MyProfile>("GET", "/user/me");
}

export async function getDashboardOverview(taxYear: number) {
  return authGet<DashboardOverview>(`/dashboard/overview?taxYear=${taxYear}`);
}

export async function getDashboardPositions() {
  return authGet<DashboardPosition[]>("/dashboard/positions");
}

export async function getDashboardSources() {
  return authGet<DashboardSources>("/dashboard/sources");
}

// --- Yapay Zeka Kontrolörü (rapor anomali kontrolü) ---

export interface AiAuditFinding {
  type: string;
  description: string;
  createdAt: string;
}

export interface AiAuditOpinion {
  severity: "info" | "warning" | "critical";
  summary: string;
  recommendations: string[];
}

export interface AiAuditResult {
  status: "clean" | "issues";
  findings: AiAuditFinding[];
  ai: AiAuditOpinion | null;
  aiConfigured: boolean;
}

export async function getAiAudit(taxYear: number) {
  return authGet<AiAuditResult>(`/ai-audit/${taxYear}`);
}

// --- Vergi hesaplama + rapor indirme ---

export async function runTaxCalculation(taxYear: number) {
  return authRequest<unknown>("POST", `/tax-calculation/${taxYear}/calculate`);
}

export type ReportFormat = "PDF" | "EXCEL";

export interface GeneratedReport {
  id: string;
  taxYear: number;
  format: ReportFormat;
  createdAt: string;
}

export async function listMyReports() {
  return authGet<GeneratedReport[]>("/reports");
}

export async function generateReport(taxYear: number, format: ReportFormat) {
  return authRequest<GeneratedReport>(
    "POST",
    `/reports/${taxYear}/generate?format=${format}`,
  );
}

// Rapor dosyasi Authorization header'i gerektiriyor, bu yuzden duz <a href>
// calismiyor — blob olarak cekip tarayiciya indirtiyoruz (bkz.
// openPaymentReceipt ile ayni desen, tek fark burda "indir" — yeni sekmede
// acmak yerine dosya olarak kaydediliyor).
export async function downloadReport(report: GeneratedReport) {
  const token = getAccessToken();
  if (!token) throw new ApiError("Oturum bulunamadı, tekrar giriş yap.", 401);
  const res = await fetch(`/api/reports/${report.id}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new ApiError("Rapor indirilemedi", res.status);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const ext = report.format === "PDF" ? "pdf" : "xlsx";
  const a = document.createElement("a");
  a.href = url;
  a.download = `kriptobeyan-${report.taxYear}.${ext}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

// --- Mali müşavir paneli ---

export type AccountantClientStatus = "PENDING" | "ACTIVE" | "REMOVED";

export interface AccountantClientRow {
  id: string;
  accountantUserId: string;
  clientUserId: string | null;
  inviteEmail: string;
  status: AccountantClientStatus;
  invitedAt: string;
  acceptedAt: string | null;
  removedAt: string | null;
  client: {
    id: string;
    email: string;
    fullName: string | null;
    activeTaxYear: number;
  } | null;
  hasCompletedReport: boolean;
  unresolvedFlagCount: number;
}

export async function getAccountantOverview() {
  return authRequest<AccountantClientRow[]>(
    "GET",
    "/accountant/clients/overview",
  );
}

export async function inviteAccountantClient(email: string) {
  return authRequest<{ id: string; email: string; status: string }>(
    "POST",
    "/accountant/clients/invite",
    { email },
  );
}

export async function removeAccountantClient(accountantClientId: string) {
  return authRequest<AccountantClientRow>(
    "DELETE",
    `/accountant/clients/${accountantClientId}`,
  );
}

export interface AccountantClientSummary {
  client: {
    id: string;
    email: string;
    fullName: string | null;
    activeTaxYear: number;
    taxpayerType: string;
  } | null;
  summaries: {
    taxYear: number;
    totalRealizedGainTRY: string;
    totalRealizedLossTRY: string;
    netCapitalGainTRY: string;
    occasionalIncomeTRY: string;
    estimatedTaxableAmountTRY: string;
    isDraft: boolean;
    calculatedAt: string;
  }[];
  unresolvedFlags: {
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }[];
  // Sadece metadata (yil/format/tarih) - dosyanin kendisi degil, bkz.
  // AccountantService.getClientSummary yorumu.
  reports: { id: string; taxYear: number; format: "PDF" | "EXCEL"; createdAt: string }[];
}

export async function getAccountantClientSummary(clientUserId: string) {
  return authRequest<AccountantClientSummary>(
    "GET",
    `/accountant/clients/${clientUserId}/summary`,
  );
}

export async function acceptAccountantInvite(token: string) {
  return authRequest<unknown>("POST", "/accountant/invites/accept", {
    token,
  });
}

// --- Admin paneli ---

export interface AdminPlan {
  id: string;
  name: string;
  type: UserRole;
  priceTRY: string;
  transactionLimit: number | null;
  clientLimit: number | null;
  isActive: boolean;
}

export async function adminListPlans() {
  return authRequest<AdminPlan[]>("GET", "/admin/plans");
}

export async function adminUpdatePlan(
  id: string,
  data: Partial<{
    priceTRY: number;
    transactionLimit: number;
    clientLimit: number;
    isActive: boolean;
  }>,
) {
  return authRequest<AdminPlan>("PATCH", `/admin/plans/${id}`, data);
}

// --- Site içeriği (hero/footer metinleri) — ORCA'daki (traders.tr)
// /manage/site-content ile ayni fikir, kullanici istegi 2026-08-24. ---
export interface AdminSiteContent {
  id: string;
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroDescription: string;
  heroPrimaryCtaLabel: string;
  heroSecondaryCtaLabel: string;
  footerDescription: string;
  footerCopyrightText: string | null;
  footerSupportEmail: string | null;
  updatedAt: string;
}

export async function adminGetSiteContent() {
  return authRequest<AdminSiteContent>("GET", "/admin/site-content");
}

export async function adminUpdateSiteContent(
  data: Partial<
    Omit<AdminSiteContent, "id" | "updatedAt">
  >,
) {
  return authRequest<AdminSiteContent>("PATCH", "/admin/site-content", data);
}

// --- Kaynak bağlama: borsa hesapları ---

export type ExchangeProvider =
  | "BINANCE"
  | "BINANCE_TR"
  | "BTCTURK"
  | "PARIBU"
  | "BITEXEN"
  | "ICRYPEX"
  | "BYBIT"
  | "BYBIT_TR"
  | "OKX"
  | "OKX_TR"
  | "COINBASE"
  | "KRAKEN"
  | "KUCOIN"
  | "GATEIO"
  | "BITGET"
  | "HTX"
  | "MEXC"
  | "CRYPTOCOM";

export const EXCHANGE_PROVIDER_LABELS: Record<ExchangeProvider, string> = {
  BINANCE: "Binance",
  BINANCE_TR: "Binance TR",
  BTCTURK: "BTCTurk",
  PARIBU: "Paribu",
  BITEXEN: "Bitexen",
  ICRYPEX: "ICRYPEX",
  BYBIT: "Bybit",
  BYBIT_TR: "Bybit TR",
  OKX: "OKX",
  OKX_TR: "OKX TR",
  COINBASE: "Coinbase",
  KRAKEN: "Kraken",
  KUCOIN: "KuCoin",
  GATEIO: "Gate.io",
  BITGET: "Bitget",
  HTX: "HTX",
  MEXC: "MEXC",
  CRYPTOCOM: "Crypto.com",
};

export interface ExchangeConnection {
  id: string;
  provider: ExchangeProvider;
  label: string;
  apiKeyMasked: string;
  confirmedReadOnly: boolean;
  verifiedPermissionLevel: string;
  verifiedAt: string | null;
  syncStatus: string;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
  createdAt: string;
}

export async function listExchangeConnections() {
  return authRequest<ExchangeConnection[]>("GET", "/exchange-connections");
}

export async function createExchangeConnection(data: {
  provider: ExchangeProvider;
  label: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  confirmedReadOnly: boolean;
}) {
  return authRequest<ExchangeConnection>(
    "POST",
    "/exchange-connections",
    data,
  );
}

export async function verifyExchangeConnection(id: string) {
  return authRequest<ExchangeConnection>(
    "POST",
    `/exchange-connections/${id}/verify-permission`,
  );
}

export async function syncExchangeConnection(id: string) {
  return authRequest<ExchangeConnection>(
    "POST",
    `/exchange-connections/${id}/sync`,
  );
}

export async function removeExchangeConnection(id: string) {
  return authRequest<void>("DELETE", `/exchange-connections/${id}`);
}

// --- Kaynak bağlama: cüzdan adresleri ---

export type WalletChain = "ETHEREUM" | "BSC" | "BITCOIN";

export const WALLET_CHAIN_LABELS: Record<WalletChain, string> = {
  ETHEREUM: "Ethereum",
  BSC: "BNB Smart Chain",
  BITCOIN: "Bitcoin",
};

export interface WalletAddress {
  id: string;
  chain: WalletChain;
  address: string;
  label: string | null;
  syncStatus: string;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
  createdAt: string;
}

export async function listWalletAddresses() {
  return authRequest<WalletAddress[]>("GET", "/wallet-addresses");
}

export async function addWalletAddress(data: {
  chain: WalletChain;
  address: string;
  label?: string;
}) {
  return authRequest<WalletAddress>("POST", "/wallet-addresses", data);
}

export async function syncWalletAddress(id: string) {
  return authRequest<WalletAddress>("POST", `/wallet-addresses/${id}/sync`);
}

export async function removeWalletAddress(id: string) {
  return authRequest<void>("DELETE", `/wallet-addresses/${id}`);
}

// --- Çok parçalı (multipart) yükleme yardımcısı — CSV içe aktarım ve
// ödeme dekontu/işlem kanıtı için ortak. authRequest'teki refresh-on-401
// desenini FormData gövdesiyle tekrar eder. ---

async function authUpload<T>(path: string, form: FormData): Promise<T> {
  let token = getAccessToken();
  if (!token) throw new ApiError("Oturum bulunamadı, tekrar giriş yap.", 401);

  const doUpload = (t: string) =>
    fetch(`/api${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${t}` },
      body: form,
    });

  let res = await doUpload(token);

  if (res.status === 401) {
    if (!pendingRefresh) {
      pendingRefresh = refreshAccessToken().finally(() => {
        pendingRefresh = null;
      });
    }
    const refreshed = await pendingRefresh;
    if (!refreshed) {
      clearTokens();
      throw new ApiError("Oturum süresi doldu, tekrar giriş yap.", 401);
    }
    token = getAccessToken()!;
    res = await doUpload(token);
  }

  if (!res.ok) {
    throw new ApiError(await parseErrorMessage(res), res.status);
  }
  return res.json();
}

export async function importCsv(exchangeName: string, file: File) {
  const form = new FormData();
  form.append("exchangeName", exchangeName);
  form.append("file", file);
  return authUpload<{ id: string; exchangeName: string }>(
    "/csv-imports",
    form,
  );
}

// --- Abonelik / ödeme ---

// Sunucu bileşenlerinde lib/api.ts'teki getPlans kullanılır (revalidate
// cache'li); bu, panel gibi client bileşenlerinden giriş yapmış kullanıcının
// kendi token'ıyla planları çekmesi için (aynı Plan şekli).
export async function getPlansAuthed(type?: UserRole) {
  return authRequest<Plan[]>(
    "GET",
    `/subscription/plans${type ? `?type=${type}` : ""}`,
  );
}

export interface UsageSummary {
  planName: string | null;
  endDate: string | null;
  activePlan: Plan | null;
  transactions?: { used: number; limit: number | null };
  clients?: { used: number; limit: number | null };
}

export async function getMyUsage() {
  return authRequest<UsageSummary>("GET", "/subscription/me");
}

export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "CRYPTO";
export type CryptoProvider = "BINANCE" | "BYBIT" | "OKX";
export type CryptoAsset = "BTC" | "ETH" | "USDT";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REJECTED";

export const CRYPTO_PROVIDER_LABELS: Record<CryptoProvider, string> = {
  BINANCE: "Binance Pay",
  BYBIT: "Bybit Pay",
  OKX: "OKX",
};

export interface Payment {
  id: string;
  planId: string;
  plan: Plan;
  amount: string;
  currency: string;
  method: PaymentMethod;
  cryptoProvider: CryptoProvider | null;
  cryptoAsset: CryptoAsset | null;
  cryptoAmountLocked: string | null;
  cryptoRateTRY: string | null;
  receiptUrl: string | null;
  status: PaymentStatus;
  isUpgrade: boolean;
  createdAt: string;
}

export async function uploadPaymentReceipt(file: File) {
  const form = new FormData();
  form.append("file", file);
  return authUpload<{ key: string }>("/subscription/payments/receipt", form);
}

// Odeme olusturulduktan SONRA (kripto akisinda: kilitli tutar/adres
// gorulup para gonderildikten sonra) kanit eklemek icin.
export async function attachPaymentReceipt(paymentId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  return authUpload<Payment>(
    `/subscription/payments/${paymentId}/receipt`,
    form,
  );
}

export async function createPayment(data: {
  planId: string;
  method: PaymentMethod;
  cryptoProvider?: CryptoProvider;
  cryptoAsset?: CryptoAsset;
  receiptUrl?: string;
  couponCode?: string;
}) {
  return authRequest<Payment & { cryptoWalletAddress: string | null }>(
    "POST",
    "/subscription/payments",
    data,
  );
}

export async function listMyPayments() {
  return authRequest<Payment[]>("GET", "/subscription/payments");
}

export function paymentReceiptUrl(paymentId: string) {
  return `/api/subscription/payments/${paymentId}/receipt`;
}

// Dekont/kanıt görüntüleme — endpoint auth gerektirdiği için düz <a href>
// çalışmaz (Authorization header taşımaz), bu yüzden blob olarak çekip
// geçici bir object URL açıyoruz.
export async function openPaymentReceipt(paymentId: string) {
  const token = getAccessToken();
  if (!token) throw new ApiError("Oturum bulunamadı, tekrar giriş yap.", 401);
  const res = await fetch(paymentReceiptUrl(paymentId), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new ApiError("Dekont açılamadı", res.status);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

// --- Admin: ödeme onayı ---

export interface AdminPayment extends Payment {
  user: { id: string; email: string; role: UserRole };
}

export interface AdminPaymentList {
  data: AdminPayment[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function adminListPayments(status?: PaymentStatus, page = 1) {
  const qs = new URLSearchParams({ page: String(page) });
  if (status) qs.set("status", status);
  return authRequest<AdminPaymentList>(
    "GET",
    `/admin/payments?${qs.toString()}`,
  );
}

export interface SalesStatsRow {
  period: string;
  count: number;
  revenue: number;
  upgradeCount: number;
  upgradeRevenue: number;
}

export interface SalesStats {
  daily: SalesStatsRow[];
  monthly: SalesStatsRow[];
  yearly: SalesStatsRow[];
}

export async function adminGetSalesStats() {
  return authRequest<SalesStats>("GET", "/admin/payments/stats");
}

export async function adminApprovePayment(id: string) {
  return authRequest<Payment>(
    "POST",
    `/subscription/payments/${id}/mark-completed`,
  );
}

export async function adminRejectPayment(id: string) {
  return authRequest<Payment>("POST", `/subscription/payments/${id}/reject`);
}

// --- Admin: kullanıcı yönetimi ---

export interface AdminUserRow {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  phone: string | null;
  phoneCountryCode: string | null;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  lastSeenAt: string | null;
  lockedUntil: string | null;
  failedLoginCount: number;
  twoFactorEnabled: boolean;
  staffRecord: { id: string; role: string; addedAt: string } | null;
}

export interface AdminUserDetail extends AdminUserRow {
  _count: {
    exchangeConnections: number;
    walletAddresses: number;
    csvImports: number;
    payments: number;
  };
  activeSubscription: {
    id: string;
    startDate: string;
    endDate: string;
    plan: Plan;
  } | null;
  reports: { id: string; taxYear: number; format: "PDF" | "EXCEL"; createdAt: string }[];
  // SADECE ADMIN gorur (kullanici istegi 2026-08-25) - musavir/kullanicinin
  // kendi profilinde bu alan hic gelmez (backend zaten dondurmuyor).
  invitedByAccountant: { username: string } | null;
}

export interface AdminUserList {
  data: AdminUserRow[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function adminListUsers(opts: {
  role?: UserRole;
  staffOnly?: boolean;
  search?: string;
  page?: number;
} = {}) {
  const qs = new URLSearchParams();
  if (opts.role) qs.set("role", opts.role);
  if (opts.staffOnly) qs.set("staffOnly", "true");
  if (opts.search) qs.set("search", opts.search);
  qs.set("page", String(opts.page ?? 1));
  return authRequest<AdminUserList>("GET", `/admin/users?${qs.toString()}`);
}

export async function adminGetUser(id: string) {
  return authRequest<AdminUserDetail>("GET", `/admin/users/${id}`);
}

export async function adminUpdateUser(
  id: string,
  data: Partial<{
    email: string;
    username: string;
    fullName: string;
    phone: string;
    role: UserRole;
    emailVerified: boolean;
    phoneVerified: boolean;
    unlock: boolean;
  }>,
) {
  return authRequest<AdminUserRow>("PATCH", `/admin/users/${id}`, data);
}

export async function adminGrantStaff(id: string) {
  return authRequest<AdminUserDetail>("POST", `/admin/users/${id}/staff`);
}

export async function adminRevokeStaff(id: string) {
  return authRequest<AdminUserDetail>("DELETE", `/admin/users/${id}/staff`);
}

export async function adminDeleteUser(id: string) {
  return authRequest<void>("DELETE", `/admin/users/${id}`);
}

// --- Admin: rapor indiren kullanıcılar (kullanıcı adı + tarih) ---

export interface AdminReportDownloadRow {
  id: string;
  taxYear: number;
  format: "PDF" | "EXCEL";
  createdAt: string;
  user: { id: string; username: string; email: string; fullName: string | null };
}

export async function adminListReportDownloads() {
  return authRequest<AdminReportDownloadRow[]>("GET", "/admin/reports");
}

// --- Admin: analitik (site trafiği + aktif kullanıcılar) ---

export interface VisitorStats {
  today: number;
  week: number;
  month: number;
}

export interface RoleCounts {
  individual: number;
  accountant: number;
  staff: number;
  total: number;
}

export interface ActiveUserRow {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  role: UserRole;
  lastSeenAt: string;
  staffRecord: { id: string } | null;
}

export interface ActiveUsers {
  admin: ActiveUserRow[];
  accountant: ActiveUserRow[];
  individual: ActiveUserRow[];
}

export async function adminGetVisitorStats() {
  return authRequest<VisitorStats>("GET", "/admin/analytics/visitors");
}

export async function adminGetRoleCounts() {
  return authRequest<RoleCounts>("GET", "/admin/analytics/roles");
}

export async function adminGetActiveUsers() {
  return authRequest<ActiveUsers>("GET", "/admin/analytics/active-users");
}

// Girissiz — herkes tetikleyebilir, kisisel veri icermez (bkz. backend
// AnalyticsService.trackVisit). auth gerektirmedigi icin authRequest degil
// duz fetch kullanilir.
export async function trackVisit(visitorId: string) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    });
  } catch {
    // sessiz basarisizlik — analitik kritik yol degil
  }
}

// --- Admin: duyurular ---

export async function adminSendAnnouncement(message: string, role?: UserRole) {
  return authRequest<{ sent: number }>("POST", "/admin/announcements", {
    message,
    role,
  });
}

// --- Bildirimler ---

export type NotificationType =
  | "DECLARATION_REMINDER"
  | "DATA_ISSUE"
  | "ACCOUNTANT_CLIENT_ACTIVITY"
  | "ANNOUNCEMENT"
  | "SUPPORT_REPLY";

export interface NotificationRow {
  id: string;
  type: NotificationType;
  message: string;
  sentAt: string;
  readAt: string | null;
}

export async function listMyNotifications() {
  return authRequest<NotificationRow[]>("GET", "/notifications");
}

export async function markNotificationRead(id: string) {
  return authRequest<void>("PATCH", `/notifications/${id}/read`);
}

// --- Destek merkezi ---

export type SupportTicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type SupportTicketCategory =
  | "PAYMENT"
  | "TECHNICAL"
  | "ACCOUNT"
  | "EMAIL_PHONE_CHANGE"
  | "OTHER";

export interface SupportMessageRow {
  id: string;
  ticketId: string;
  senderUserId: string;
  isFromStaff: boolean;
  body: string;
  createdAt: string;
}

export interface SupportTicketRow {
  id: string;
  userId: string;
  subject: string;
  category: SupportTicketCategory;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
  messages: SupportMessageRow[];
  user?: { id: string; email: string; username: string };
}

export async function createSupportTicket(
  category: SupportTicketCategory,
  subject: string,
  body: string,
) {
  return authRequest<SupportTicketRow>("POST", "/support/tickets", {
    category,
    subject,
    body,
  });
}

export async function listMySupportTickets() {
  return authRequest<SupportTicketRow[]>("GET", "/support/tickets");
}

export async function addSupportMessage(ticketId: string, body: string) {
  return authRequest<SupportTicketRow>(
    "POST",
    `/support/tickets/${ticketId}/messages`,
    { body },
  );
}

export async function adminListSupportTickets(status?: SupportTicketStatus) {
  return authRequest<SupportTicketRow[]>(
    "GET",
    `/admin/support/tickets${status ? `?status=${status}` : ""}`,
  );
}

export async function adminReplySupportTicket(ticketId: string, body: string) {
  return authRequest<SupportTicketRow>(
    "POST",
    `/admin/support/tickets/${ticketId}/messages`,
    { body },
  );
}

export async function adminUpdateSupportTicketStatus(
  ticketId: string,
  status: SupportTicketStatus,
) {
  return authRequest<SupportTicketRow>(
    "POST",
    `/admin/support/tickets/${ticketId}/status`,
    { status },
  );
}

// --- Mali müşavir belge doğrulama ---

export interface AccountantVerificationStatus {
  hasLicenseDoc: boolean;
  hasTaxPlateDoc: boolean;
  verified: boolean;
  verifiedAt: string | null;
}

export async function getAccountantVerificationStatus() {
  return authRequest<AccountantVerificationStatus>(
    "GET",
    "/accountant/verification/status",
  );
}

export async function uploadAccountantVerificationDocs(
  license: File | null,
  taxPlate: File | null,
) {
  const form = new FormData();
  if (license) form.append("license", license);
  if (taxPlate) form.append("taxPlate", taxPlate);
  return authUpload<{
    accountantLicenseDocUrl: string | null;
    accountantTaxPlateDocUrl: string | null;
    accountantVerified: boolean;
  }>("/accountant/verification/documents", form);
}

export interface AccountantVerificationRow {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  accountantLicenseDocUrl: string | null;
  accountantTaxPlateDocUrl: string | null;
  createdAt: string;
}

export async function adminListAccountantVerifications() {
  return authRequest<AccountantVerificationRow[]>(
    "GET",
    "/admin/accountant-verifications",
  );
}

export async function adminApproveAccountantVerification(userId: string) {
  return authRequest<void>(
    "POST",
    `/admin/accountant-verifications/${userId}/approve`,
  );
}

export async function adminRejectAccountantVerification(userId: string) {
  return authRequest<void>(
    "POST",
    `/admin/accountant-verifications/${userId}/reject`,
  );
}

export async function openAccountantVerificationDoc(
  userId: string,
  kind: "license" | "taxPlate",
  isAdmin: boolean,
) {
  const token = getAccessToken();
  if (!token) throw new ApiError("Oturum bulunamadı, tekrar giriş yap.", 401);
  const path = isAdmin
    ? `/api/admin/accountant-verifications/${userId}/documents/${kind}`
    : `/api/accountant/verification/documents/${kind}`;
  const res = await fetch(path, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new ApiError("Belge açılamadı", res.status);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

// --- Mali müşavir iş ortaklığı: kupon kodu ---

export interface MyCoupon {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  createdAt: string;
  redemptionCount: number;
  totalDiscountGivenTRY: string;
}

export async function getMyCoupon() {
  return authRequest<MyCoupon | null>("GET", "/accountant/coupon");
}

export async function createMyCoupon() {
  return authRequest<MyCoupon>("POST", "/accountant/coupon");
}

export interface AdminCouponRow extends MyCoupon {
  accountant: { id: string; email: string; username: string; fullName: string | null };
}

export async function adminListCoupons() {
  return authRequest<AdminCouponRow[]>("GET", "/admin/coupons");
}

export async function adminSetCouponActive(id: string, isActive: boolean) {
  return authRequest<void>("POST", `/admin/coupons/${id}/active`, { isActive });
}

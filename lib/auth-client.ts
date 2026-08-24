"use client";

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

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseErrorMessage(res: Response): Promise<string> {
  if (res.status === 429) {
    return "Çok fazla deneme yaptın, biraz sonra tekrar dene.";
  }
  try {
    const body = await res.json();
    if (Array.isArray(body.message)) return body.message.join(", ");
    if (typeof body.message === "string") return body.message;
  } catch {
    // yanit JSON degilse asagidaki genel mesaja dus
  }
  return "Bir şeyler ters gitti, lütfen tekrar dene.";
}

async function apiPost<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new ApiError(await parseErrorMessage(res), res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export type UserRole = "INDIVIDUAL" | "ACCOUNTANT";

export async function registerAccount(
  email: string,
  password: string,
  role?: UserRole,
) {
  return apiPost<{ id: string; email: string }>("/auth/register", {
    email,
    password,
    role,
  });
}

export async function login(
  email: string,
  password: string,
  totpCode?: string,
) {
  return apiPost<TokenPair | TwoFactorRequired>("/auth/login", {
    email,
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
    throw new ApiError(await parseErrorMessage(res), res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
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

export async function getDashboardOverview(taxYear: number) {
  return authGet<DashboardOverview>(`/dashboard/overview?taxYear=${taxYear}`);
}

export async function getDashboardPositions() {
  return authGet<DashboardPosition[]>("/dashboard/positions");
}

export async function getDashboardSources() {
  return authGet<DashboardSources>("/dashboard/sources");
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

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

export async function registerAccount(email: string, password: string) {
  return apiPost<{ id: string; email: string }>("/auth/register", {
    email,
    password,
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

export function emailFromAccessToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}

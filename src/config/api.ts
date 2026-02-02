import axios, { AxiosError, AxiosInstance } from "axios";
import { emitUnauthorized } from "../lib/authEvents";
import { getApiBaseUrl } from "./apiBase";

const TOKEN_KEY = "ella:token";
const REFRESH_TOKEN_KEY = "ella:refreshToken";

type RetriableRequestConfig = Parameters<AxiosInstance["request"]>[0] & {
  _retry?: boolean;
};

const refreshApi = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
  // Prefer HttpOnly cookie refresh; Authorization: Bearer <refresh> is used as fallback.
  withCredentials: true,
});

let refreshInFlight: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken =
      typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;

    const headers: Record<string, string> = {};
    if (refreshToken) {
      headers.Authorization = `Bearer ${refreshToken}`;
    }

    const res = await refreshApi.post("/auth/refresh", null, {
      headers: Object.keys(headers).length ? headers : undefined,
    });

    const data: any = res.data?.data ?? res.data;
    const newAccessToken: string | undefined = data?.token;
    const newRefreshToken: string | undefined = data?.refreshToken;

    if (!newAccessToken) {
      throw new Error("No access token returned from refresh");
    }

    try {
      localStorage.setItem(TOKEN_KEY, newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      }
    } catch {
      // ignore storage failures
    }

    return newAccessToken;
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

export const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
  // Keep cookies enabled so the backend can use HttpOnly refresh tokens.
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const isTimeout = error.code === "ECONNABORTED" || /timeout/i.test(String(error.message));
    if (isTimeout) {
      return Promise.reject(new Error("Requisição expirou"));
    }

    if (!error.response) {
      return Promise.reject(new Error("Sem conexão"));
    }

    const status = error.response.status;
    const data: any = error.response.data;
    const backendMessage =
      (typeof data === "object" && data && (data.message || data.error)) ||
      (typeof data === "string" ? data : "");

    if (status === 401) {
      const originalRequest = (error.config || {}) as RetriableRequestConfig;
      const url = String(originalRequest.url || "");

      // Never attempt refresh for auth endpoints.
      const isAuthEndpoint =
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/refresh") ||
        url.includes("/auth/logout");

      if (!isAuthEndpoint && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();
          originalRequest.headers = originalRequest.headers ?? {};
          (originalRequest.headers as Record<string, string>).Authorization =
            `Bearer ${newAccessToken}`;
          return api.request(originalRequest);
        } catch {
          // fall through to logout behavior
        }
      }

      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      } catch {
        // ignore
      }

      emitUnauthorized("401");
      return Promise.reject(new Error("Sessão expirada. Faça login novamente"));
    }

    if (status >= 500) {
      return Promise.reject(new Error("Erro no servidor, tente novamente"));
    }

    const msg = backendMessage || `Erro HTTP ${status}`;
    return Promise.reject(new Error(String(msg)));
  },
);

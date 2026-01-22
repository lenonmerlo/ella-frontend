import axios, { AxiosError, AxiosInstance } from "axios";
import { emitUnauthorized } from "../lib/authEvents";
import { getApiBaseUrl } from "./apiBase";

const TOKEN_KEY = "ella:token";

export const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
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
  (error: AxiosError<any>) => {
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
      try {
        localStorage.removeItem(TOKEN_KEY);
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

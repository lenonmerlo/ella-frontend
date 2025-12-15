/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

// Wrapper genérico pra falar com o backend
type ApiFetchOptions = RequestInit & {
  json?: unknown;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  // Anexa JWT se existir para manter endpoints protegidos funcionais
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ella:token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let body: BodyInit | undefined = options.body ?? undefined;

  if (options.json !== undefined) {
    body = JSON.stringify(options.json);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: options.credentials ?? "include",
    body,
  });

  const text = await res.text();
  let payload: any = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!res.ok) {
    const msg = (payload && (payload.message || payload.error)) || `Erro HTTP ${res.status}`;
    const err = new Error(msg);
    (err as any).status = res.status;
    (err as any).payload = payload;

    // Token expirado ou ausente: limpa client-side para forçar re-login
    if (res.status === 401 || res.status === 403) {
      try {
        localStorage.removeItem("ella:token");
      } catch (e) {
        // ignore
      }
    }
    throw err;
  }

  return payload as T;
}

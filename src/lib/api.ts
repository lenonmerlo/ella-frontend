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

  let body: BodyInit | undefined = options.body ?? undefined;

  if (options.json !== undefined) {
    body = JSON.stringify(options.json);
  }

  const res = await fetch(url, {
    ...options,
    headers,
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
    throw err;
  }

  // se sua API tiver envelope { success, data, message }, aqui você pode adaptar:
  return payload as T;
}

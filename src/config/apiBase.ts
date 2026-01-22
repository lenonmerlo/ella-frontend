type ViteEnv = {
  VITE_API_URL?: string;
  VITE_API_BASE_URL?: string;
};

function getEnv(): ViteEnv {
  return import.meta.env as unknown as ViteEnv;
}

export function getApiBaseUrl(): string {
  const env = getEnv();

  const rawApiUrl = (env.VITE_API_URL ?? "").trim();
  if (rawApiUrl) {
    return `${rawApiUrl.replace(/\/+$/, "")}/api`;
  }

  const base = (env.VITE_API_BASE_URL ?? "").trim();
  if (base) {
    return base.replace(/\/+$/, "");
  }

  // DEV fallback: local backend.
  if (import.meta.env.DEV) {
    return "http://localhost:8080/api";
  }

  // PROD fallback: assume same-origin /api (requires reverse proxy/rewrites).
  // This avoids shipping a production build that tries to talk to localhost.
  if (typeof window !== "undefined") {
    console.warn(
      "[ELLA] API base URL não configurada. Defina VITE_API_URL (ex: https://seu-backend) " +
        "ou VITE_API_BASE_URL (ex: https://seu-backend/api). Fallback atual: /api",
    );
  }
  return "/api";
}

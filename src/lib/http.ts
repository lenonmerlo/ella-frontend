import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para colocar o token automaticamente
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ella:token");
    const url = config.url || "";

    // Não anexa token em endpoints públicos (login / register POST)
    // A URL aqui será relativa, ex: "/auth/login" ou "/users"
    const method = (config.method || "get").toLowerCase();
    const isPublicEndpoint =
      (url === "/auth/login" && method === "post") ||
      (url === "/auth/refresh" && method === "post") ||
      (url === "/users" && method === "post");

    if (token && !isPublicEndpoint) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para tratar erros da API
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Erro na conexão com o servidor";

    const status = error?.response?.status;

    // interceptor de refresh token
    const originalRequest = error?.config;
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      // queue/refresh mechanism
      return handleRefresh()
        .then((newToken) => {
          if (!originalRequest.headers) originalRequest.headers = {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return http(originalRequest);
        })
        .catch((e) => {
          // se não for possível renovar, redireciona
          localStorage.removeItem("ella:token");
          if (typeof window !== "undefined") window.location.href = "/login";
          return Promise.reject(e);
        });
    }

    // Se houver indício de token expirado ou 401 fora do fluxo de refresh, limpar token e redirecionar
    if (status === 401 || /expired/i.test(String(msg))) {
      try {
        localStorage.removeItem("ella:token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      } catch (e) {
        // ignore
      }
    }

    return Promise.reject(new Error(String(msg)));
  },
);

// refresh handling
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token?: string) => void;
  reject: (err?: any) => void;
}> = [];

async function doRefresh(): Promise<string> {
  // usa axios direto para evitar loops com este interceptor
  const refreshUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`;
  const resp = await axios.post(refreshUrl, null, { withCredentials: true });
  const newToken = resp?.data?.data?.token;
  if (newToken) {
    localStorage.setItem("ella:token", newToken);
    return newToken;
  }
  throw new Error("Falha ao renovar token");
}

function handleRefresh(): Promise<string> {
  return new Promise((resolve, reject) => {
    refreshQueue.push({ resolve, reject });
    if (!isRefreshing) {
      isRefreshing = true;
      doRefresh()
        .then((token) => {
          refreshQueue.forEach((p) => p.resolve(token));
          refreshQueue = [];
        })
        .catch((err) => {
          refreshQueue.forEach((p) => p.reject(err));
          refreshQueue = [];
        })
        .finally(() => {
          isRefreshing = false;
        });
    }
  });
}

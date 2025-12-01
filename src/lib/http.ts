import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para colocar o token automaticamente
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ella:token");
    const url = config.url || "";

    // Não anexa token em endpoints públicos (login / register)
    // A URL aqui será relativa, ex: "/auth/login" ou "/users"
    const isPublicEndpoint = url.startsWith("/auth") || url.startsWith("/users");

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

    // Se houver indício de token expirado ou 401, limpar token e redirecionar
    const status = error?.response?.status;
    if (status === 401 || /expired/i.test(String(msg))) {
      try {
        localStorage.removeItem("ella:token");
        if (typeof window !== "undefined") {
          // força retorno para a tela de login
          window.location.href = "/login";
        }
      } catch (e) {
        // ignore
      }
    }

    return Promise.reject(new Error(String(msg)));
  },
);

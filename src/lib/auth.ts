/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "./http";

const TOKEN_KEY = "ella:token";

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string, password: string) {
  const res = await http.post<{ data: LoginResponse }>("/auth/login", {
    email,
    password,
  });

  if (res.data.data.token) {
    setToken(res.data.data.token);
  }

  return res.data.data;
}

export async function register(payload: RegisterPayload) {
  const name = `${payload.firstName} ${payload.lastName}`.trim();
  const res = await http.post("/auth/register", null, {
    params: { name, email: payload.email, password: payload.password },
  });
  return res.data;
}

// Decodifica o payload de um JWT (browser only)
export function parseJwt(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    // atob está disponível no browser
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

// Busca o usuário atual usando o id presente no token JWT
export async function fetchCurrentUser(): Promise<any | null> {
  const token = getToken();
  if (!token) return null;

  const payload = parseJwt(token);
  const id = payload?.id || payload?.sub;
  if (!id) return null;

  const res = await http.get(`/users/${id}`);
  // resposta do backend vem embrulhada em { success, data, ... }
  return res.data?.data ?? null;
}

export async function fetchWithAuth<T = any>(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: any,
) {
  const res = await http.request<T>({
    url: path,
    method,
    data: body,
  });
  return res.data;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "./http";

const TOKEN_KEY = "ella:token";

export interface LoginResponse {
  token: string;
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
  const res = await http.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  if (res.data.token) {
    setToken(res.data.token);
  }

  return res.data;
}

export async function register(payload: RegisterPayload) {
  const res = await http.post("/auth/register", payload);
  return res.data;
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

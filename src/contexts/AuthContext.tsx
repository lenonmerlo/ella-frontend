import React, { createContext, useContext, useEffect, useState } from "react";
import { clearToken, getToken } from "../lib/auth";
import { http } from "../lib/http";

export interface UserProfile {
  id: string;
  name?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  income?: number;
  language?: string;
  plan?: string;
  currency?: string;
  status?: string;
  email?: string;
  role?: string;

  // Avatar (data URL: data:<mime>;base64,<...>)
  avatarDataUrl?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  loadingProfile: boolean;
  loadProfile: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  async function loadProfile(): Promise<UserProfile | null> {
    const token = getToken();
    if (!token) return null;
    try {
      const res = await http.get<{ data: UserProfile }>("/auth/me");
      const data = res.data?.data ?? null;
      setUser(data);
      return data;
    } catch (e) {
      console.error("Erro ao carregar perfil:", e);
      setUser(null);
      return null;
    }
  }

  async function logout(): Promise<void> {
    try {
      await http.post("/auth/logout");
    } catch (e) {
      // ignore
    }
    clearToken();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  useEffect(() => {
    // Tenta carregar perfil se houver token
    (async () => {
      const token = getToken();
      if (!token) {
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);
      await loadProfile();
      setLoadingProfile(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loadingProfile, loadProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

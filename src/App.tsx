// src/App.tsx
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Logo } from "./components/Logo";
import { clearToken, fetchCurrentUser, getToken } from "./lib/auth";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import "./styles/globals.css";

function App() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const token = getToken();
      if (!token) {
        setUserName(null);
        return;
      }
      try {
        const user = await fetchCurrentUser();
        setUserName(user?.name ?? null);
      } catch (e) {
        setUserName(null);
      }
    }
    loadUser();
  }, []);

  function handleLogout() {
    clearToken();
    setUserName(null);
    navigate("/login");
  }
  return (
    <div className="bg-ella-background text-ella-text min-h-screen">
      {/* Header */}
      <header className="border-ella-muted border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo variant="horizontal" size="medium" />
          {userName ? (
            <div className="flex items-center gap-3">
              <span className="text-ella-navy text-sm">{userName}</span>
              <button
                onClick={handleLogout}
                className="border-ella-muted text-ella-subtile hover:border-ella-gold hover:text-ella-navy rounded-full border px-3 py-1 text-xs"
              >
                Sair
              </button>
            </div>
          ) : (
            <span className="text-ella-subtile text-xs">Sua parceira financeira inteligente</span>
          )}
        </div>
      </header>

      {/* Conteúdo */}
      <main className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;

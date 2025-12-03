// src/App.tsx
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Logo } from "./components/Logo";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import "./styles/globals.css";

function HeaderContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "E";

  return (
    <header className="border-ella-muted border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo variant="horizontal" size="medium" />
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-ella-gold flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white">
                {initials}
              </div>
              <div className="text-right">
                <div className="text-ella-navy text-sm">{user.name}</div>
                <div className="text-ella-subtile text-xs">{user.email}</div>
              </div>
            </div>
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
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="bg-ella-background text-ella-text min-h-screen">
        <HeaderContent />

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
    </AuthProvider>
  );
}

export default App;

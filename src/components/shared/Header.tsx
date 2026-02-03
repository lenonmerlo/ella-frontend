import { Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Logo } from "../Logo";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  function handleLogout() {
    void logout();
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
    <header className="border-ella-muted bg-ella-card border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo variant="horizontal" size="medium" inverted={theme === "dark"} />
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
              type="button"
              onClick={toggleTheme}
              className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition"
              aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
              title={theme === "dark" ? "Tema claro" : "Tema escuro"}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              <span className="hidden sm:inline">Tema</span>
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition"
            >
              Config
            </button>
            <button
              onClick={handleLogout}
              className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition"
              aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
              title={theme === "dark" ? "Tema claro" : "Tema escuro"}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              <span className="hidden sm:inline">Tema</span>
            </button>
            <button
              onClick={() => navigate("/auth/login")}
              className="text-ella-subtile hover:text-ella-navy text-sm font-medium"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate("/auth/register")}
              className="bg-ella-brand hover:bg-ella-brand/90 rounded-full px-4 py-2 text-sm font-medium text-white"
            >
              Criar conta
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

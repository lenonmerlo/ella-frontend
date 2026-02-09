import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Logo } from "../Logo";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = String(user?.role ?? "").toUpperCase() === "ADMIN";

  function handleLogout() {
    void logout();
  }

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo variant="horizontal" size="medium" inverted={theme === "dark"} />
        {user ? (
          <>
            {/* Desktop actions */}
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-3">
                <div className="bg-ella-gold flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white">
                  {initials}
                </div>
                <div className="text-right">
                  <div className="text-ella-navy max-w-[220px] truncate text-sm">{user.name}</div>
                  <div className="text-ella-subtile max-w-[220px] truncate text-xs">
                    {user.email}
                  </div>
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
                <span className="hidden md:inline">Tema</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/settings")}
                className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition"
              >
                Config
              </button>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition"
                >
                  Admin
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition"
              >
                Sair
              </button>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition"
                aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
                title={theme === "dark" ? "Tema claro" : "Tema escuro"}
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition"
                aria-label="Abrir menu"
                aria-expanded={mobileOpen}
              >
                <Menu size={16} />
              </button>
            </div>

            {mobileOpen ? (
              <div className="fixed inset-0 z-50 sm:hidden">
                <button
                  type="button"
                  className="absolute inset-0 bg-black/30"
                  aria-label="Fechar menu"
                  onClick={() => setMobileOpen(false)}
                />
                <div className="bg-ella-card border-ella-muted absolute top-0 right-0 h-full w-full max-w-xs border-l p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-ella-gold flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-ella-navy truncate text-sm font-medium">
                          {user.name}
                        </div>
                        <div className="text-ella-subtile truncate text-xs">{user.email}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy inline-flex items-center rounded-full border px-3 py-2 text-xs transition"
                      onClick={() => setMobileOpen(false)}
                      aria-label="Fechar"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/settings");
                        setMobileOpen(false);
                      }}
                      className="border-ella-muted text-ella-navy hover:bg-ella-background w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition"
                    >
                      Configurações
                    </button>
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/admin");
                          setMobileOpen(false);
                        }}
                        className="border-ella-muted text-ella-navy hover:bg-ella-background w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition"
                      >
                        Admin
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                      className="border-ella-muted text-ella-navy hover:bg-ella-background w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </>
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

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Logo } from "../Logo";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
              onClick={() => navigate("/settings")}
              className="border-ella-muted text-ella-subtile hover:border-ella-gold hover:text-ella-navy rounded-full border px-3 py-1 text-xs"
            >
              Config
            </button>
            <button
              onClick={handleLogout}
              className="border-ella-muted text-ella-subtile hover:border-ella-gold hover:text-ella-navy rounded-full border px-3 py-1 text-xs"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/auth/login")}
              className="text-ella-subtile hover:text-ella-navy text-sm font-medium"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate("/auth/register")}
              className="bg-ella-navy hover:bg-ella-navy/90 rounded-full px-4 py-2 text-sm font-medium text-white"
            >
              Criar conta
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

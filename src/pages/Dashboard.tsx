import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, clearToken } from "../lib/auth";
import { Logo } from "../components/Logo";

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div className="min-h-screen ella-gradient-bg">
      <header className="w-full border-b border-ella-muted bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo variant="horizontal" size="small" />
          <button
            onClick={handleLogout}
            className="rounded-full border border-ella-muted px-3 py-1 text-xs text-ella-subtile hover:border-ella-gold hover:text-ella-navy"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8">
        <h1 className="text-2xl font-semibold text-ella-navy">
          Bem-vinda à sua visão geral, ELLA ✨
        </h1>
        <p className="text-sm text-ella-subtile">
          Aqui depois vamos trazer seus cards de resumo, faturas, metas, etc.
        </p>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="ella-glass p-4">
            <h2 className="text-sm font-medium text-ella-navy">
              Saldo consolidado
            </h2>
            <p className="mt-2 text-2xl font-semibold text-ella-navy">
              R$ 0,00
            </p>
            <p className="mt-1 text-xs text-ella-subtile">
              Depois vamos puxar isso do backend.
            </p>
          </div>

          <div className="ella-glass p-4">
            <h2 className="text-sm font-medium text-ella-navy">
              Próximas faturas
            </h2>
            <p className="mt-2 text-sm text-ella-subtile">
              Em breve, listaremos aqui as faturas do mês.
            </p>
          </div>

          <div className="ella-glass p-4">
            <h2 className="text-sm font-medium text-ella-navy">
              Metas em andamento
            </h2>
            <p className="mt-2 text-sm text-ella-subtile">
              Metas vinculadas à sua IA financeira.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

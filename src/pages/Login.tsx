// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/shared/Footer";
import { useAuth } from "../contexts/AuthContext";
import { login as doLogin } from "../lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loadProfile } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await doLogin(email, password);
      // depois de logar, carregar perfil via contexto
      try {
        await loadProfile();
      } catch (er) {
        // ignore
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : "Erro ao autenticar";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ella-gradient-bg min-h-screen">
      <div className="flex min-h-screen flex-col">
        <div className="px-4 py-10">
          <div className="mx-auto grid max-w-5xl items-center gap-6 rounded-2xl bg-white/60 p-6 shadow-sm backdrop-blur md:grid-cols-[1.1fr,0.9fr]">
            {/* Lado esquerdo */}
            <section className="space-y-4">
              <p className="text-ella-subtile text-sm tracking-[0.3em] uppercase">
                Você chegou ao futuro das finanças
              </p>

              <h1 className="text-ella-navy text-3xl font-semibold md:text-4xl">
                Organize sua vida financeira com clareza e inteligência.
              </h1>

              <p className="text-ella-subtile max-w-xl text-sm md:text-base">
                A ELLA conecta suas faturas, extratos e metas em um só lugar – e ainda gera insights
                inteligentes.
              </p>

              <ul className="text-ella-subtile mt-4 space-y-2 text-sm">
                <li>• Visão unificada de contas pessoais e empresas</li>
                <li>• Metas guiadas pela IA com valores sugeridos</li>
                <li>• Alertas de gastos fora do seu padrão</li>
              </ul>
            </section>

            {/* Card de login */}
            <section className="border-ella-muted ella-glass rounded-2xl border bg-white/90 p-6 shadow-lg">
              <h2 className="text-ella-navy mb-1 text-lg font-medium">Acessar sua conta</h2>
              <p className="text-ella-subtile mb-6 text-xs">
                Digite suas credenciais para continuar com a ELLA.
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-ella-subtile text-xs font-medium uppercase">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                    className="border-ella-muted text-ella-text focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-1"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-ella-subtile text-xs font-medium uppercase">Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-ella-muted text-ella-text focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-1"
                  />
                </div>

                {error && <div className="text-sm text-red-500">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-ella-gold text-ella-navy w-full rounded-lg px-4 py-2 text-sm font-medium hover:brightness-110 disabled:opacity-60"
                >
                  {loading ? "Entrando..." : "Entrar na ELLA"}
                </button>

                <p className="text-ella-subtile pt-3 text-center text-xs">
                  Ainda não tem conta?{" "}
                  <Link
                    className="text-ella-navy hover:text-ella-gold font-medium"
                    to="/auth/register"
                  >
                    Criar acesso
                  </Link>
                </p>
                <p className="mt-2 text-sm">
                  <Link
                    className="text-ella-navy hover:text-ella-gold font-medium"
                    to="/auth/forgot-password"
                  >
                    Esqueci minha senha
                  </Link>
                </p>
              </form>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

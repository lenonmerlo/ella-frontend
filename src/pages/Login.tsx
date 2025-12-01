// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as doLogin } from "../lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();

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
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1.2fr,1fr] items-center">
      {/* Lado esquerdo */}
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-ella-subtile">
          bem-vinda ao futuro das finanças
        </p>

        <h1 className="text-3xl md:text-4xl font-semibold text-ella-navy">
          Organize sua vida financeira com clareza e inteligência.
        </h1>

        <p className="text-sm md:text-base text-ella-subtile max-w-xl">
          A ELLA conecta suas faturas, extratos e metas em um só lugar – e
          ainda gera insights inteligentes.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-ella-subtile">
          <li>• Visão unificada de contas pessoais e empresas</li>
          <li>• Metas guiadas pela IA com valores sugeridos</li>
          <li>• Alertas de gastos fora do seu padrão</li>
        </ul>
      </section>

      {/* Card de login */}
      <section className="rounded-2xl border border-ella-muted bg-white/90 p-6 shadow-lg ella-glass">
        <h2 className="text-lg font-medium text-ella-navy mb-1">
          Acessar sua conta
        </h2>
        <p className="text-xs text-ella-subtile mb-6">
          Digite suas credenciais para continuar com a ELLA.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase text-ella-subtile">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              className="w-full rounded-lg border border-ella-muted bg-white px-3 py-2 text-sm text-ella-text focus:border-ella-gold focus:ring-1 focus:ring-ella-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase text-ella-subtile">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-ella-muted bg-white px-3 py-2 text-sm text-ella-text focus:border-ella-gold focus:ring-1 focus:ring-ella-gold"
            />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-ella-gold px-4 py-2 text-sm font-medium text-ella-navy hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar na ELLA"}
          </button>

          <p className="pt-3 text-center text-xs text-ella-subtile">
            Ainda não tem conta?{" "}
            <a
              href="/register"
              className="text-ella-navy font-medium hover:text-ella-gold"
            >
              Criar acesso
            </a>
          </p>
        </form>
      </section>
    </div>
  );
}

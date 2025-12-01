import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../lib/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await register({ firstName, lastName, email, password });
      setSuccess("Conta criada! Redirecionando...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1.2fr,1fr] items-center p-6 min-h-screen">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-ella-subtile">
          comece com a ella
        </p>

        <h1 className="text-3xl md:text-4xl font-semibold text-ella-navy">
          Crie sua conta e conecte suas finanças.
        </h1>

        <p className="text-sm md:text-base text-ella-subtile max-w-xl">
          Tenha visão unificada de contas, IA financeira e alertas inteligentes.
        </p>
      </section>

      {/* Card */}
      <section className="rounded-2xl border border-ella-muted bg-white/90 p-6 shadow-lg ella-glass">
        <h2 className="text-lg font-medium text-ella-navy mb-1">
          Criar sua conta ELLA
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-ella-subtile">
                Nome
              </label>
              <input
                type="text"
                placeholder="Mariana"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-ella-muted px-3 py-2 text-sm focus:border-ella-gold focus:ring-1 focus:ring-ella-gold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-ella-subtile">
                Sobrenome
              </label>
              <input
                type="text"
                placeholder="Silva"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-ella-muted px-3 py-2 text-sm focus:border-ella-gold focus:ring-1 focus:ring-ella-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase text-ella-subtile">
              E-mail
            </label>
            <input
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-ella-muted px-3 py-2 text-sm focus:border-ella-gold focus:ring-1 focus:ring-ella-gold"
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
              className="w-full rounded-lg border border-ella-muted px-3 py-2 text-sm focus:border-ella-gold focus:ring-1 focus:ring-ella-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase text-ella-subtile">
              Confirmar senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-ella-muted px-3 py-2 text-sm focus:border-ella-gold focus:ring-1 focus:ring-ella-gold"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-emerald-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-ella-gold px-4 py-2 text-sm font-medium text-ella-navy hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Criando conta..." : "Criar conta na ELLA"}
          </button>

          <p className="pt-3 text-center text-xs text-ella-subtile">
            Já tem conta?
            <a
              href="/login"
              className="ml-1 font-medium text-ella-navy hover:text-ella-gold"
            >
              Entrar
            </a>
          </p>
        </form>
      </section>
    </div>
  );
}

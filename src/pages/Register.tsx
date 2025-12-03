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
    } catch (err) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : "Erro ao criar conta.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="grid min-h-screen items-center gap-8 p-6 md:grid-cols-[1.2fr,1fr]"
      style={{
        backgroundImage: "url(/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <section className="space-y-4">
        <p className="text-ella-subtile text-sm tracking-[0.3em] uppercase">comece com a ella</p>

        <h1 className="text-ella-navy text-3xl font-semibold md:text-4xl">
          Crie sua conta e conecte suas finanças.
        </h1>

        <p className="text-ella-subtile max-w-xl text-sm md:text-base">
          Tenha visão unificada de contas, IA financeira e alertas inteligentes.
        </p>
      </section>

      {/* Card */}
      <section className="border-ella-muted ella-glass rounded-2xl border bg-white/90 p-6 shadow-lg">
        <h2 className="text-ella-navy mb-1 text-lg font-medium">Criar sua conta ELLA</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-ella-subtile text-xs font-medium uppercase">Nome</label>
              <input
                type="text"
                placeholder="Mariana"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-ella-muted focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-ella-subtile text-xs font-medium uppercase">Sobrenome</label>
              <input
                type="text"
                placeholder="Silva"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-ella-muted focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-ella-subtile text-xs font-medium uppercase">E-mail</label>
            <input
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-ella-muted focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
            />
          </div>

          <div className="space-y-1">
            <label className="text-ella-subtile text-xs font-medium uppercase">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border-ella-muted focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
            />
          </div>

          <div className="space-y-1">
            <label className="text-ella-subtile text-xs font-medium uppercase">
              Confirmar senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="border-ella-muted focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-ella-gold text-ella-navy w-full rounded-lg px-4 py-2 text-sm font-medium hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Criando conta..." : "Criar conta na ELLA"}
          </button>

          <p className="text-ella-subtile pt-3 text-center text-xs">
            Já tem conta?
            <a href="/login" className="text-ella-navy hover:text-ella-gold ml-1 font-medium">
              Entrar
            </a>
          </p>
        </form>
      </section>
    </div>
  );
}

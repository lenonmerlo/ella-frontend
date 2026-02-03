import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/shared/Footer";
import { login as doLogin } from "../lib/auth";
import { http } from "../lib/http";

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

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      await http.post("/auth/register", null, { params: { name, email, password } });

      await doLogin(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : "Erro ao criar conta.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ella-gradient-bg min-h-screen">
      <div className="flex min-h-screen flex-col">
        <div className="px-4 py-10">
          <div className="bg-ella-card/60 mx-auto grid max-w-5xl items-center gap-6 rounded-2xl p-6 shadow-sm backdrop-blur md:grid-cols-[1.1fr,0.9fr]">
            <section className="space-y-4">
              <p className="text-ella-subtile text-sm tracking-[0.3em] uppercase">
                comece com a ella
              </p>

              <h1 className="text-ella-navy text-3xl font-semibold md:text-4xl">
                Crie sua conta e conecte suas finanças.
              </h1>

              <p className="text-ella-subtile max-w-xl text-sm md:text-base">
                Tenha visão unificada de contas, IA financeira e alertas inteligentes.
              </p>
            </section>

            {/* Card */}
            <section className="border-ella-muted ella-glass bg-ella-card/90 rounded-2xl border p-6 shadow-lg">
              <h2 className="text-ella-navy mb-1 text-lg font-medium">Criar sua conta ELLA</h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label
                      className="text-ella-subtile text-xs font-medium uppercase"
                      htmlFor="register-first-name"
                    >
                      Nome
                    </label>
                    <input
                      id="register-first-name"
                      type="text"
                      placeholder="Mariana"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border-ella-muted bg-ella-card text-ella-text focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      className="text-ella-subtile text-xs font-medium uppercase"
                      htmlFor="register-last-name"
                    >
                      Sobrenome
                    </label>
                    <input
                      id="register-last-name"
                      type="text"
                      placeholder="Silva"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border-ella-muted bg-ella-card text-ella-text focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    className="text-ella-subtile text-xs font-medium uppercase"
                    htmlFor="register-email"
                  >
                    E-mail
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-ella-muted bg-ella-card text-ella-text focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    className="text-ella-subtile text-xs font-medium uppercase"
                    htmlFor="register-password"
                  >
                    Senha
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-ella-muted bg-ella-card text-ella-text focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    className="text-ella-subtile text-xs font-medium uppercase"
                    htmlFor="register-confirm-password"
                  >
                    Confirmar senha
                  </label>
                  <input
                    id="register-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-ella-muted bg-ella-card text-ella-text focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
                    required
                    autoComplete="new-password"
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
                  <Link
                    className="text-ella-navy hover:text-ella-gold ml-1 font-medium"
                    to="/auth/login"
                  >
                    Entrar
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

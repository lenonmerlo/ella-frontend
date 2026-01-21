import { useState } from "react";
import { Link } from "react-router-dom";

import { Footer } from "../components/shared/Footer";
import { http } from "../lib/http";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await http.post("/auth/forgot-password", null, { params: { email } });
      setSuccess("Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.");
    } catch (err) {
      setError("Não foi possível enviar o e-mail. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">Esqueci minha senha</h1>
            <p className="mt-2 text-sm text-gray-600">
              Informe seu e-mail e enviaremos um link de redefinição.
            </p>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">E-mail</span>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                />
              </label>

              {success ? (
                <div role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {success}
                </div>
              ) : null}

              {error ? (
                <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? "Enviando..." : "Enviar link"}
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-600">
              <Link className="text-indigo-600 hover:underline" to="/auth/login">
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

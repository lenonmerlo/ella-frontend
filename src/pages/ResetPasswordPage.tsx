import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Footer } from "../components/shared/Footer";
import { http } from "../lib/http";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tokenMissing = !token;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!token) {
      setError("Token inválido ou ausente.");
      return;
    }

    if (newPassword.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await http.post("/auth/reset-password", null, {
        params: { token, newPassword },
      });
      setSuccess("Senha redefinida com sucesso. Você já pode fazer login.");
    } catch (err) {
      setError("Não foi possível redefinir a senha. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">Redefinir senha</h1>
            <p className="mt-2 text-sm text-gray-600">
              Digite sua nova senha para concluir a redefinição.
            </p>

            {tokenMissing ? (
              <div role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                Token inválido ou ausente.
              </div>
            ) : null}

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Nova senha</span>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Confirmar nova senha</span>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
                disabled={submitting || tokenMissing}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? "Salvando..." : "Redefinir senha"}
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-600">
              <Link className="text-indigo-600 hover:underline" to="/auth/login">
                Ir para o login
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

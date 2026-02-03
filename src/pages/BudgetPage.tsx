import { BudgetForm } from "@/components/dashboard/budget/BudgetForm";
import { BudgetRule5030202 } from "@/components/dashboard/budget/BudgetRule5030202";
import { BudgetSummary } from "@/components/dashboard/budget/BudgetSummary";
import { useAuth } from "@/contexts/AuthContext";
import { fetchBudget } from "@/services/api/budgetService";
import type { BudgetResponse } from "@/types/budget";
import { useEffect, useMemo, useState } from "react";

function isNotFoundMessage(message: string): boolean {
  const m = message.toLowerCase();
  return m.includes("não encontrado") || m.includes("not found");
}

export default function BudgetPage() {
  const { user } = useAuth();

  const personId = user?.id ?? "";

  const [budget, setBudget] = useState<BudgetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const canLoad = useMemo(() => Boolean(personId), [personId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!canLoad) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBudget(personId);
        if (cancelled) return;
        setBudget(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro desconhecido";
        if (!isNotFoundMessage(msg)) {
          setError(msg);
        }
        setBudget(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [canLoad, personId]);

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="bg-ella-card/80 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
        <h2 className="text-ella-navy text-lg font-semibold">Orçamento</h2>
        <p className="text-ella-subtile mt-1 text-sm">
          Planeje seu mês com mais clareza: defina seu orçamento e acompanhe a regra 50/30/20 (50%
          necessidades, 30% desejos, 20% investimentos).
        </p>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="bg-ella-card/80 rounded-2xl p-6 shadow-sm">Carregando orçamento...</div>
      ) : budget ? (
        <div className="space-y-8">
          <BudgetSummary budget={budget} />
          <BudgetRule5030202 budget={budget} />

          <div>
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="bg-ella-gold hover:bg-ella-gold/90 rounded-lg px-4 py-2 text-sm font-medium text-white"
            >
              {showForm ? "Fechar" : "Editar Orçamento"}
            </button>
          </div>

          {showForm && (
            <BudgetForm
              personId={personId}
              onSuccess={(updated) => {
                setBudget(updated);
                setShowForm(false);
              }}
            />
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-ella-card/80 rounded-2xl p-6 shadow-sm">
            <p className="text-ella-subtile text-sm">
              Você ainda não tem um orçamento. Crie um agora!
            </p>
          </div>

          <BudgetForm
            personId={personId}
            onSuccess={(created) => {
              setBudget(created);
            }}
          />
        </div>
      )}
    </section>
  );
}

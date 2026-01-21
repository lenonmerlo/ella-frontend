import { InvestmentCard } from "@/components/dashboard/investments/InvestmentCard";
import { InvestmentForm } from "@/components/dashboard/investments/InvestmentForm";
import { InvestmentSummary } from "@/components/dashboard/investments/InvestmentSummary";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useAuth } from "@/contexts/AuthContext";
import { deleteInvestment, fetchInvestmentsSummary } from "@/services/api/investmentService";
import type { InvestmentResponse, InvestmentSummaryResponse } from "@/types/investment";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function InvestmentPage() {
  const { user } = useAuth();
  const personId = user?.id ?? "";

  const [summary, setSummary] = useState<InvestmentSummaryResponse | null>(null);
  const [editingInvestment, setEditingInvestment] = useState<InvestmentResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InvestmentResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const canLoad = useMemo(() => Boolean(personId), [personId]);

  const load = useCallback(async () => {
    if (!personId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInvestmentsSummary(personId);
      setSummary(data);
    } catch (err) {
      setSummary(null);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => {
    if (!canLoad) return;
    load();
  }, [canLoad, load]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteInvestment(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar investimento");
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <h2 className="text-ella-navy text-lg font-semibold">Investimentos</h2>
        <p className="text-ella-subtile mt-1 text-sm">
          Acompanhe todos os seus investimentos e a rentabilidade ao longo do tempo.
        </p>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-2xl bg-white/80 p-6 shadow-sm">Carregando investimentos...</div>
      ) : (
        <div className="space-y-8">
          {summary && <InvestmentSummary summary={summary} />}

          <div className="flex items-center justify-between">
            <h3 className="text-ella-navy text-lg font-semibold">
              Meus Investimentos ({summary?.investments?.length ?? 0})
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingInvestment(null);
                setShowForm((v) => !v);
              }}
              className="bg-ella-gold hover:bg-ella-gold/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
            >
              <Plus size={18} />
              Adicionar
            </button>
          </div>

          {showForm && (
            <InvestmentForm
              personId={personId}
              investment={editingInvestment ?? undefined}
              onSuccess={async () => {
                await load();
                setShowForm(false);
                setEditingInvestment(null);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingInvestment(null);
              }}
            />
          )}

          {summary && summary.investments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {summary.investments.map((inv) => (
                <InvestmentCard
                  key={inv.id}
                  investment={inv}
                  onEdit={(it) => {
                    setEditingInvestment(it);
                    setShowForm(true);
                  }}
                  onDelete={() => setDeleteTarget(inv)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <p className="mb-4 text-sm text-gray-600">
                Você ainda não tem investimentos registrados.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="bg-ella-gold hover:bg-ella-gold/90 rounded-lg px-4 py-2 text-sm font-medium text-white"
              >
                Adicionar Primeiro Investimento
              </button>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Confirmar exclusão"
        message={
          deleteTarget
            ? `Tem certeza que deseja excluir "${deleteTarget.name}"?`
            : "Tem certeza que deseja excluir este investimento?"
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmVariant="danger"
        loading={deleting}
        onCancel={() => (deleting ? null : setDeleteTarget(null))}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

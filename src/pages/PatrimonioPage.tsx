import { AssetCard } from "@/components/dashboard/assets/AssetCard";
import { AssetForm } from "@/components/dashboard/assets/AssetForm";
import { AssetStats } from "@/components/dashboard/assets/AssetStats";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useAuth } from "@/contexts/AuthContext";
import { deleteAsset, fetchAssets, fetchTotalAssetsValue } from "@/services/api/assetService";
import type { AssetResponse } from "@/types/asset";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function PatrimonioPage() {
  const { user } = useAuth();
  const personId = user?.id ?? "";

  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [editingAsset, setEditingAsset] = useState<AssetResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AssetResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const canLoad = useMemo(() => Boolean(personId), [personId]);

  const load = useCallback(async () => {
    if (!personId) return;
    setLoading(true);
    setError(null);

    try {
      const [list, total] = await Promise.all([
        fetchAssets(personId),
        fetchTotalAssetsValue(personId),
      ]);
      setAssets(list);
      setTotalValue(Number(total.totalValue ?? 0));
    } catch (err) {
      setAssets([]);
      setTotalValue(null);
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
      await deleteAsset(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover ativo");
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="bg-ella-card/80 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
        <h2 className="text-ella-navy text-lg font-semibold">Patrimônio</h2>
        <p className="text-ella-subtile mt-1 text-sm">
          Veja seu valor total e gerencie ativos manuais. Investimentos são sincronizados
          automaticamente.
        </p>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="bg-ella-card/80 rounded-2xl p-6 shadow-sm">Carregando patrimônio...</div>
      ) : (
        <div className="space-y-8">
          <AssetStats assets={assets} totalValue={totalValue} />

          <div className="flex items-center justify-between">
            <h3 className="text-ella-navy text-lg font-semibold">Meus Ativos ({assets.length})</h3>
            <button
              type="button"
              onClick={() => {
                setEditingAsset(null);
                setShowForm((v) => !v);
              }}
              className="bg-ella-gold hover:bg-ella-gold/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
            >
              <Plus size={18} />
              Adicionar
            </button>
          </div>

          {showForm && (
            <AssetForm
              personId={personId}
              asset={editingAsset ?? undefined}
              onSuccess={async () => {
                await load();
                setShowForm(false);
                setEditingAsset(null);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingAsset(null);
              }}
            />
          )}

          {assets.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assets.map((a) => (
                <AssetCard
                  key={a.id}
                  asset={a}
                  onEdit={(it) => {
                    setEditingAsset(it);
                    setShowForm(true);
                  }}
                  onDelete={() => setDeleteTarget(a)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-ella-card/60 rounded-2xl p-8 text-center shadow-sm">
              <p className="text-ella-subtile mb-4 text-sm">
                Você ainda não tem ativos cadastrados.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="bg-ella-gold hover:bg-ella-gold/90 rounded-lg px-4 py-2 text-sm font-medium text-white"
              >
                Adicionar Primeiro Ativo
              </button>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Confirmar remoção"
        message={
          deleteTarget
            ? deleteTarget.syncedFromInvestment
              ? `Tem certeza que deseja remover \"${deleteTarget.name}\" do Patrimônio? (Não afeta o investimento)`
              : `Tem certeza que deseja excluir \"${deleteTarget.name}\"?`
            : "Tem certeza que deseja remover este ativo?"
        }
        confirmText="Remover"
        cancelText="Cancelar"
        confirmVariant="danger"
        loading={deleting}
        onCancel={() => (deleting ? null : setDeleteTarget(null))}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

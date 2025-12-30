import type { DashboardTransaction } from "@/types/dashboard";
import { AlertTriangle, Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Props {
  transaction: DashboardTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transaction: DashboardTransaction, category: string) => Promise<void>;
  categories: string[];
}

export function ManualCategoryModal({
  transaction,
  isOpen,
  onClose,
  onConfirm,
  categories,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transaction) return;
    setSelectedCategory(transaction.category || "");
    setError(null);
  }, [transaction]);

  const formattedDate = useMemo(() => {
    const dateStr = transaction?.purchaseDate || transaction?.date;
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("pt-BR");
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  async function handleConfirm() {
    const tx = transaction;
    if (!tx) return;
    if (!selectedCategory) return;
    setSaving(true);
    setError(null);
    try {
      await onConfirm(tx, selectedCategory);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar categoria");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="flex min-h-full items-start justify-center p-4">
        <div
          className="ella-glass my-6 w-full max-w-lg overflow-y-auto p-6"
          style={{ maxHeight: "90vh" }}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-ella-navy text-base font-semibold">Categorizar Transação</h2>
                <p className="text-ella-subtile text-xs">Revisão manual para alto valor</p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-md p-2 text-gray-500 hover:bg-white/60"
              onClick={onClose}
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-5 rounded-lg bg-white/70 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-ella-navy text-sm font-medium">{transaction.description}</div>
                <div className="text-ella-subtile mt-1 text-xs">{formattedDate}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-red-600">
                  -R{"$ "}
                  {Math.abs(transaction.amount ?? 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div className="text-ella-subtile mt-1 text-xs">
                  Categoria atual: {transaction.category}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3 text-sm font-semibold text-gray-700">Selecione a categoria</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    active
                      ? "bg-ella-navy flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-white"
                      : "flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700"
                  }
                >
                  {active && <Check size={14} />}
                  {category}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-xs text-red-700">{error}</div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="bg-ella-navy flex-1 rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              onClick={handleConfirm}
              disabled={saving || !selectedCategory}
            >
              {saving ? "Salvando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

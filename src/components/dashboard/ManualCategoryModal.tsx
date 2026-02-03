import type { DashboardTransaction } from "@/types/dashboard";
import { AlertTriangle, Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ManualCategoryModalProps {
  transaction: DashboardTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transaction: DashboardTransaction, category: string) => Promise<void>;
  categories: string[];
}

export const ManualCategoryModal = ({
  transaction,
  isOpen,
  onClose,
  onConfirm,
  categories,
}: ManualCategoryModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && transaction) {
      setSelectedCategory("");
      setError("");
      setSaving(false);
    }
  }, [isOpen, transaction]);

  // Format transaction date
  const formattedDate = useMemo(() => {
    if (!transaction) return "";
    return new Date(transaction.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [transaction]);

  // Handle category confirmation
  const handleConfirm = async () => {
    if (!transaction || !selectedCategory) {
      setError("Por favor, selecione uma categoria");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onConfirm(transaction, selectedCategory);
      setSelectedCategory("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Erro ao salvar categoria. Tente novamente.");
      console.error("Erro ao confirmar categoria:", err);
    } finally {
      setSaving(false);
    }
  };

  // Don't render if modal is closed or no transaction
  if (!isOpen || !transaction) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="ella-glass w-full max-w-xl overflow-hidden rounded-lg shadow-2xl">
        {/* ===== HEADER ===== */}
        <div className="flex items-start justify-between gap-4 border-b border-white/40 p-6">
          <div className="flex flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2
                id="modal-title"
                className="text-ella-navy flex items-center gap-2 text-base font-bold"
              >
                <AlertTriangle size={16} className="text-amber-500" />
                Categorizar Transação
              </h2>
              <p className="text-ella-subtile flex items-center gap-2 text-xs">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  Alto valor
                </span>
                <span className="text-ella-navy font-semibold">≥ R$ 5.000</span>
                <span className="mx-1">·</span>
                Revisão manual obrigatória
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-ella-subtile hover:bg-ella-background/60 hover:text-ella-navy shrink-0 rounded-md p-2 transition-colors"
            onClick={onClose}
            aria-label="Fechar modal"
            disabled={saving}
          >
            <X size={18} />
          </button>
        </div>

        {/* ===== BODY ===== */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {/* Transaction Details Card */}
          <div className="bg-ella-card/70 mb-6 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              {/* Left: Description and Date */}
              <div className="flex-1">
                <div className="text-ella-navy text-sm font-medium">{transaction.description}</div>
                <div className="text-ella-subtile mt-1 text-xs">{formattedDate}</div>
              </div>

              {/* Right: Amount and Current Category */}
              <div className="shrink-0 text-right">
                <div className="text-sm font-bold text-red-600">
                  -R${" "}
                  {Math.abs(transaction.amount ?? 0).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-ella-subtile mt-1 text-xs">
                  Categoria atual: <span className="font-semibold">{transaction.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Selection Section */}
          <div>
            <label className="text-ella-navy mb-3 block text-sm font-semibold">
              Selecione a nova categoria
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-ella-brand text-white shadow-md"
                        : "border-ella-muted bg-ella-card text-ella-navy hover:bg-ella-background/60 border"
                    }`}
                  >
                    {isActive && <Check size={14} className="shrink-0" />}
                    <span>{category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-red-50 p-3">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-red-600" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="border-ella-muted/40 bg-ella-card/30 flex gap-3 border-t p-6">
          <button
            type="button"
            className="border-ella-muted bg-ella-card text-ella-navy hover:bg-ella-background/60 flex-1 rounded-md border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="bg-ella-brand flex-1 rounded-md px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
            onClick={handleConfirm}
            disabled={saving || !selectedCategory}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Salvando...
              </span>
            ) : (
              "Confirmar Categoria"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualCategoryModal;

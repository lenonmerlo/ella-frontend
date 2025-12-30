import type { DashboardTransaction } from "@/types/dashboard";
import { AlertTriangle, DollarSign, Eye, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ManualCategoryModal } from "./ManualCategoryModal";

const DEFAULT_THRESHOLD = 2000;

const DEFAULT_CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Vestuário",
  "Seguros",
  "Viagem",
  "Diversos",
  "Serviços",
  "Moradia",
  "Impostos",
  "Taxas e Juros",
  "Outros",
];

interface Props {
  transactions: DashboardTransaction[];
  highValueThreshold?: number;
  currency?: string;
  onCategoryUpdated?: () => void;
  onConfirmCategory: (tx: DashboardTransaction, category: string) => Promise<void>;
}

export function CriticalTransactionAlert({
  transactions,
  highValueThreshold = DEFAULT_THRESHOLD,
  currency = "R$",
  onCategoryUpdated,
  onConfirmCategory,
}: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [selected, setSelected] = useState<DashboardTransaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const highValue = useMemo(() => {
    const list = (transactions ?? [])
      .filter((t) => {
        const abs = Math.abs(t.amount ?? 0);
        const isExpense = t.type === "EXPENSE";
        return isExpense && abs >= highValueThreshold;
      })
      .sort((a, b) => Math.abs(b.amount ?? 0) - Math.abs(a.amount ?? 0));

    const total = list.reduce((sum, t) => sum + Math.abs(t.amount ?? 0), 0);
    return { list, total };
  }, [highValueThreshold, transactions]);

  if (dismissed || highValue.list.length === 0) return null;

  const count = highValue.list.length;

  function openReview(tx: DashboardTransaction) {
    setSelected(tx);
    setModalOpen(true);
  }

  return (
    <div className="ella-glass border border-amber-200 p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-ella-navy text-sm font-semibold">
              Transações de alto valor que precisam de atenção
            </h3>
            <p className="text-ella-subtile mt-1 text-xs">
              {count} transação(ões) ≥ {currency} {highValueThreshold.toLocaleString("pt-BR")} ·
              Total: {currency}{" "}
              {highValue.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-gray-500 hover:bg-white/60"
          onClick={() => setDismissed(true)}
          aria-label="Dispensar"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <DollarSign size={14} />
          <span>Alto valor</span>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700"
          onClick={() => {
            const first = highValue.list[0];
            if (first) openReview(first);
          }}
        >
          <Eye size={14} />
          Revisar
        </button>
      </div>

      <div className="space-y-2">
        {highValue.list.slice(0, 5).map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-4 rounded-lg bg-white/70 p-4"
          >
            <div className="min-w-0">
              <div className="text-ella-navy truncate text-sm font-medium">{t.description}</div>
              <div className="text-ella-subtile mt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">Alto valor</span>
                <span className="rounded bg-white px-2 py-0.5">{t.category}</span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <div className="text-sm font-bold text-red-600">
                -{currency}{" "}
                {Math.abs(t.amount ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <button
                type="button"
                className="bg-ella-navy rounded-md px-3 py-1 text-xs font-semibold text-white"
                onClick={() => openReview(t)}
              >
                Categorizar
              </button>
            </div>
          </div>
        ))}

        {highValue.list.length > 5 && (
          <div className="text-ella-subtile text-xs">
            +{highValue.list.length - 5} transação(ões)
          </div>
        )}
      </div>

      <ManualCategoryModal
        transaction={selected}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={DEFAULT_CATEGORIES}
        onConfirm={async (tx, category) => {
          await onConfirmCategory(tx, category);
          onCategoryUpdated?.();
        }}
      />
    </div>
  );
}

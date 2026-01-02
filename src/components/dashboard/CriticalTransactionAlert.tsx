import {
  fetchCriticalTransactions,
  markCriticalTransactionReviewed,
  type CriticalReason,
} from "@/services/api/criticalTransactionsService";
import type { DashboardTransaction } from "@/types/dashboard";
import { AlertTriangle, DollarSign, Eye, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ManualCategoryModal } from "./ManualCategoryModal";

const DEFAULT_THRESHOLD = 5000;

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
  personId: string;
  transactions: DashboardTransaction[];
  highValueThreshold?: number;
  currency?: string;
  onCategoryUpdated?: () => void;
  onConfirmCategory: (tx: DashboardTransaction, category: string) => Promise<void>;
}

export function CriticalTransactionAlert({
  personId,
  transactions,
  highValueThreshold = DEFAULT_THRESHOLD,
  currency = "R$",
  onCategoryUpdated,
  onConfirmCategory,
}: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [selected, setSelected] = useState<DashboardTransaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [backendList, setBackendList] = useState<
    Array<DashboardTransaction & { criticalReason?: CriticalReason | null }>
  >([]);
  const [backendOk, setBackendOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const list = await fetchCriticalTransactions(personId);
        if (cancelled) return;

        const mapped = (Array.isArray(list) ? list : []).map((t) => {
          const type: DashboardTransaction["type"] =
            String(t.type ?? "EXPENSE").toUpperCase() === "INCOME" ? "INCOME" : "EXPENSE";

          const scopeStr = String(t.scope ?? "")
            .toUpperCase()
            .trim();
          const scope: DashboardTransaction["scope"] =
            scopeStr === "BUSINESS" ? "BUSINESS" : scopeStr === "PERSONAL" ? "PERSONAL" : undefined;

          return {
            id: String(t.id),
            description: String(t.description ?? ""),
            amount: Number(t.amount ?? 0),
            category: String(t.category ?? ""),
            date: String(t.transactionDate ?? ""),
            purchaseDate: t.purchaseDate ? String(t.purchaseDate) : undefined,
            type,
            scope,
            criticalReason: t.criticalReason ?? null,
          };
        });

        setBackendList(mapped);
        setBackendOk(true);
      } catch {
        if (cancelled) return;
        setBackendOk(false);
        setBackendList([]);
      }
    }

    if (!personId || dismissed) return;
    load();
    return () => {
      cancelled = true;
    };
  }, [dismissed, personId]);

  const view = useMemo(() => {
    const source = backendOk ? backendList : (transactions ?? []);
    const list = (source ?? [])
      .filter((t) => {
        const abs = Math.abs(t.amount ?? 0);
        const isExpense = t.type === "EXPENSE";
        if (!isExpense) return false;
        // quando o backend está disponível, ele já trouxe somente críticas pendentes
        if (backendOk) return true;
        return abs >= highValueThreshold;
      })
      .sort((a, b) => Math.abs(b.amount ?? 0) - Math.abs(a.amount ?? 0));

    const total = list.reduce((sum, t) => sum + Math.abs(t.amount ?? 0), 0);
    return { list, total };
  }, [backendList, backendOk, highValueThreshold, transactions]);

  if (dismissed) return null;

  const count = view.list.length;

  function openReview(tx: DashboardTransaction) {
    setSelected(tx);
    setModalOpen(true);
  }

  if (view.list.length === 0) {
    return (
      <div className="ella-glass text-ella-subtile border border-amber-200 p-6 text-center text-sm">
        <div className="mb-2 flex items-center justify-center gap-2">
          <AlertTriangle size={20} className="text-amber-500" />
          <span>
            Nenhuma transação {backendOk ? "crítica" : "de alto valor"} encontrada
            <span className="text-ella-navy ml-1 font-semibold">(≥ R$ 5.000)</span>.
          </span>
        </div>
        
      </div>
    );
  }

  return (
    <div className="ella-glass border border-amber-200 p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-ella-navy flex items-center gap-2 text-base font-bold">
              <AlertTriangle size={18} className="text-amber-500" />
              {backendOk
                ? "Transações críticas que precisam de atenção"
                : "Transações de alto valor que precisam de atenção"}
            </h3>
            <p className="text-ella-subtile mt-1 flex items-center gap-2 text-xs">
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                {backendOk ? "Crítica" : "Alto valor"}
              </span>
              <span className="text-ella-navy font-semibold">≥ R$ 5.000</span>
              <span className="mx-1">·</span>
              <span>{count} transação(ões)</span>
              <span className="mx-1">·</span>
              <span>
                Total:{" "}
                <span className="font-semibold">
                  {currency} {view.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </span>
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
            const first = view.list[0];
            if (first) openReview(first);
          }}
        >
          <Eye size={14} />
          Revisar
        </button>
      </div>

      <div className="space-y-2">
        {view.list.slice(0, 5).map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-4 rounded-lg bg-white/70 p-4"
          >
            <div className="min-w-0">
              <div className="text-ella-navy truncate text-sm font-medium">{t.description}</div>
              <div className="text-ella-subtile mt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">
                  {backendOk ? "Crítica" : "Alto valor"}
                </span>
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

        {view.list.length > 5 && (
          <div className="text-ella-subtile text-xs">+{view.list.length - 5} transação(ões)</div>
        )}
      </div>

      <ManualCategoryModal
        transaction={selected}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={DEFAULT_CATEGORIES}
        onConfirm={async (tx, category) => {
          await onConfirmCategory(tx, category);
          if (backendOk) {
            try {
              await markCriticalTransactionReviewed(tx.id);
            } catch {
              // se falhar, não bloqueia o fluxo do usuário
            }
          }
          onCategoryUpdated?.();
        }}
      />
    </div>
  );
}

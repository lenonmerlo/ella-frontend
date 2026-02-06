import { createBudget, fetchBudget, updateBudget } from "@/services/api/budgetService";
import type { BudgetRequest, BudgetResponse } from "@/types/budget";
import { parseNumberInput } from "@/utils/format";
import { useEffect, useMemo, useState } from "react";

interface BudgetFormProps {
  personId: string;
  onSuccess?: (budget: BudgetResponse) => void;
}

const EMPTY_FORM: BudgetRequest = {
  income: 0,
  essentialFixedCost: 0,
  necessaryFixedCost: 0,
  variableFixedCost: 0,
  investment: 0,
  plannedPurchase: 0,
  protection: 0,
};

type Field = {
  key: keyof BudgetRequest;
  label: string;
  hint?: string;
};

const FIELDS: Field[] = [
  { key: "income", label: "Renda Mensal" },
  {
    key: "essentialFixedCost",
    label: "Custo Fixo Essencial",
    hint: "Moradia, alimentação, transporte, impostos",
  },
  {
    key: "necessaryFixedCost",
    label: "Custo Fixo Necessário",
    hint: "Saúde, internet, seguro de carro",
  },
  { key: "variableFixedCost", label: "Custo Variável", hint: "Lazer, entretenimento" },
  {
    key: "investment",
    label: "Investimento",
    hint: "Poupança, investimentos, reserva de emergência",
  },
  { key: "plannedPurchase", label: "Compra Planejada", hint: "Consórcio" },
  { key: "protection", label: "Proteção", hint: "Seguros de vida e patrimonial" },
];

function validateBudget(input: BudgetRequest): string | null {
  if (!Number.isFinite(input.income) || input.income <= 0) {
    return "Informe uma renda mensal válida (maior que 0).";
  }

  for (const [key, value] of Object.entries(input) as Array<[keyof BudgetRequest, number]>) {
    if (!Number.isFinite(value)) return `Campo inválido: ${String(key)}`;
    if (value < 0) return "Os valores não podem ser negativos.";
  }

  return null;
}

export function BudgetForm({ personId, onSuccess }: BudgetFormProps) {
  const [formData, setFormData] = useState<BudgetRequest>(EMPTY_FORM);
  const [rawValues, setRawValues] = useState<Partial<Record<keyof BudgetRequest, string>>>({});
  const [budgetId, setBudgetId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUpdate = useMemo(() => Boolean(budgetId), [budgetId]);

  useEffect(() => {
    let cancelled = false;

    async function prefill() {
      if (!personId) return;
      setPrefillLoading(true);
      try {
        const budget = await fetchBudget(personId);
        if (cancelled) return;

        setBudgetId(budget.id);
        const next: BudgetRequest = {
          income: budget.income,
          essentialFixedCost: budget.essentialFixedCost,
          necessaryFixedCost: budget.necessaryFixedCost,
          variableFixedCost: budget.variableFixedCost,
          investment: budget.investment,
          plannedPurchase: budget.plannedPurchase,
          protection: budget.protection,
        };
        setFormData(next);
        const toPtBr = (v: number) => (v === 0 ? "" : String(v).replace(".", ","));
        setRawValues({
          income: toPtBr(next.income),
          essentialFixedCost: toPtBr(next.essentialFixedCost),
          necessaryFixedCost: toPtBr(next.necessaryFixedCost),
          variableFixedCost: toPtBr(next.variableFixedCost),
          investment: toPtBr(next.investment),
          plannedPurchase: toPtBr(next.plannedPurchase),
          protection: toPtBr(next.protection),
        });
      } catch (err) {
        // Se não existir orçamento ainda, não é erro.
        console.debug("[BudgetForm] Sem orçamento existente:", err);
        if (!cancelled) {
          setBudgetId(null);
          setFormData(EMPTY_FORM);
          setRawValues({});
        }
      } finally {
        if (!cancelled) setPrefillLoading(false);
      }
    }

    prefill();
    return () => {
      cancelled = true;
    };
  }, [personId]);

  const handleChange = (field: keyof BudgetRequest, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRawChange = (field: keyof BudgetRequest, raw: string) => {
    setRawValues((prev) => ({ ...prev, [field]: raw }));
    const trimmed = raw.trim();
    handleChange(field, trimmed ? parseNumberInput(trimmed) : 0);
  };

  const getDisplayValue = (field: keyof BudgetRequest) => {
    const raw = rawValues[field];
    if (raw != null) return raw;
    const v = formData[field];
    if (!Number.isFinite(v) || v === 0) return "";
    return String(v).replace(".", ",");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateBudget(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const saved = budgetId
        ? await updateBudget(budgetId, formData)
        : await createBudget(personId, formData);

      setBudgetId(saved.id);
      onSuccess?.(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-ella-card/80 space-y-6 rounded-2xl p-6 shadow-sm">
      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {prefillLoading && (
        <div className="bg-ella-background/60 text-ella-navy rounded-lg p-3 text-sm">
          Carregando orçamento...
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {FIELDS.map(({ key, label, hint }) => (
          <div key={String(key)} className={key === "income" ? "md:col-span-2" : ""}>
            <label className="text-ella-subtile mb-1 block text-xs font-medium">{label}</label>
            {hint && <p className="text-ella-subtile mb-2 text-xs">{hint}</p>}
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              value={getDisplayValue(key)}
              onChange={(e) => handleRawChange(key, e.target.value)}
              className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
              placeholder="0,00"
              required={key === "income"}
              aria-label={label}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-ella-gold hover:bg-ella-gold/90 w-full rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Salvando..." : isUpdate ? "Atualizar Orçamento" : "Salvar Orçamento"}
      </button>
    </form>
  );
}

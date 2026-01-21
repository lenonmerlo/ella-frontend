import { createInvestment, updateInvestment } from "@/services/api/investmentService";
import type { InvestmentRequest, InvestmentResponse } from "@/types/investment";
import { INVESTMENT_TYPE_LABELS, InvestmentType } from "@/types/investment";
import { parseNumberInput } from "@/utils/format";
import { useEffect, useMemo, useState } from "react";

interface InvestmentFormProps {
  personId: string;
  investment?: InvestmentResponse;
  onSuccess?: (investment: InvestmentResponse) => void;
  onCancel?: () => void;
}

const EMPTY_FORM: InvestmentRequest = {
  name: "",
  type: InvestmentType.SAVINGS,
  initialValue: 0,
  currentValue: 0,
  investmentDate: new Date().toISOString().split("T")[0],
  description: "",
};

function validateInvestment(input: InvestmentRequest): string | null {
  if (!input.name || !input.name.trim()) return "Informe um nome para o investimento.";
  if (!input.type) return "Selecione um tipo de investimento.";
  if (!input.investmentDate) return "Informe a data do investimento.";

  if (!Number.isFinite(input.initialValue) || input.initialValue <= 0) {
    return "Informe um valor inicial válido (maior que 0).";
  }

  if (!Number.isFinite(input.currentValue) || input.currentValue < 0) {
    return "Informe um valor atual válido (não negativo).";
  }

  return null;
}

export function InvestmentForm({ personId, investment, onSuccess, onCancel }: InvestmentFormProps) {
  const [formData, setFormData] = useState<InvestmentRequest>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = useMemo(() => Boolean(investment?.id), [investment?.id]);

  useEffect(() => {
    if (!investment) {
      setFormData(EMPTY_FORM);
      return;
    }
    setFormData({
      name: investment.name,
      type: investment.type,
      initialValue: Number(investment.initialValue ?? 0),
      currentValue: Number(investment.currentValue ?? 0),
      investmentDate: investment.investmentDate,
      description: investment.description || "",
    });
  }, [investment]);

  const handleChange = <K extends keyof InvestmentRequest>(
    field: K,
    value: InvestmentRequest[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateInvestment(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const saved = investment?.id
        ? await updateInvestment(investment.id, formData)
        : await createInvestment(personId, formData);

      onSuccess?.(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white/80 p-6 shadow-sm">
      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-ella-subtile mb-1 block text-xs font-medium">
            Nome do Investimento
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
            placeholder="Ex: Tesouro Selic, PETR4, Bitcoin"
            required
            aria-label="Nome do Investimento"
          />
        </div>

        <div>
          <label className="text-ella-subtile mb-1 block text-xs font-medium">
            Tipo de Investimento
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value as InvestmentType)}
            className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
            aria-label="Tipo de Investimento"
          >
            {Object.entries(INVESTMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-ella-subtile mb-1 block text-xs font-medium">Data</label>
          <input
            type="date"
            value={formData.investmentDate}
            onChange={(e) => handleChange("investmentDate", e.target.value)}
            className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
            required
            aria-label="Data de Investimento"
          />
        </div>

        <div>
          <label className="text-ella-subtile mb-1 block text-xs font-medium">Valor Inicial</label>
          <input
            type="number"
            step="0.01"
            min={0}
            value={Number.isFinite(formData.initialValue) ? formData.initialValue : 0}
            onChange={(e) => handleChange("initialValue", parseNumberInput(e.target.value))}
            className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
            placeholder="0,00"
            required
            aria-label="Valor Inicial"
          />
        </div>

        <div>
          <label className="text-ella-subtile mb-1 block text-xs font-medium">Valor Atual</label>
          <input
            type="number"
            step="0.01"
            min={0}
            value={Number.isFinite(formData.currentValue) ? formData.currentValue : 0}
            onChange={(e) => handleChange("currentValue", parseNumberInput(e.target.value))}
            className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
            placeholder="0,00"
            required
            aria-label="Valor Atual"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-ella-subtile mb-1 block text-xs font-medium">
            Descrição (opcional)
          </label>
          <textarea
            value={formData.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
            placeholder="Notas sobre este investimento..."
            rows={3}
            aria-label="Descrição"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-ella-gold hover:bg-ella-gold/90 flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Salvando..." : isEdit ? "Atualizar" : "Adicionar"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

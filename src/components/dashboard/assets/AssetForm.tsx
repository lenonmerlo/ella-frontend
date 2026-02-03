import { createAsset, updateAsset } from "@/services/api/assetService";
import type { AssetRequest, AssetResponse } from "@/types/asset";
import { ASSET_TYPE_LABELS, AssetType } from "@/types/asset";
import { parseNumberInput } from "@/utils/format";
import { useEffect, useMemo, useState } from "react";

interface AssetFormProps {
  personId: string;
  asset?: AssetResponse;
  onSuccess?: (asset: AssetResponse) => void;
  onCancel?: () => void;
}

const EMPTY_FORM: AssetRequest = {
  name: "",
  type: AssetType.OUTROS,
  purchaseValue: undefined,
  currentValue: 0,
  purchaseDate: new Date().toISOString().split("T")[0],
};

function validateAsset(input: AssetRequest): string | null {
  if (!input.name || !input.name.trim()) return "Informe um nome para o ativo.";
  if (!input.type) return "Selecione um tipo de ativo.";

  if (!Number.isFinite(input.currentValue) || input.currentValue < 0) {
    return "Informe um valor atual válido (não negativo).";
  }

  if (input.purchaseValue != null && Number(input.purchaseValue) < 0) {
    return "Informe um valor de compra válido (não negativo).";
  }

  return null;
}

export function AssetForm({ personId, asset, onSuccess, onCancel }: AssetFormProps) {
  const [formData, setFormData] = useState<AssetRequest>(EMPTY_FORM);
  const [rawPurchaseValue, setRawPurchaseValue] = useState<string>("");
  const [rawCurrentValue, setRawCurrentValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = useMemo(() => Boolean(asset?.id), [asset?.id]);

  useEffect(() => {
    if (!asset) {
      setFormData(EMPTY_FORM);
      setRawPurchaseValue("");
      setRawCurrentValue("");
      return;
    }

    const next: AssetRequest = {
      name: asset.name,
      type: asset.type,
      purchaseValue: asset.purchaseValue == null ? undefined : Number(asset.purchaseValue),
      currentValue: Number(asset.currentValue ?? 0),
      purchaseDate: asset.purchaseDate ?? undefined,
    };

    setFormData(next);
    const toPtBr = (v: number | undefined) => {
      if (!v) return "";
      return String(v).replace(".", ",");
    };
    setRawPurchaseValue(toPtBr(next.purchaseValue));
    setRawCurrentValue(toPtBr(next.currentValue));
  }, [asset]);

  const handleChange = <K extends keyof AssetRequest>(field: K, value: AssetRequest[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRawNumberChange = (field: "purchaseValue" | "currentValue", raw: string) => {
    const trimmed = raw.trim();
    if (field === "purchaseValue") setRawPurchaseValue(raw);
    else setRawCurrentValue(raw);

    if (!trimmed) {
      handleChange(field, field === "purchaseValue" ? undefined : 0);
      return;
    }

    handleChange(field, parseNumberInput(trimmed) as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateAsset(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const saved = asset?.id
        ? await updateAsset(asset.id, formData)
        : await createAsset(personId, formData);

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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-ella-subtile mb-1 block text-xs font-medium">Nome do Ativo</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
            placeholder="Ex: Apartamento, Carro, Reserva"
            required
            aria-label="Nome do Ativo"
          />
        </div>

        <div>
          <label className="text-ella-subtile mb-1 block text-xs font-medium">Tipo</label>
          <select
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value as AssetType)}
            className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
            aria-label="Tipo do Ativo"
          >
            {Object.entries(ASSET_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-ella-subtile mb-1 block text-xs font-medium">Data de compra</label>
          <input
            type="date"
            value={formData.purchaseDate ?? ""}
            onChange={(e) => handleChange("purchaseDate", e.target.value || undefined)}
            className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
            aria-label="Data de compra"
          />
        </div>

        <div>
          <label className="text-ella-subtile mb-1 block text-xs font-medium">
            Valor de compra
          </label>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            value={rawPurchaseValue}
            onChange={(e) => handleRawNumberChange("purchaseValue", e.target.value)}
            className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
            placeholder="0,00"
            aria-label="Valor de compra"
          />
        </div>

        <div>
          <label className="text-ella-subtile mb-1 block text-xs font-medium">Valor atual</label>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            value={rawCurrentValue}
            onChange={(e) => handleRawNumberChange("currentValue", e.target.value)}
            className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
            placeholder="0,00"
            required
            aria-label="Valor atual"
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

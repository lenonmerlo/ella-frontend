import type { AssetResponse } from "@/types/asset";
import { ASSET_TYPE_LABELS } from "@/types/asset";
import { formatCurrency } from "@/utils/format";
import { Edit2, Trash2 } from "lucide-react";

interface AssetCardProps {
  asset: AssetResponse;
  onEdit?: (asset: AssetResponse) => void;
  onDelete?: (id: string) => void;
}

export function AssetCard({ asset, onEdit, onDelete }: AssetCardProps) {
  return (
    <div className="border-ella-muted bg-ella-card rounded-lg border p-4 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-ella-navy font-semibold">{asset.name}</h3>
            {asset.syncedFromInvestment && (
              <span className="bg-ella-background/70 text-ella-subtile rounded-full px-2 py-0.5 text-[11px] font-semibold">
                Sincronizado
              </span>
            )}
          </div>
          <p className="text-ella-subtile text-sm">{ASSET_TYPE_LABELS[asset.type]}</p>
        </div>

        <div className="flex gap-2">
          {onEdit && !asset.syncedFromInvestment && (
            <button
              type="button"
              onClick={() => onEdit(asset)}
              className="text-ella-subtile hover:text-ella-gold p-2 transition-colors"
              aria-label={`Editar ${asset.name}`}
              title="Editar"
            >
              <Edit2 size={18} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(asset.id)}
              className="text-ella-subtile p-2 transition-colors hover:text-red-600"
              aria-label={`Excluir ${asset.name}`}
              title={asset.syncedFromInvestment ? "Remover do Patrimônio" : "Excluir"}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-ella-subtile mb-1 text-xs">Valor de compra</p>
          <p className="font-medium">
            {asset.purchaseValue == null ? "—" : formatCurrency(Number(asset.purchaseValue))}
          </p>
        </div>
        <div>
          <p className="text-ella-subtile mb-1 text-xs">Valor atual</p>
          <p className="font-medium">{formatCurrency(Number(asset.currentValue ?? 0))}</p>
        </div>
      </div>

      <p className="text-ella-subtile text-xs">
        {asset.purchaseDate
          ? `Desde ${new Date(asset.purchaseDate).toLocaleDateString("pt-BR")}`
          : ""}
      </p>
    </div>
  );
}

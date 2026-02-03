import type { AssetResponse } from "@/types/asset";
import { ASSET_TYPE_LABELS, AssetType } from "@/types/asset";
import { formatCurrency } from "@/utils/format";
import { useMemo } from "react";

interface Props {
  assets: AssetResponse[];
  totalValue?: number | null;
}

export function AssetStats({ assets, totalValue }: Props) {
  const computedTotal = useMemo(() => {
    if (typeof totalValue === "number" && Number.isFinite(totalValue)) return totalValue;
    return assets.reduce((acc, a) => acc + Number(a.currentValue ?? 0), 0);
  }, [assets, totalValue]);

  const byType = useMemo(() => {
    const map: Record<AssetType, number> = {
      [AssetType.IMOVEL]: 0,
      [AssetType.VEICULO]: 0,
      [AssetType.INVESTIMENTO]: 0,
      [AssetType.OUTROS]: 0,
    };
    for (const a of assets) {
      map[a.type] += Number(a.currentValue ?? 0);
    }
    return map;
  }, [assets]);

  const types: AssetType[] = [
    AssetType.IMOVEL,
    AssetType.VEICULO,
    AssetType.INVESTIMENTO,
    AssetType.OUTROS,
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-ella-card/80 rounded-2xl p-6 shadow-sm">
        <p className="text-ella-subtile text-xs font-medium">Valor total</p>
        <p className="text-ella-navy mt-1 text-2xl font-bold">{formatCurrency(computedTotal)}</p>
        <p className="text-ella-subtile mt-2 text-sm">{assets.length} ativos</p>
      </div>

      <div className="bg-ella-card/80 rounded-2xl p-6 shadow-sm">
        <p className="text-ella-subtile text-xs font-medium">Distribuição por tipo</p>
        <div className="mt-3 space-y-2">
          {types.map((t) => {
            const value = byType[t] ?? 0;
            const pct = computedTotal > 0 ? Math.round((value / computedTotal) * 100) : 0;
            return (
              <div key={t} className="flex items-center justify-between gap-3">
                <span className="text-ella-subtile text-sm">{ASSET_TYPE_LABELS[t]}</span>
                <span className="text-ella-navy text-sm font-semibold">
                  {formatCurrency(value)} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

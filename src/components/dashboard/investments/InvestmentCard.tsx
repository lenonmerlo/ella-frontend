import type { InvestmentResponse } from "@/types/investment";
import { INVESTMENT_TYPE_LABELS } from "@/types/investment";
import { formatCurrency } from "@/utils/format";
import { Edit2, Trash2 } from "lucide-react";

interface InvestmentCardProps {
  investment: InvestmentResponse;
  onEdit?: (investment: InvestmentResponse) => void;
  onDelete?: (id: string) => void;
}

export function InvestmentCard({ investment, onEdit, onDelete }: InvestmentCardProps) {
  const profitability = Number(investment.profitability ?? 0);
  const isPositive = profitability >= 0;
  const gain = Number(investment.currentValue ?? 0) - Number(investment.initialValue ?? 0);

  return (
    <div className="border-ella-muted bg-ella-card rounded-lg border p-4 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-ella-navy font-semibold">{investment.name}</h3>
          <p className="text-ella-subtile text-sm">{INVESTMENT_TYPE_LABELS[investment.type]}</p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(investment)}
              className="text-ella-subtile hover:text-ella-gold p-2 transition-colors"
              aria-label={`Editar ${investment.name}`}
            >
              <Edit2 size={18} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(investment.id)}
              className="text-ella-subtile p-2 transition-colors hover:text-red-600"
              aria-label={`Excluir ${investment.name}`}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-ella-subtile mb-1 text-xs">Valor Inicial</p>
          <p className="font-medium">{formatCurrency(Number(investment.initialValue ?? 0))}</p>
        </div>
        <div>
          <p className="text-ella-subtile mb-1 text-xs">Valor Atual</p>
          <p className="font-medium">{formatCurrency(Number(investment.currentValue ?? 0))}</p>
        </div>
      </div>

      <div className="bg-ella-background/50 mb-4 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-ella-subtile text-sm">Ganho/Perda</span>
          <span className={`font-semibold ${gain >= 0 ? "text-green-600" : "text-red-600"}`}>
            {gain >= 0 ? "+" : ""}
            {formatCurrency(gain)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-ella-subtile text-sm">Rentabilidade</span>
          <span className={`text-lg font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "+" : ""}
            {profitability.toFixed(2)}%
          </span>
        </div>
      </div>

      <p className="text-ella-subtile text-xs">
        Desde {new Date(investment.investmentDate).toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
}

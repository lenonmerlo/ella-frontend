import type { InvestmentSummaryResponse } from "@/types/investment";
import { formatCurrency } from "@/utils/format";
import { TrendingUp } from "lucide-react";

interface InvestmentSummaryProps {
  summary: InvestmentSummaryResponse;
}

export function InvestmentSummary({ summary }: InvestmentSummaryProps) {
  const totalInvested = Number(summary.totalInvested ?? 0);
  const totalCurrent = Number(summary.totalCurrent ?? 0);
  const totalProfitability = Number(summary.totalProfitability ?? 0);
  const isPositive = totalProfitability >= 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-gray-600">Total Investido</p>
          <TrendingUp size={20} className="text-blue-600" />
        </div>
        <p className="text-ella-navy text-2xl font-bold">{formatCurrency(totalInvested)}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-gray-600">Valor Atual</p>
          <TrendingUp size={20} className="text-green-600" />
        </div>
        <p className="text-ella-navy text-2xl font-bold">{formatCurrency(totalCurrent)}</p>
      </div>

      <div
        className={`rounded-lg border p-6 ${
          isPositive ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <p className={`text-sm ${isPositive ? "text-green-700" : "text-red-700"}`}>
            Rentabilidade Geral
          </p>
          <TrendingUp size={20} className={isPositive ? "text-green-600" : "text-red-600"} />
        </div>
        <p className={`text-2xl font-bold ${isPositive ? "text-green-700" : "text-red-700"}`}>
          {isPositive ? "+" : ""}
          {totalProfitability.toFixed(2)}%
        </p>
        <p className={`mt-2 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {totalCurrent - totalInvested >= 0 ? "+" : ""}
          {formatCurrency(totalCurrent - totalInvested)}
        </p>
      </div>
    </div>
  );
}

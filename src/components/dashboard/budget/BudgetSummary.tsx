import type { BudgetResponse } from "@/types/budget";
import { formatCurrency } from "@/utils/format";

interface BudgetSummaryProps {
  budget: BudgetResponse;
}

export function BudgetSummary({ budget }: BudgetSummaryProps) {
  const annualBalance = (budget.balance ?? 0) * 12;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-1 text-sm text-gray-600">Renda</p>
          <p className="text-ella-navy text-2xl font-bold">{formatCurrency(budget.income)}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-1 text-sm text-gray-600">Total de Custos</p>
          <p className="text-ella-navy text-2xl font-bold">{formatCurrency(budget.total)}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-1 text-sm text-gray-600">Saldo</p>
          <p
            className={`text-2xl font-bold ${budget.balance >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {formatCurrency(budget.balance)}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-1 text-sm text-gray-600">Saldo Anual</p>
          <p
            className={`text-2xl font-bold ${annualBalance >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {formatCurrency(annualBalance)}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="text-ella-navy mb-4 text-lg font-semibold">Detalhamento de Custos</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Custo Fixo Essencial</span>
            <span className="font-medium">{formatCurrency(budget.essentialFixedCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Custo Fixo Necessário</span>
            <span className="font-medium">{formatCurrency(budget.necessaryFixedCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Custo Fixo Variável</span>
            <span className="font-medium">{formatCurrency(budget.variableFixedCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Investimento</span>
            <span className="font-medium">{formatCurrency(budget.investment)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Compra Programada</span>
            <span className="font-medium">{formatCurrency(budget.plannedPurchase)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Proteção</span>
            <span className="font-medium">{formatCurrency(budget.protection)}</span>
          </div>
          <div className="flex justify-between border-t pt-3 font-bold">
            <span>Total</span>
            <span>{formatCurrency(budget.total)}</span>
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg p-4 text-sm ${
          budget.isHealthy ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
        }`}
      >
        <p className="font-medium">{budget.recommendation}</p>
      </div>
    </div>
  );
}

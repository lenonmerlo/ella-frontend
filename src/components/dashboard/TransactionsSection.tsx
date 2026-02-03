// src/components/dashboard/TransactionsSection.tsx
import type { DashboardTransaction } from "@/types/dashboard";
import { tryParseISODateLike } from "@/utils/date";

interface Props {
  transactions: DashboardTransaction[];
}

export function TransactionsSection({ transactions }: Props) {
  return (
    <section className="ella-glass p-6">
      <h3 className="text-ella-navy mb-6 text-sm font-semibold">Transações Recentes</h3>
      <div className="space-y-3">
        {transactions.slice(0, 8).map((transaction) => {
          const dateStr = transaction.purchaseDate || transaction.date;
          const date = tryParseISODateLike(dateStr);
          const formattedDate =
            date && !Number.isNaN(date.getTime())
              ? date.toLocaleDateString("pt-BR")
              : "Data indisponível";
          const isBusiness = transaction.scope === "BUSINESS";
          const scopeLabel = isBusiness ? "Empresa" : "Pessoal";
          const scopeClass = isBusiness
            ? "bg-blue-100 text-blue-700"
            : "bg-emerald-100 text-emerald-700";
          const isIncome = transaction.type === "INCOME";
          const amountAbs = Math.abs(transaction.amount ?? 0);

          return (
            <div
              key={transaction.id}
              className="bg-ella-background flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-gray-100"
            >
              <div className="flex-1">
                <p className="text-ella-navy font-medium">{transaction.description}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <span className="text-ella-subtile bg-ella-card/70 rounded px-2 py-1 text-xs">
                    {transaction.category}
                  </span>
                  <span className={`${scopeClass} rounded px-2 py-1 text-xs font-semibold`}>
                    {scopeLabel}
                  </span>
                  <span className="text-ella-subtile text-xs">{formattedDate}</span>
                </div>
              </div>

              <p className={`font-bold ${isIncome ? "text-emerald-600" : "text-red-600"}`}>
                {isIncome ? "+" : "-"}R{"$ "}
                {amountAbs.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

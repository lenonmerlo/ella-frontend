// src/components/dashboard/TransactionsSection.tsx
import { DashboardTransaction } from "../../pages/Dashboard";

interface Props {
  transactions: DashboardTransaction[];
}

export function TransactionsSection({ transactions }: Props) {
  return (
    <section className="ella-glass p-6">
      <h3 className="text-ella-navy mb-6 text-sm font-semibold">Transações Recentes</h3>
      <div className="space-y-3">
        {transactions.slice(0, 8).map((transaction) => (
          <div
            key={transaction.id}
            className="bg-ella-background flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-gray-100"
          >
            <div className="flex-1">
              <p className="text-ella-navy font-medium">{transaction.description}</p>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-ella-subtile rounded bg-white px-2 py-1 text-xs">
                  {transaction.category}
                </span>
                <span className="text-ella-subtile text-xs">
                  {new Date(transaction.date).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>

            <p
              className={`font-bold ${
                transaction.amount > 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {transaction.amount > 0 ? "+" : "-"}R{"$ "}
              {Math.abs(transaction.amount).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

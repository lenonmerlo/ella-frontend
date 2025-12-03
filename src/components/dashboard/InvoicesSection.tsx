// src/components/dashboard/InvoicesSection.tsx
import { DashboardTransaction } from "../../pages/Dashboard";

interface InvoicesSectionProps {
  transactions?: DashboardTransaction[];
}

export function InvoicesSection({ transactions = [] }: InvoicesSectionProps) {
  // Se não houver dados reais, mostrar mensagem
  if (transactions.length === 0) {
    return (
      <section className="ella-glass rounded-2xl p-6">
        <h2 className="text-ella-navy text-lg font-semibold">Faturas de cartão</h2>
        <p className="text-ella-subtile mt-1 text-sm">Nenhuma fatura encontrada.</p>
      </section>
    );
  }

  return (
    <section className="ella-glass rounded-2xl p-6">
      <h2 className="text-ella-navy text-lg font-semibold">Faturas de cartão</h2>
      <p className="text-ella-subtile mt-1 text-sm">Resumo das suas faturas recentes</p>

      <div className="border-ella-muted/50 mt-6 overflow-hidden rounded-xl border bg-white/70">
        <table className="min-w-full text-sm">
          <thead className="bg-ella-background">
            <tr className="text-ella-subtile text-left text-xs tracking-wide uppercase">
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-ella-muted/30 hover:bg-ella-background/60 border-t"
              >
                <td className="text-ella-navy px-4 py-3">{transaction.description}</td>
                <td className="text-ella-subtile px-4 py-3">{transaction.date}</td>
                <td className="text-ella-navy px-4 py-3 font-medium">
                  R${" "}
                  {Math.abs(transaction.amount).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="text-ella-subtile px-4 py-3">{transaction.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      transaction.type === "INCOME"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "Receita" : "Despesa"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

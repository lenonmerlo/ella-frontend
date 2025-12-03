// src/components/dashboard/InvoicesSection.tsx
export function InvoicesSection() {
  const invoices = [
    {
      id: 1,
      cardName: "Visa Gold",
      closingDate: "10/11/2025",
      dueDate: "17/11/2025",
      amount: 5234.8,
      status: "Aberta",
    },
    {
      id: 2,
      cardName: "Nubank",
      closingDate: "05/10/2025",
      dueDate: "12/10/2025",
      amount: 1890.35,
      status: "Paga",
    },
  ];

  return (
    <section className="ella-glass rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-ella-navy">
        Faturas de cartão
      </h2>
      <p className="mt-1 text-sm text-ella-subtile">
        Resumo das suas faturas recentes. Depois vamos puxar isso do backend.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-ella-muted/50 bg-white/70">
        <table className="min-w-full text-sm">
          <thead className="bg-ella-background">
            <tr className="text-left text-xs uppercase tracking-wide text-ella-subtile">
              <th className="px-4 py-3">Cartão</th>
              <th className="px-4 py-3">Fechamento</th>
              <th className="px-4 py-3">Vencimento</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-t border-ella-muted/30 hover:bg-ella-background/60"
              >
                <td className="px-4 py-3 text-ella-navy">{invoice.cardName}</td>
                <td className="px-4 py-3 text-ella-subtile">
                  {invoice.closingDate}
                </td>
                <td className="px-4 py-3 text-ella-subtile">
                  {invoice.dueDate}
                </td>
                <td className="px-4 py-3 font-medium text-ella-navy">
                  R{"$ "}
                  {invoice.amount.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      invoice.status === "Paga"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {invoice.status}
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

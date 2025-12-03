// src/components/dashboard/GoalsSection.tsx
export function GoalsSection() {
  const goals = [
    {
      id: 1,
      name: "Reserva de emergência",
      targetAmount: 10000,
      currentAmount: 4200,
      dueLabel: "Dez/2025",
    },
    {
      id: 2,
      name: "Quitar cartão Nubank",
      targetAmount: 3000,
      currentAmount: 1200,
      dueLabel: "Mar/2025",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="ella-glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-ella-navy">
          Metas financeiras
        </h2>
        <p className="mt-1 text-sm text-ella-subtile">
          Metas criadas a partir das suas faturas e comportamento de gastos.
          Depois vamos conectar com o backend.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => {
          const progress = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100),
          );

          return (
            <div key={goal.id} className="ella-glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-ella-navy">
                {goal.name}
              </h3>
              <p className="mt-1 text-xs text-ella-subtile">
                Prazo: {goal.dueLabel}
              </p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-ella-subtile">
                  <span>
                    R{"$ "}
                    {goal.currentAmount.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    de{" "}
                    {goal.targetAmount.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span>{progress}%</span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-ella-background">
                  <div
                    className="h-full rounded-full bg-ella-gold"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

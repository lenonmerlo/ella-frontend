import type { BudgetResponse } from "@/types/budget";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface BudgetRule5030202Props {
  budget: BudgetResponse;
}

export function BudgetRule5030202({ budget }: BudgetRule5030202Props) {
  const data = [
    { name: "Necessidades", value: budget.necessitiesPercentage },
    { name: "Desejos", value: budget.desiresPercentage },
    { name: "Investimentos", value: budget.investmentsPercentage },
  ];

  const COLORS = ["#3B82F6", "#F59E0B", "#10B981"]; // azul, âmbar, verde

  return (
    <div className="space-y-6">
      <h3 className="text-ella-navy text-lg font-semibold">Regra 50/30/20</h3>

      <div className="border-ella-muted bg-ella-card rounded-lg border p-6">
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${String(name)}: ${Number(value ?? 0).toFixed(1)}%`}
                outerRadius={90}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `${Number(value ?? 0).toFixed(1)}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-500/10">
          <div className="mb-2 flex justify-between">
            <span className="font-medium text-blue-900 dark:text-blue-200">Necessidades</span>
            <span
              className={`font-bold ${budget.necessitiesPercentage <= 50 ? "text-green-600" : "text-red-600"}`}
            >
              {budget.necessitiesPercentage.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-200/80">Recomendado: 50%</p>
        </div>

        <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-500/10">
          <div className="mb-2 flex justify-between">
            <span className="font-medium text-amber-900 dark:text-amber-200">Desejos</span>
            <span
              className={`font-bold ${budget.desiresPercentage <= 30 ? "text-green-600" : "text-red-600"}`}
            >
              {budget.desiresPercentage.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-200/80">Recomendado: 30%</p>
        </div>

        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-500/10">
          <div className="mb-2 flex justify-between">
            <span className="font-medium text-green-900 dark:text-green-200">Investimentos</span>
            <span
              className={`font-bold ${budget.investmentsPercentage >= 20 ? "text-green-600" : "text-red-600"}`}
            >
              {budget.investmentsPercentage.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-green-700 dark:text-green-200/80">Recomendado: 20%</p>
        </div>
      </div>
    </div>
  );
}

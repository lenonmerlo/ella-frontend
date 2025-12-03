// src/components/dashboard/ChartsSection.tsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardData } from "../../pages/Dashboard";

const PIE_COLORS = ["#0E1A2B", "#C9A43B", "#4B5563", "#E5D4A0", "#2E3A4D", "#D4AF65"];

interface Props {
  data: DashboardData;
}

export function ChartsSection({ data }: Props) {
  const expensesByCategory = data.transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  // Prefer backend monthly evolution when available. Otherwise, derive monthly totals
  // from the transactions list (group by month). Fall back to static mock only if
  // no transaction data is available.
  const monthlyData: Array<{ month: string; receitas: number; despesas: number }> =
    data.monthly && data.monthly.length > 0
      ? data.monthly.map((m) => ({ month: m.month, receitas: m.income, despesas: m.expense }))
      : (() => {
          if (!data.transactions || data.transactions.length === 0) {
            return [
              { month: "Jul", receitas: 7000, despesas: 4500 },
              { month: "Ago", receitas: 7500, despesas: 4800 },
              { month: "Set", receitas: 8000, despesas: 5100 },
              { month: "Out", receitas: 8200, despesas: 5000 },
              { month: "Nov", receitas: 8500, despesas: 5234.8 },
            ];
          }

          // Group transactions by month (use locale short month names)
          const monthMap = new Map<string, { receitas: number; despesas: number }>();

          data.transactions.forEach((t) => {
            const dt = new Date(t.date);
            const monthName = dt.toLocaleString("pt-BR", { month: "short" });
            const name = monthName.charAt(0).toUpperCase() + monthName.slice(1);
            const entry = monthMap.get(name) ?? { receitas: 0, despesas: 0 };
            if (t.type === "INCOME") entry.receitas += Math.abs(t.amount);
            else entry.despesas += Math.abs(t.amount);
            monthMap.set(name, entry);
          });

          // Convert map to sorted array by month order
          const monthOrder = [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez",
          ];

          const result: Array<{ month: string; receitas: number; despesas: number }> = [];
          monthOrder.forEach((m) => {
            const v = monthMap.get(m);
            if (v) result.push({ month: m, receitas: v.receitas, despesas: v.despesas });
          });

          // If no matching month names (locale mismatch), fallback to map iteration
          if (result.length === 0) {
            for (const [name, v] of monthMap.entries()) {
              result.push({ month: name, receitas: v.receitas, despesas: v.despesas });
            }
          }

          return result;
        })();

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="ella-glass p-6">
        <h3 className="text-ella-navy mb-6 text-sm font-semibold">Receitas vs Despesas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E1E1E6" />
            <XAxis dataKey="month" stroke="#4B5563" />
            <YAxis stroke="#4B5563" />
            <Tooltip />
            <Legend />
            <Bar dataKey="receitas" fill="#10B981" name="Receitas" radius={[4, 4, 0, 0]} />
            <Bar dataKey="despesas" fill="#EF4444" name="Despesas" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="ella-glass p-6">
        <h3 className="text-ella-navy mb-6 text-sm font-semibold">Gastos por Categoria</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              dataKey="value"
              label={({ name, percent }) => {
                const safePercent = percent ?? 0; // se vier undefined, vira 0
                return `${name}: ${(safePercent * 100).toFixed(0)}%`;
              }}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

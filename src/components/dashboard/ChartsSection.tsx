// src/components/dashboard/ChartsSection.tsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartsDTO } from "../../services/api/chartsService";
import { SmartCategoryChart } from "./SmartCategoryChart";

interface Props {
  data: ChartsDTO;
}

export function ChartsSection({ data }: Props) {
  const categoryData = data.categoryBreakdown.map((item) => ({
    name: item.category,
    value: item.total,
  }));

  const monthlyData = data.monthlyEvolution.points.map((m) => ({
    month: m.monthLabel,
    receitas: m.income,
    despesas: m.expenses,
  }));

  const formatMonth = (label: string) => {
    // Espera "YYYY-MM"; se falhar, devolve original
    const [y, m] = label.split("-").map(Number);
    if (!y || !m) return label;
    const d = new Date(y, m - 1, 1);
    return d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
  };

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Gráfico de Barras */}
      <div className="ella-glass p-6">
        <h3 className="text-ella-navy mb-6 text-sm font-semibold">Receitas vs Despesas</h3>
        {monthlyData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-gray-500">Sem dados para exibir</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                dy={10}
                interval={1}
                tickFormatter={formatMonth}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: "#F3F4F6" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
              <Bar
                dataKey="receitas"
                name="Receitas"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="despesas"
                name="Despesas"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Gráfico de Pizza */}
      {categoryData.length === 0 ? (
        <div className="ella-glass p-6">
          <h3 className="text-ella-navy mb-6 text-sm font-semibold">Gastos por Categoria</h3>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-gray-500">Sem dados para exibir</p>
          </div>
        </div>
      ) : (
        <SmartCategoryChart data={categoryData} title="Gastos por Categoria" currency="R$" />
      )}
    </section>
  );
}

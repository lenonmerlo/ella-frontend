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
import { ChartsDTO } from "../../services/api/chartsService";

const PIE_COLORS = ["#0E1A2B", "#C9A43B", "#4B5563", "#E5D4A0", "#2E3A4D", "#D4AF65"];

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
                tick={{ fill: "#6B7280", fontSize: 12 }}
                dy={10}
                interval={0} // Forçar exibição de todos os meses
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
      <div className="ella-glass p-6">
        <h3 className="text-ella-navy mb-6 text-sm font-semibold">Gastos por Categoria</h3>
        {categoryData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-gray-500">Sem dados para exibir</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={0}
                dataKey="value"
                label={({ name, percent }) => {
                  const safePercent = percent ?? 0;
                  const safeName = name ?? "";
                  return `${safeName.substring(0, 10)}: ${(safePercent * 100).toFixed(0)}%`;
                }}
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #E1E1E6",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

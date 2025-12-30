import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";

export interface CategoryDatum {
  name: string;
  value: number;
}

type ChartType = "pie" | "donut" | "horizontal-bar" | "treemap" | "table";

interface Props {
  data: CategoryDatum[];
  title?: string;
  currency?: string;
}

const CATEGORY_COLORS = ["#0E1A2B", "#C9A43B", "#4B5563", "#E5D4A0", "#2E3A4D", "#D4AF65"]; // reuse existing palette

function defaultChartType(categoryCount: number): ChartType {
  if (categoryCount <= 3) return "pie";
  if (categoryCount <= 6) return "donut";
  if (categoryCount <= 15) return "horizontal-bar";
  return "treemap";
}

function chartTypeName(type: ChartType): string {
  switch (type) {
    case "pie":
      return "Pizza";
    case "donut":
      return "Donut";
    case "horizontal-bar":
      return "Barras Horizontais";
    case "treemap":
      return "Treemap";
    case "table":
      return "Tabela";
  }
}

function formatMoney(value: number, currency: string) {
  return `${currency} ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function SmartCategoryChart({
  data,
  title = "Despesas por Categoria",
  currency = "R$",
}: Props) {
  const categoryCount = data.length;
  const [selectedType, setSelectedType] = useState<ChartType>(() =>
    defaultChartType(categoryCount),
  );

  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const total = sorted.reduce((sum, item) => sum + item.value, 0);
    return {
      items: sorted.map((item) => ({
        ...item,
        percentage: total > 0 ? (item.value / total) * 100 : 0,
      })),
      total,
    };
  }, [data]);

  const autoType = useMemo(() => defaultChartType(categoryCount), [categoryCount]);
  const type = selectedType;

  const availableTypes = useMemo(() => {
    const options: ChartType[] = [];

    if (categoryCount <= 6) {
      options.push("pie", "donut");
    }

    if (categoryCount <= 15) {
      options.push("horizontal-bar");
    }

    if (categoryCount >= 10) {
      options.push("treemap");
    }

    options.push("table");

    // De-dup while preserving order
    return Array.from(new Set(options));
  }, [categoryCount]);

  // Keep selection aligned when data size changes (never setState during render)
  useEffect(() => {
    if (categoryCount <= 0) return;
    if (!availableTypes.includes(selectedType)) {
      setSelectedType(autoType);
    }
  }, [autoType, availableTypes, categoryCount, selectedType]);

  const heightForBars = Math.max(280, Math.min(520, chartData.items.length * 28));

  const containerHeight = useMemo(() => {
    if (type === "horizontal-bar") return heightForBars;
    if (type === "treemap") return 400;
    if (type === "table") return 360;
    return 320;
  }, [heightForBars, type]);

  return (
    <div className="ella-glass p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-ella-navy text-sm font-semibold">{title}</h3>
          <div className="mt-1 text-xs text-gray-500">
            Categorias: {categoryCount} · Total: {formatMoney(chartData.total, currency)} ·
            Visualização: {chartTypeName(type)}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Alterar:</span>
          {availableTypes.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSelectedType(opt)}
              className={
                opt === type
                  ? "bg-ella-navy rounded-md px-3 py-1 text-xs font-medium text-white"
                  : "rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700"
              }
            >
              {chartTypeName(opt)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: containerHeight }}>
        {type === "pie" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.items}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                innerRadius={0}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${String(name).substring(0, 12)} ${(Number(percent ?? 0) * 100).toFixed(0)}%`
                }
                style={{ fontSize: "12px", fontWeight: "500" }}
              >
                {chartData.items.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatMoney(Number(value), currency),
                  name,
                ]}
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

        {type === "donut" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.items}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={92}
                innerRadius={58}
                dataKey="value"
                nameKey="name"
              >
                {chartData.items.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ paddingTop: "12px" }} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatMoney(Number(value), currency),
                  name,
                ]}
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

        {type === "horizontal-bar" && (
          <ResponsiveContainer width="100%" height={heightForBars}>
            <BarChart
              data={chartData.items}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 30, bottom: 0 }}
            >
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(v) => `${currency} ${Number(v).toLocaleString("pt-BR")}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={140}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatMoney(Number(value), currency),
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #E1E1E6",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                {chartData.items.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {type === "treemap" && (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={chartData.items}
              dataKey="value"
              nameKey="name"
              stroke="#fff"
              content={<TreemapNode colors={CATEGORY_COLORS} currency={currency} />}
            />
          </ResponsiveContainer>
        )}

        {type === "table" && (
          <div className="h-full overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-xs text-gray-500">
                  <th className="py-2 pr-3">Categoria</th>
                  <th className="py-2 pr-3">Valor</th>
                  <th className="py-2">%</th>
                </tr>
              </thead>
              <tbody>
                {chartData.items.map((item, idx) => (
                  <tr key={`${item.name}-${idx}`} className="border-t border-gray-100">
                    <td className="py-2 pr-3 text-gray-800">{item.name}</td>
                    <td className="py-2 pr-3 text-gray-800">{formatMoney(item.value, currency)}</td>
                    <td className="py-2 text-gray-500">{item.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {type !== "table" && (
        <div className="mt-4 overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-white">
              <tr className="text-left text-xs text-gray-500">
                <th className="py-2 pr-3">Categoria</th>
                <th className="py-2 pr-3">Valor</th>
                <th className="py-2">%</th>
              </tr>
            </thead>
            <tbody>
              {chartData.items.map((item, idx) => (
                <tr key={`${item.name}-${idx}`} className="border-t border-gray-100">
                  <td className="py-2 pr-3 text-gray-800">{item.name}</td>
                  <td className="py-2 pr-3 text-gray-800">{formatMoney(item.value, currency)}</td>
                  <td className="py-2 text-gray-500">{item.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TreemapNode({ colors, currency, ...props }: any) {
  const { depth, x, y, width, height, index, name, value } = props;

  if (depth === 0) return null;

  const fill = colors[index % colors.length];
  const showText = width > 90 && height > 36;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{ fill, stroke: "#fff", strokeWidth: 2 }}
      />
      {showText && (
        <>
          <text x={x + 8} y={y + 18} fill="#fff" fontSize={12} fontWeight={600}>
            {String(name).substring(0, 18)}
          </text>
          <text x={x + 8} y={y + 34} fill="#fff" fontSize={11} opacity={0.9}>
            {formatMoney(Number(value ?? 0), currency)}
          </text>
        </>
      )}
      <title>
        {String(name)}: {formatMoney(Number(value ?? 0), currency)}
      </title>
    </g>
  );
}

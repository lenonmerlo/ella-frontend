// src/components/dashboard/DashboardSidebar.tsx
import {
  Activity,
  CreditCard,
  BarChart3,
  Target,
  Sparkles,
  ListTree,
} from "lucide-react";

interface Props {
  selected?: string;
  onSelect?: (id: string) => void;
}

const ITEMS = [
  { id: "overview", label: "Saúde financeira", icon: Activity },
  { id: "invoices", label: "Faturas de cartão", icon: CreditCard },
  { id: "transactions", label: "Movimentação", icon: ListTree },
  { id: "charts", label: "Gráficos", icon: BarChart3 },
  { id: "goals", label: "Metas", icon: Target },
  { id: "insights", label: "Insights da IA", icon: Sparkles },
];

export function DashboardSidebar({ selected = "overview", onSelect }: Props) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col gap-2 rounded-2xl bg-white/90 p-4 shadow-sm lg:flex">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ella-subtile">
        navegação
      </p>

      <nav className="space-y-1">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === selected;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-ella-navy text-white"
                  : "text-ella-subtile hover:bg-ella-background"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-ella-gold" : "text-ella-subtile"}
              />
              <span className="text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

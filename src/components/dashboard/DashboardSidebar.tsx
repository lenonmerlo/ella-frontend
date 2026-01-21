// src/components/dashboard/DashboardSidebar.tsx
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ListTree,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Wallet,
} from "lucide-react";

interface Props {
  selected?: string;
  onSelect?: (id: string) => void;
  onNewUpload?: () => void;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  mode?: "desktop" | "drawer";
}

const ITEMS = [
  { id: "overview", label: "Saúde financeira", icon: Activity },
  { id: "score", label: "Score ELLA", icon: Activity },
  { id: "budget", label: "Orçamento", icon: Wallet },
  { id: "investments", label: "Investimentos", icon: TrendingUp },
  { id: "invoices", label: "Faturas de cartão", icon: CreditCard },
  { id: "transactions", label: "Lançamentos Cartão", icon: ListTree },
  { id: "bank-statements", label: "Movimentação C/C", icon: ListTree },
  { id: "charts", label: "Gráficos", icon: BarChart3 },
  { id: "goals", label: "Metas", icon: Target },
  { id: "insights", label: "Insights da Ella", icon: Sparkles },
];

export function DashboardSidebar({
  selected = "overview",
  onSelect,
  onNewUpload,
  selectedDate,
  onDateChange,
  mode = "desktop",
}: Props) {
  const currentDate = selectedDate || new Date();
  const monthLabel = currentDate.toLocaleString("pt-BR", { month: "long", year: "numeric" });

  function handlePrevMonth() {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange?.(newDate);
  }

  function handleNextMonth() {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange?.(newDate);
  }

  const asideClassName =
    mode === "drawer"
      ? "flex w-72 shrink-0 flex-col gap-2 rounded-2xl bg-white/95 p-4 shadow-sm"
      : "hidden w-56 shrink-0 flex-col gap-2 rounded-2xl bg-white/90 p-4 shadow-sm lg:flex";

  return (
    <aside className={asideClassName}>
      {onDateChange && (
        <div className="bg-ella-background/50 mb-4 flex items-center justify-between rounded-xl p-2">
          <button
            onClick={handlePrevMonth}
            className="rounded-lg p-1 transition-colors hover:bg-white"
            title="Mês anterior"
          >
            <ChevronLeft size={16} className="text-ella-navy" />
          </button>
          <span className="text-ella-navy text-sm font-medium capitalize">{monthLabel}</span>
          <button
            onClick={handleNextMonth}
            className="rounded-lg p-1 transition-colors hover:bg-white"
            title="Próximo mês"
          >
            <ChevronRight size={16} className="text-ella-navy" />
          </button>
        </div>
      )}

      <p className="text-ella-subtile mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
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
                isActive ? "bg-ella-navy text-white" : "text-ella-subtile hover:bg-ella-background"
              }`}
            >
              <Icon size={18} className={isActive ? "text-ella-gold" : "text-ella-subtile"} />
              <span className="text-left">{item.label}</span>
            </button>
          );
        })}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNewUpload?.()}
            className="bg-ella-background text-ella-navy hover:bg-ella-background/80 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm"
            aria-label="Novo upload"
            title="Para novos insights e atualização, faça um novo upload"
          >
            <Upload size={18} className="text-ella-navy" />
            <span className="text-left">Novo upload</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

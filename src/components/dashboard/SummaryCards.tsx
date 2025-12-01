// src/components/dashboard/SummaryCards.tsx
import { CreditCard, Activity, Wallet, Sparkles } from "lucide-react";
import { DashboardSummary, DashboardInsight } from "../../pages/Dashboard";

interface Props {
  summary: DashboardSummary;
  insights: DashboardInsight[];
}

export function SummaryCards({ summary, insights }: Props) {
  // mock de score de saúde financeira – depois podemos calcular de verdade
  const financialHealthScore = 82;

  const faturaAtual = summary.totalExpenses; // interpretando como fatura do mês
  const gastoVariavel = summary.totalExpenses; // pode mudar depois
  const alertasIa = insights.length;

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Saúde financeira */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ella-background">
            <Activity size={24} className="text-ella-gold" />
          </div>
          <span className="text-xs font-medium uppercase text-ella-subtile">
            saúde financeira
          </span>
        </div>
        <p className="mb-1 text-sm text-ella-subtile">Score ELLA</p>
        <p className="text-3xl font-bold text-ella-navy">
          {financialHealthScore}/100
        </p>
        <p className="mt-1 text-xs text-ella-subtile">
          Baseado nas suas faturas e gastos recentes.
        </p>
      </div>

      {/* Fatura atual */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ella-background">
            <CreditCard size={24} className="text-ella-gold" />
          </div>
          <span className="text-xs font-medium uppercase text-ella-subtile">
            cartão
          </span>
        </div>
        <p className="mb-1 text-sm text-ella-subtile">Fatura do mês</p>
        <p className="text-3xl font-bold text-ella-navy">
          R{"$ "}
          {faturaAtual.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className="mt-1 text-xs text-ella-subtile">
          Valor consolidado a partir da última fatura enviada.
        </p>
      </div>

      {/* Gasto variável */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ella-background">
            <Wallet size={24} className="text-ella-gold" />
          </div>
          <span className="text-xs font-medium uppercase text-ella-subtile">
            gastos
          </span>
        </div>
        <p className="mb-1 text-sm text-ella-subtile">Gasto variável do mês</p>
        <p className="text-3xl font-bold text-red-600">
          R{"$ "}
          {gastoVariavel.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className="mt-1 text-xs text-ella-subtile">
          Restaurantes, apps, compras, lazer e outros variáveis.
        </p>
      </div>

      {/* Alertas da IA */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ella-background">
            <Sparkles size={24} className="text-ella-gold" />
          </div>
          <span className="text-xs font-medium uppercase text-ella-subtile">
            insights
          </span>
        </div>
        <p className="mb-1 text-sm text-ella-subtile">Alertas da IA</p>
        <p className="text-3xl font-bold text-ella-navy">{alertasIa}</p>
        <p className="mt-1 text-xs text-ella-subtile">
          Recomendações e avisos importantes para o mês.
        </p>
      </div>
    </section>
  );
}

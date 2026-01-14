// src/components/dashboard/SummaryCards.tsx
import type { DashboardInsight, DashboardInvoice, DashboardSummary } from "@/types/dashboard";
import { Activity, CreditCard, Sparkles, Wallet } from "lucide-react";

interface Props {
  summary: DashboardSummary;
  insights: DashboardInsight[];
  invoices?: DashboardInvoice[];
}

export function SummaryCards({ summary, insights, invoices }: Props) {
  // mock de score de saúde financeira – depois podemos calcular de verdade
  const financialHealthScore = 82;

  const faturaAtual = (invoices ?? []).reduce((sum, inv) => sum + Number(inv.amount ?? 0), 0);
  const alertasIa = insights.length;

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Saúde financeira */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="bg-ella-background flex h-12 w-12 items-center justify-center rounded-full">
            <Activity size={24} className="text-ella-gold" />
          </div>
          <span className="text-ella-subtile text-xs font-medium uppercase">saúde financeira</span>
        </div>
        <p className="text-ella-subtile mb-1 text-sm">Score ELLA</p>
        <p className="text-ella-navy text-3xl font-bold">{financialHealthScore}/100</p>
        <p className="text-ella-subtile mt-1 text-xs">
          Baseado nas suas faturas e gastos recentes.
        </p>
      </div>

      {/* Fatura atual */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="bg-ella-background flex h-12 w-12 items-center justify-center rounded-full">
            <CreditCard size={24} className="text-ella-gold" />
          </div>
          <span className="text-ella-subtile text-xs font-medium uppercase">cartão</span>
        </div>
        <p className="text-ella-subtile mb-1 text-sm">Fatura do mês</p>
        <p className="text-3xl font-bold text-red-600">
          R{"$ "}
          {faturaAtual.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className="text-ella-subtile mt-1 text-xs">
          Soma das faturas do mês (aba “Faturas de cartão”).
        </p>
      </div>

      {/* Recebimentos (standby por enquanto) */}
      <div className="ella-glass p-6 opacity-70">
        <div className="mb-4 flex items-center justify-between">
          <div className="bg-ella-background flex h-12 w-12 items-center justify-center rounded-full">
            <Wallet size={24} className="text-green-600" />
          </div>
          <span className="text-ella-subtile text-xs font-medium uppercase">recebimentos</span>
        </div>
        <p className="text-ella-subtile mb-1 text-sm">Recebimentos do mês</p>
        <p className="text-2xl font-bold text-green-600">Em breve</p>
        <p className="text-ella-subtile mt-1 text-xs">
          Em standby — será alimentado por extratos bancários.
        </p>
      </div>

      {/* Alertas da IA */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="bg-ella-background flex h-12 w-12 items-center justify-center rounded-full">
            <Sparkles size={24} className="text-ella-gold" />
          </div>
          <span className="text-ella-subtile text-xs font-medium uppercase">insights</span>
        </div>
        <p className="text-ella-subtile mb-1 text-sm">Alertas da IA</p>
        <p className="text-ella-navy text-3xl font-bold">{alertasIa}</p>
        <p className="text-ella-subtile mt-1 text-xs">
          Recomendações e avisos importantes para o mês.
        </p>
      </div>
    </section>
  );
}

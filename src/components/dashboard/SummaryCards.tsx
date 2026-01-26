// src/components/dashboard/SummaryCards.tsx
import { fetchBudget } from "@/services/api/budgetService";
import { fetchInvestmentsSummary } from "@/services/api/investmentService";
import type { BudgetResponse } from "@/types/budget";
import type { DashboardInsight, DashboardInvoice, DashboardSummary } from "@/types/dashboard";
import type { InvestmentSummaryResponse } from "@/types/investment";
import { CreditCard, PieChart, Sparkles, Target, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ScoreCard } from "./ScoreCard";

type BankStatementSummary = {
  openingBalance?: number | null;
  closingBalance?: number | null;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
};

interface Props {
  personId: string;
  summary: DashboardSummary;
  insights: DashboardInsight[];
  goalsCount?: number;
  invoices?: DashboardInvoice[];
  bankStatementSummary?: BankStatementSummary | null;
  bankStatementLoading?: boolean;
  onOpenInvestments?: () => void;
  onOpenBudget?: () => void;
  onOpenScore?: () => void;
}

export function SummaryCards({
  personId,
  summary,
  insights,
  goalsCount = 0,
  invoices,
  bankStatementSummary,
  bankStatementLoading = false,
  onOpenInvestments,
  onOpenBudget,
  onOpenScore,
}: Props) {
  const [investmentSummary, setInvestmentSummary] = useState<InvestmentSummaryResponse | null>(
    null,
  );
  const [investmentLoading, setInvestmentLoading] = useState(false);

  const [budget, setBudget] = useState<BudgetResponse | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!personId) return;
      setInvestmentLoading(true);
      try {
        const data = await fetchInvestmentsSummary(personId);
        if (!cancelled) setInvestmentSummary(data);
      } catch {
        if (!cancelled) setInvestmentSummary(null);
      } finally {
        if (!cancelled) setInvestmentLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [personId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!personId) return;
      setBudgetLoading(true);
      try {
        const data = await fetchBudget(personId);
        if (!cancelled) setBudget(data);
      } catch {
        if (!cancelled) setBudget(null);
      } finally {
        if (!cancelled) setBudgetLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [personId]);

  const ccIncome = bankStatementSummary?.totalIncome ?? 0;
  const ccExpenses = bankStatementSummary?.totalExpenses ?? 0;
  const ccClosingBalance = bankStatementSummary?.closingBalance;
  const ccBalance = ccClosingBalance != null ? ccClosingBalance : bankStatementSummary?.balance ?? ccIncome - ccExpenses;

  const showCcPlaceholder = !bankStatementLoading && !bankStatementSummary;
  const faturaAtual = (invoices ?? []).reduce((sum, inv) => sum + Number(inv.amount ?? 0), 0);
  const alertasIa = insights.length;

  const investmentsValue = investmentSummary?.totalCurrent ?? 0;
  const investmentsProfitability = investmentSummary?.totalProfitability ?? 0;

  const investmentsProfitLabel = useMemo(() => {
    const sign = investmentsProfitability >= 0 ? "+" : "-";
    return `${sign}${Math.abs(investmentsProfitability).toFixed(2)}%`;
  }, [investmentsProfitability]);

  const investmentsProfitColor = investmentsProfitability >= 0 ? "text-green-600" : "text-red-600";

  const budgetStatusText = budgetLoading
    ? "Carregando..."
    : budget
      ? budget.isHealthy
        ? "Saudável"
        : "Atenção"
      : "Não configurado";
  const budgetStatusColor = budget?.isHealthy
    ? "text-green-600"
    : budget
      ? "text-red-600"
      : "text-ella-subtile";

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <ScoreCard personId={personId} onViewDetails={onOpenScore} />

      {/* Saldo Total */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="bg-ella-background flex h-12 w-12 items-center justify-center rounded-full">
            <Wallet size={24} className="text-blue-600" />
          </div>
          <span className="text-ella-subtile text-xs font-medium uppercase">saldo</span>
        </div>
        <p className="text-ella-subtile mb-1 text-sm">Saldo (Conta Corrente)</p>
        {bankStatementLoading ? (
          <p className="text-ella-navy text-2xl font-bold whitespace-nowrap lg:text-3xl">
            Carregando...
          </p>
        ) : showCcPlaceholder ? (
          <p className="text-ella-subtile text-2xl font-bold whitespace-nowrap lg:text-3xl">
            Sem extrato
          </p>
        ) : (
          <p
            className={`text-2xl font-bold whitespace-nowrap lg:text-3xl ${ccBalance >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {"R$\u00A0"}
            {ccBalance.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        )}
        <p className="text-ella-subtile mt-1 text-xs">Saldo final do extrato.</p>
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
        <p className="text-2xl font-bold whitespace-nowrap text-red-600 lg:text-3xl">
          {"R$\u00A0"}
          {faturaAtual.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className="text-ella-subtile mt-1 text-xs">
          Soma das faturas do mês (aba “Faturas de cartão”).
        </p>
      </div>

      {/* Recebimentos (Conta Corrente) */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="bg-ella-background flex h-12 w-12 items-center justify-center rounded-full">
            <Wallet size={24} className="text-green-600" />
          </div>
          <span className="text-ella-subtile text-xs font-medium uppercase">recebimentos</span>
        </div>
        <p className="text-ella-subtile mb-1 text-sm">Recebimentos do mês</p>
        {bankStatementLoading ? (
          <p className="text-ella-navy text-2xl font-bold whitespace-nowrap lg:text-3xl">
            Carregando...
          </p>
        ) : showCcPlaceholder ? (
          <p className="text-ella-subtile text-2xl font-bold whitespace-nowrap lg:text-3xl">
            Sem extrato
          </p>
        ) : (
          <p className="text-2xl font-bold whitespace-nowrap text-green-600 lg:text-3xl">
            {"R$\u00A0"}
            {ccIncome.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        )}
        <p className="text-ella-subtile mt-1 text-xs">Somente entradas da conta corrente.</p>
      </div>

      {/* Investimentos */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="bg-ella-background flex h-12 w-12 items-center justify-center rounded-full">
            <TrendingUp size={24} className="text-green-600" />
          </div>
          <span className="text-ella-subtile text-xs font-medium uppercase">investimentos</span>
        </div>
        <p className="text-ella-subtile mb-1 text-sm">Patrimônio investido</p>
        <p className="text-ella-navy text-2xl font-bold whitespace-nowrap lg:text-3xl">
          {investmentLoading ? (
            "Carregando..."
          ) : (
            <>
              {"R$\u00A0"}
              {investmentsValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </>
          )}
        </p>
        <p className="text-ella-subtile mt-1 text-xs">
          Rentabilidade total:{" "}
          <span className={`font-semibold ${investmentsProfitColor}`}>
            {investmentsProfitLabel}
          </span>
        </p>
        {onOpenInvestments && (
          <button
            type="button"
            className="text-ella-navy mt-3 text-xs font-semibold hover:underline"
            onClick={onOpenInvestments}
          >
            Ver detalhes
          </button>
        )}
      </div>

      {/* Orçamento */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="bg-ella-background flex h-12 w-12 items-center justify-center rounded-full">
            <PieChart size={24} className="text-ella-gold" />
          </div>
          <span className="text-ella-subtile text-xs font-medium uppercase">orçamento</span>
        </div>
        <p className="text-ella-subtile mb-1 text-sm">Regra 50/30/20</p>
        <p className={`text-2xl font-bold whitespace-nowrap lg:text-3xl ${budgetStatusColor}`}>
          {budgetStatusText}
        </p>
        <p className="text-ella-subtile mt-1 line-clamp-2 text-xs">
          {budget?.recommendation
            ? budget.recommendation
            : "Defina seu orçamento e acompanhe seus percentuais."}
        </p>
        {onOpenBudget && (
          <button
            type="button"
            className="text-ella-navy mt-3 text-xs font-semibold hover:underline"
            onClick={onOpenBudget}
          >
            Ver detalhes
          </button>
        )}
      </div>

      {/* Alertas da Ella */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="bg-ella-background flex h-12 w-12 items-center justify-center rounded-full">
            <Sparkles size={24} className="text-ella-gold" />
          </div>
          <span className="text-ella-subtile text-xs font-medium uppercase">insights</span>
        </div>
        <p className="text-ella-subtile mb-1 text-sm">Alertas da Ella</p>
        <p className="text-ella-navy text-3xl font-bold">{alertasIa}</p>
        <p className="text-ella-subtile mt-1 text-xs">
          Recomendações e avisos importantes para o mês.
        </p>
      </div>

      {/* Metas */}
      <div className="ella-glass p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="bg-ella-background flex h-12 w-12 items-center justify-center rounded-full">
            <Target size={24} className="text-ella-gold" />
          </div>
          <span className="text-ella-subtile text-xs font-medium uppercase">metas</span>
        </div>
        <p className="text-ella-subtile mb-1 text-sm">Metas</p>
        <p className="text-ella-navy text-3xl font-bold">{goalsCount}</p>
        <p className="text-ella-subtile mt-1 text-xs">Quantidade de metas cadastradas.</p>
      </div>
    </section>
  );
}

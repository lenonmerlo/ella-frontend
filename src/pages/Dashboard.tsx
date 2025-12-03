// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getToken } from "../lib/auth";
import { fetchCurrentUserDashboard, type DashboardResponseDTO } from "../lib/dashboard";

import { ChartsSection } from "../components/dashboard/ChartsSection";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { GoalsSection } from "../components/dashboard/GoalsSection";
import { InsightsSection } from "../components/dashboard/InsightsSection";
import { InvoicesSection } from "../components/dashboard/InvoicesSection";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { TransactionsSection } from "../components/dashboard/TransactionsSection";
import { UploadState } from "../components/dashboard/UploadState";

export interface DashboardSummary {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number; // ainda existe no tipo, mas não estamos exibindo diretamente
}

export interface DashboardTransaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "INCOME" | "EXPENSE";
}

export interface DashboardInsight {
  id: number;
  title: string;
  description: string;
  type: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  transactions: DashboardTransaction[];
  insights: DashboardInsight[];
  monthly?: MonthlyData[];
}

type SectionId = "overview" | "invoices" | "transactions" | "charts" | "goals" | "insights";

/**
 * Mapeia DashboardResponseDTO (do backend) para DashboardData (formato local)
 */
function mapBackendToDashboard(backendData: DashboardResponseDTO): DashboardData {
  // Extrair balance: totalIncome - totalExpense
  const totalIncome = backendData.personalTotals?.totalIncome ?? 0;
  const totalExpense = backendData.personalTotals?.totalExpense ?? 0;
  const balance = backendData.personalTotals?.balance ?? totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  // Transformar invoices em transactions
  const transactions: DashboardTransaction[] = (backendData.personalInvoices ?? []).map(
    (invoice, idx) => ({
      id: idx + 1,
      description: `Fatura #${invoice.id}`,
      amount: invoice.amount,
      category: "Faturas",
      date: invoice.dueDate,
      type: invoice.amount < 0 ? "EXPENSE" : "INCOME",
    }),
  );

  // Criar insights baseados nos dados (opcional)
  const insights: DashboardInsight[] = [];

  if (savingsRate >= 30) {
    insights.push({
      id: 1,
      title: "Ótima taxa de poupança! 🎉",
      description: `Você está economizando ${savingsRate}% da sua renda mensal. Continue assim para atingir suas metas ainda mais rápido!`,
      type: "TIP",
      priority: "HIGH",
    });
  }

  return {
    summary: {
      balance,
      totalIncome,
      totalExpenses: totalExpense,
      savingsRate,
    },
    transactions,
    insights,
    monthly: (function () {
      const evo = backendData.personalMonthlyEvolution;
      if (!evo) return [];
      if (Array.isArray(evo)) {
        return evo.map((m) => ({ month: m.month, income: m.income, expense: m.expense }));
      }
      // If backend returned an object keyed by month or a single entry, try to normalize
      if (typeof evo === "object") {
        // If it's an object with month keys: { "Jan": { income:..., expense:... }, ... }
        const entries: Array<{ month: string; income: number; expense: number }> = [];
        for (const key of Object.keys(evo)) {
          const val = (evo as any)[key];
          if (val && typeof val === "object") {
            entries.push({
              month: key,
              income: Number(val.income ?? 0),
              expense: Number(val.expense ?? 0),
            });
          }
        }
        if (entries.length > 0) return entries;
      }
      return [];
    })(),
  };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Auth básica: se não tiver token, volta pro login
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionId>("overview");
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega dados reais do dashboard ao montar o componente
   */
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError(null);
        // Pegar data atual para passar year e month
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // getMonth() retorna 0-11

        const backendData = await fetchCurrentUserDashboard(year, month);

        if (backendData) {
          const mappedData = mapBackendToDashboard(backendData);
          setDashboardData(mappedData);
          setHasData(true);
          setSelectedSection("overview");
        } else {
          throw new Error("Nenhum dado retornado do servidor");
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erro ao carregar dashboard";
        console.error("Erro ao buscar dados do dashboard:", err);
        setError(errorMsg);
        // Não chamar setHasData(true) para manter a tela de upload
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  function handleSelectSection(id: string) {
    setSelectedSection(id as SectionId);
  }

  async function simulateAIProcessing() {
    const steps = [20, 40, 60, 80, 100];
    for (const step of steps) {
      setUploadProgress(step);
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      await simulateAIProcessing();

      // Carregar dados reais do backend
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const backendData = await fetchCurrentUserDashboard(year, month);
      if (!backendData) {
        throw new Error("Nenhum dado retornado do servidor");
      }

      const mappedData = mapBackendToDashboard(backendData);
      setDashboardData(mappedData);
      setHasData(true);
      setSelectedSection("overview");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao processar arquivo";
      console.error("Upload error:", err);
      setError(errorMsg);
      alert(`Erro ao carregar dashboard: ${errorMsg}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      event.target.value = "";
    }
  }

  function renderSection() {
    if (!dashboardData) return null;

    switch (selectedSection) {
      case "overview":
        return (
          <>
            <SummaryCards summary={dashboardData.summary} insights={dashboardData.insights} />
            <InsightsSection insights={dashboardData.insights} />
            <ChartsSection data={dashboardData} />
            <TransactionsSection transactions={dashboardData.transactions} />
          </>
        );
      case "invoices":
        return <InvoicesSection transactions={dashboardData.transactions} />;
      case "transactions":
        return <TransactionsSection transactions={dashboardData.transactions} />;
      case "charts":
        return <ChartsSection data={dashboardData} />;
      case "goals":
        return <GoalsSection />;
      case "insights":
        return <InsightsSection insights={dashboardData.insights} />;
      default:
        return null;
    }
  }

  // Estado inicial: aguardando upload da fatura
  if (!hasData) {
    return (
      <div
        className="ella-gradient-bg min-h-screen"
        style={{
          backgroundImage: "url(/background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <main className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
          <DashboardSidebar selected={selectedSection} onSelect={handleSelectSection} />
          <div className="flex-1">
            <UploadState
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              onFileUpload={handleFileUpload}
            />
          </div>
        </main>
      </div>
    );
  }

  if (!dashboardData) return null;

  // Estado com dados: seção de acordo com o menu
  return (
    <div
      className="ella-gradient-bg min-h-screen"
      style={{
        backgroundImage: "url(/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <main className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        <DashboardSidebar selected={selectedSection} onSelect={handleSelectSection} />

        <div className="flex-1 space-y-8">
          {/* Greeting */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-ella-navy text-2xl font-semibold">
                {`Bem-vinda${user?.name ? ", " + user.name : ""} 👋`}
              </h2>
              <p className="text-ella-subtile text-sm">Aqui está a visão geral das suas finanças</p>
            </div>
          </div>
          {renderSection()}
        </div>
      </main>
    </div>
  );
}

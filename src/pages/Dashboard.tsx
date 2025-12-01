// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../lib/auth";

import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { UploadState } from "../components/dashboard/UploadState";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { InsightsSection } from "../components/dashboard/InsightsSection";
import { ChartsSection } from "../components/dashboard/ChartsSection";
import { TransactionsSection } from "../components/dashboard/TransactionsSection";

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

export interface DashboardData {
  summary: DashboardSummary;
  transactions: DashboardTransaction[];
  insights: DashboardInsight[];
}

export default function DashboardPage() {
  const navigate = useNavigate();

  // Auth básica: se não tiver token, volta pro login
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [hasData, setHasData] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

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

    try {
      await simulateAIProcessing();

      // 🔮 MOCK – depois trocamos pelo retorno real do backend
      const mock: DashboardData = {
        summary: {
          balance: 15847.5,
          totalIncome: 8500,
          totalExpenses: 5234.8,
          savingsRate: 38,
        },
        transactions: [
          {
            id: 1,
            description: "Salário",
            amount: 8500,
            category: "Salário",
            date: "2025-11-01",
            type: "INCOME",
          },
          {
            id: 2,
            description: "Aluguel",
            amount: -2000,
            category: "Moradia",
            date: "2025-11-05",
            type: "EXPENSE",
          },
          {
            id: 3,
            description: "Supermercado",
            amount: -456.8,
            category: "Alimentação",
            date: "2025-11-08",
            type: "EXPENSE",
          },
          {
            id: 4,
            description: "Academia",
            amount: -120,
            category: "Saúde",
            date: "2025-11-10",
            type: "EXPENSE",
          },
          {
            id: 5,
            description: "Restaurante",
            amount: -180,
            category: "Alimentação",
            date: "2025-11-12",
            type: "EXPENSE",
          },
          {
            id: 6,
            description: "Uber",
            amount: -78,
            category: "Transporte",
            date: "2025-11-15",
            type: "EXPENSE",
          },
          {
            id: 7,
            description: "Freelance",
            amount: 1200,
            category: "Renda Extra",
            date: "2025-11-18",
            type: "INCOME",
          },
          {
            id: 8,
            description: "Netflix",
            amount: -45,
            category: "Entretenimento",
            date: "2025-11-20",
            type: "EXPENSE",
          },
          {
            id: 9,
            description: "Farmácia",
            amount: -85,
            category: "Saúde",
            date: "2025-11-22",
            type: "EXPENSE",
          },
          {
            id: 10,
            description: "Shopping",
            amount: -320,
            category: "Compras",
            date: "2025-11-25",
            type: "EXPENSE",
          },
        ],
        insights: [
          {
            id: 1,
            title: "Ótima taxa de poupança! 🎉",
            description:
              "Você está economizando 38% da sua renda mensal. Continue assim para atingir suas metas ainda mais rápido!",
            type: "TIP",
            priority: "HIGH",
          },
          {
            id: 2,
            title: "Gastos com alimentação aumentaram",
            description:
              "Seus gastos em restaurantes e delivery subiram 25% este mês. Que tal tentar cozinhar mais em casa?",
            type: "ALERT",
            priority: "MEDIUM",
          },
          {
            id: 3,
            title: "Oportunidade de investimento",
            description:
              "Com seu saldo atual, você pode começar a investir em renda fixa. Considere separar R$ 500/mês para construir sua reserva de emergência.",
            type: "SUGGESTION",
            priority: "HIGH",
          },
        ],
      };

      setDashboardData(mock);
      setHasData(true);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Erro ao processar arquivo. Tente novamente.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      event.target.value = "";
    }
  }

  // Estado inicial: aguardando upload da fatura
  if (!hasData) {
    return (
      <div className="ella-gradient-bg min-h-screen">
        <main className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
          <DashboardSidebar selected="overview" />
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

  // Estado com dados: cards + insights + gráficos + transações
  return (
    <div className="ella-gradient-bg min-h-screen">
      <main className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        <DashboardSidebar selected="overview" />

        <div className="flex-1 space-y-8">
          <SummaryCards
            summary={dashboardData.summary}
            insights={dashboardData.insights}
          />
          <InsightsSection insights={dashboardData.insights} />
          <ChartsSection data={dashboardData} />
          <TransactionsSection transactions={dashboardData.transactions} />
        </div>
      </main>
    </div>
  );
}

import { getConsentStatus } from "@/services/api/privacyService";
import type {
  DashboardInsight,
  DashboardInvoice,
  DashboardSummary,
  DashboardTransaction,
} from "@/types/dashboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChartsSection } from "../components/dashboard/ChartsSection";
import { CriticalTransactionAlert } from "../components/dashboard/CriticalTransactionAlert";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { GoalsSection } from "../components/dashboard/GoalsSection";
import { InsightsSection } from "../components/dashboard/InsightsSection";
import { InvoicesSection } from "../components/dashboard/InvoicesSection";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { TransactionsBoard } from "../components/dashboard/TransactionsBoard";
import { TransactionsSection } from "../components/dashboard/TransactionsSection";
import { UploadState } from "../components/dashboard/UploadState";
import { useAuth } from "../contexts/AuthContext";
import { ChartsController } from "../controllers/ChartsController";
import { GoalsController } from "../controllers/GoalsController";
import { InsightsController } from "../controllers/InsightsController";
import { InvoicesController } from "../controllers/InvoicesController";
import { SummaryController } from "../controllers/SummaryController";
import { TransactionsController } from "../controllers/TransactionsController";
import { updateTransaction } from "../services/api/transactionsService";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("overview");
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = sessionStorage.getItem("dashboard_date");
    return saved ? new Date(saved) : new Date();
  });
  const [showUpload, setShowUpload] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    sessionStorage.setItem("dashboard_date", date.toISOString());
  };

  const personId = user?.id;

  useEffect(() => {
    (async () => {
      try {
        const status = await getConsentStatus();
        if (!status?.hasConsent) navigate("/privacy", { replace: true });
      } catch {
        navigate("/privacy", { replace: true });
      }
    })();
  }, [navigate]);

  if (!personId)
    return <div className="flex h-screen items-center justify-center">Carregando usuário...</div>;

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  console.log("[Dashboard] Data selecionada:", selectedDate, { year, month });

  const mapInsights = (insights: any[]): DashboardInsight[] =>
    (Array.isArray(insights) ? insights : []).map((i: any, idx: number) => {
      const type = String(i?.type ?? "INFO");
      const typeUpper = type.toUpperCase();
      const priority: DashboardInsight["priority"] =
        typeUpper.includes("ALERT") || typeUpper.includes("WARN") ? "HIGH" : "LOW";
      return {
        id: Number(i?.id ?? idx + 1),
        title: String(i?.title ?? i?.category ?? "Insight"),
        description: String(i?.description ?? i?.message ?? ""),
        type,
        priority,
      };
    });

  const mapSummary = (data: any): DashboardSummary => {
    const balance = Number(data?.balance ?? 0);
    const totalIncome = Number(data?.totalIncome ?? 0);
    const totalExpenses = Number(data?.totalExpenses ?? 0);
    const savingsRate =
      data?.savingsRate != null
        ? Number(data.savingsRate)
        : totalIncome > 0
          ? Math.round((balance / totalIncome) * 100)
          : 0;

    return { balance, totalIncome, totalExpenses, savingsRate };
  };

  const mapTransactions = (transactions: any[]): DashboardTransaction[] =>
    (Array.isArray(transactions) ? transactions : []).map((t: any, idx: number) => ({
      id: String(t?.id ?? idx + 1),
      description: String(t?.description ?? ""),
      amount: Number(t?.amount ?? 0),
      category: String(t?.category ?? ""),
      date: String(t?.purchaseDate ?? t?.transactionDate ?? t?.date ?? ""),
      purchaseDate: t?.purchaseDate ? String(t.purchaseDate) : undefined,
      type: String(t?.type ?? "EXPENSE").toUpperCase() === "INCOME" ? "INCOME" : "EXPENSE",
      scope:
        String(t?.scope ?? "")
          .toUpperCase()
          .trim() === "BUSINESS"
          ? "BUSINESS"
          : String(t?.scope ?? "")
                .toUpperCase()
                .trim() === "PERSONAL"
            ? "PERSONAL"
            : undefined,
    }));

  return (
    <div className="ella-gradient-bg min-h-screen">
      <main className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 md:px-6">
        <DashboardSidebar
          selected={selectedSection}
          onSelect={setSelectedSection}
          onNewUpload={() => setShowUpload(true)}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        <div className="flex-1 space-y-6">
          <div className="mb-8">
            <h1 className="text-ella-navy text-2xl font-bold">Olá, {user.name} 👋</h1>
            <p className="text-ella-subtile">Aqui está a visão geral das suas finanças</p>
          </div>

          {selectedSection === "overview" && (
            <div key={refreshKey} className="space-y-6">
              <SummaryController personId={personId} year={year} month={month}>
                {({ data, loading }) => (
                  <InsightsController personId={personId} year={year} month={month}>
                    {({ data: insightsData, loading: insightsLoading }) => (
                      <InvoicesController personId={personId} year={year} month={month}>
                        {({ data: invoicesData, loading: invoicesLoading }) =>
                          loading || insightsLoading || invoicesLoading ? (
                            <div>Carregando resumo...</div>
                          ) : data && insightsData ? (
                            <SummaryCards
                              summary={mapSummary(data)}
                              insights={mapInsights(insightsData.insights)}
                              invoices={invoicesData?.invoices ?? []}
                            />
                          ) : null
                        }
                      </InvoicesController>
                    )}
                  </InsightsController>
                )}
              </SummaryController>

              <InsightsController personId={personId} year={year} month={month}>
                {({ data, loading }) =>
                  loading ? (
                    <div>Carregando insights...</div>
                  ) : data ? (
                    <InsightsSection insights={mapInsights(data.insights)} />
                  ) : null
                }
              </InsightsController>

              <ChartsController personId={personId} year={year} month={month}>
                {({ data, loading }) =>
                  loading ? (
                    <div>Carregando gráficos...</div>
                  ) : data ? (
                    <ChartsSection data={data} />
                  ) : null
                }
              </ChartsController>

              <TransactionsController personId={personId} filters={{ year, month, size: 5 }}>
                {({ data, loading }) =>
                  loading ? (
                    <div>Carregando transações...</div>
                  ) : data ? (
                    <>
                      <CriticalTransactionAlert
                        personId={personId}
                        transactions={mapTransactions(data.transactions)}
                        onCategoryUpdated={() => setRefreshKey((k) => k + 1)}
                        onConfirmCategory={async (tx, category) => {
                          const safeDate =
                            tx.date && tx.date.trim()
                              ? tx.date
                              : new Date().toISOString().slice(0, 10);
                          await updateTransaction(tx.id, {
                            personId,
                            description: tx.description,
                            amount: Number(tx.amount ?? 0),
                            type: tx.type,
                            scope: tx.scope,
                            category,
                            transactionDate: safeDate,
                            dueDate: null,
                            paidDate: null,
                            status: "PENDING",
                          });
                        }}
                      />
                      <TransactionsSection transactions={mapTransactions(data.transactions)} />
                    </>
                  ) : null
                }
              </TransactionsController>
            </div>
          )}

          {selectedSection === "invoices" && (
            <InvoicesController key={refreshKey} personId={personId} year={year} month={month}>
              {({
                data,
                loading,
                refresh,
              }: {
                data: { invoices: DashboardInvoice[] } | null;
                loading: boolean;
                refresh: () => void;
              }) =>
                loading ? (
                  <div>Carregando faturas...</div>
                ) : data ? (
                  <InvoicesSection invoices={data.invoices} onRefresh={refresh} />
                ) : null
              }
            </InvoicesController>
          )}

          {selectedSection === "transactions" && (
            <TransactionsBoard personId={personId} referenceDate={selectedDate} />
          )}

          {selectedSection === "charts" && (
            <ChartsController key={refreshKey} personId={personId} year={year} month={month}>
              {({ data, loading }) =>
                loading ? (
                  <div>Carregando gráficos...</div>
                ) : data ? (
                  <ChartsSection data={data} />
                ) : null
              }
            </ChartsController>
          )}

          {selectedSection === "goals" && (
            <GoalsController key={refreshKey} personId={personId}>
              {({ data, loading, refresh }) =>
                loading ? (
                  <div>Carregando metas...</div>
                ) : data ? (
                  <GoalsSection goals={data.goals} onRefresh={refresh} />
                ) : null
              }
            </GoalsController>
          )}

          {selectedSection === "insights" && (
            <InsightsController key={refreshKey} personId={personId} year={year} month={month}>
              {({ data, loading }) =>
                loading ? (
                  <div>Carregando insights...</div>
                ) : data ? (
                  <InsightsSection insights={mapInsights(data.insights)} />
                ) : null
              }
            </InsightsController>
          )}
        </div>
      </main>
      {showUpload && (
        <UploadState
          onClose={() => setShowUpload(false)}
          onSuccess={(result) => {
            const targetDateStr = result?.endDate || result?.startDate;
            if (targetDateStr) {
              const parsed = new Date(targetDateStr);
              if (!Number.isNaN(parsed.getTime())) {
                handleDateChange(parsed);
              }
            }
            setRefreshKey((k) => k + 1);
            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
}

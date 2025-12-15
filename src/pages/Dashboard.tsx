import { getConsentHistory } from "@/services/api/privacyService";
import type { DashboardInvoice } from "@/types/dashboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChartsSection } from "../components/dashboard/ChartsSection";
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
        const history = await getConsentHistory();
        if (!history || history.length === 0) {
          navigate("/privacy", { replace: true });
        }
      } catch {
        navigate("/privacy", { replace: true });
      }
    })();
  }, [navigate]);

  if (!personId)
    return <div className="flex h-screen items-center justify-center">Carregando usuário...</div>;

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

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
            <h1 className="text-ella-navy text-2xl font-bold">Bem-vinda, {user.name} 👋</h1>
            <p className="text-ella-subtile">Aqui está a visão geral das suas finanças</p>
          </div>

          {selectedSection === "overview" && (
            <div key={refreshKey} className="space-y-6">
              <SummaryController personId={personId} year={year} month={month}>
                {({ data, loading }) => (
                  <InsightsController personId={personId} year={year} month={month}>
                    {({ data: insightsData, loading: insightsLoading }) =>
                      loading || insightsLoading ? (
                        <div>Carregando resumo...</div>
                      ) : data && insightsData ? (
                        <SummaryCards summary={data} insights={insightsData.insights} />
                      ) : null
                    }
                  </InsightsController>
                )}
              </SummaryController>

              <InsightsController personId={personId} year={year} month={month}>
                {({ data, loading }) =>
                  loading ? (
                    <div>Carregando insights...</div>
                  ) : data ? (
                    <InsightsSection insights={data.insights} />
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
                    <TransactionsSection transactions={data.transactions} />
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
              }: {
                data: { invoices: DashboardInvoice[] } | null;
                loading: boolean;
              }) =>
                loading ? (
                  <div>Carregando faturas...</div>
                ) : data ? (
                  <InvoicesSection invoices={data.invoices} />
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
                  <InsightsSection insights={data.insights} />
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

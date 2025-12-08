import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { SummaryController } from "../controllers/SummaryController";
import { TransactionsController } from "../controllers/TransactionsController";
import { ChartsController } from "../controllers/ChartsController";
import { InvoicesController } from "../controllers/InvoicesController";
import { GoalsController } from "../controllers/GoalsController";
import { InsightsController } from "../controllers/InsightsController";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { InsightsSection } from "../components/dashboard/InsightsSection";
import { ChartsSection } from "../components/dashboard/ChartsSection";
import { TransactionsSection } from "../components/dashboard/TransactionsSection";
import { InvoicesSection } from "../components/dashboard/InvoicesSection";
import { GoalsSection } from "../components/dashboard/GoalsSection";
import { UploadState } from "../components/dashboard/UploadState";

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState("overview");
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = sessionStorage.getItem("dashboard_date");
    return saved ? new Date(saved) : new Date();
  });
  const [showUpload, setShowUpload] = useState(false);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    sessionStorage.setItem("dashboard_date", date.toISOString());
  };

  const personId = user?.id;

  if (!personId) return <div className="flex h-screen items-center justify-center">Carregando usuário...</div>;

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  return (
    <div className="ella-gradient-bg min-h-screen" style={{ backgroundImage: "url(/background.png)", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <main className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        <DashboardSidebar
          selected={selectedSection}
          onSelect={setSelectedSection}
          onNewUpload={() => setShowUpload(true)}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        <div className="flex-1 space-y-6">
             <div className="mb-8">
                <h1 className="text-2xl font-bold text-ella-navy">
                  Bem-vinda, {user.name} 👋
                </h1>
                <p className="text-ella-subtile">
                  Aqui está a visão geral das suas finanças
                </p>
              </div>

          {selectedSection === "overview" && (
            <>
              <SummaryController personId={personId} year={year} month={month}>
                {({ data, loading }) => (
                   <InsightsController personId={personId} year={year} month={month}>
                     {({ data: insightsData, loading: insightsLoading }) => (
                        (loading || insightsLoading) ? <div>Carregando resumo...</div> :
                        (data && insightsData) ? <SummaryCards summary={data} insights={insightsData.insights} /> : null
                     )}
                   </InsightsController>
                )}
              </SummaryController>

              <InsightsController personId={personId} year={year} month={month}>
                 {({ data, loading }) => (
                    loading ? <div>Carregando insights...</div> :
                    data ? <InsightsSection insights={data.insights} /> : null
                 )}
              </InsightsController>

              <ChartsController personId={personId} year={year}>
                 {({ data, loading }) => (
                    loading ? <div>Carregando gráficos...</div> :
                    data ? <ChartsSection data={data} /> : null
                 )}
              </ChartsController>

              <TransactionsController personId={personId} year={year} month={month} limit={5}>
                 {({ data, loading }) => (
                    loading ? <div>Carregando transações...</div> :
                    data ? <TransactionsSection transactions={data.transactions} /> : null
                 )}
              </TransactionsController>
            </>
          )}

          {selectedSection === "invoices" && (
             <InvoicesController personId={personId} year={year} month={month}>
                {({ data, loading }) => (
                   loading ? <div>Carregando faturas...</div> :
                   data ? <InvoicesSection invoices={data.invoices} /> : null
                )}
             </InvoicesController>
          )}

          {selectedSection === "transactions" && (
             <TransactionsController personId={personId} year={year} month={month} limit={50}>
                {({ data, loading }) => (
                   loading ? <div>Carregando transações...</div> :
                   data ? <TransactionsSection transactions={data.transactions} /> : null
                )}
             </TransactionsController>
          )}

          {selectedSection === "charts" && (
             <ChartsController personId={personId} year={year}>
                {({ data, loading }) => (
                   loading ? <div>Carregando gráficos...</div> :
                   data ? <ChartsSection data={data} /> : null
                )}
             </ChartsController>
          )}

          {selectedSection === "goals" && (
             <GoalsController personId={personId}>
                {({ data, loading, refresh }) => (
                   loading ? <div>Carregando metas...</div> :
                   data ? <GoalsSection goals={data.goals} onRefresh={refresh} /> : null
                )}
             </GoalsController>
          )}

          {selectedSection === "insights" && (
             <InsightsController personId={personId} year={year} month={month}>
                {({ data, loading }) => (
                   loading ? <div>Carregando insights...</div> :
                   data ? <InsightsSection insights={data.insights} /> : null
                )}
             </InsightsController>
          )}
        </div>
      </main>
      {showUpload && <UploadState onClose={() => setShowUpload(false)} onSuccess={() => { /* Refresh data? */ }} />}
    </div>
  );
}

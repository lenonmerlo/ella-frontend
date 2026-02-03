import { getConsentStatus } from "@/services/api/privacyService";
import type {
  DashboardInsight,
  DashboardInvoice,
  DashboardSummary,
  DashboardTransaction,
} from "@/types/dashboard";
import { Menu, X } from "lucide-react";
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
import {
  fetchBankStatementsDashboard,
  type BankStatementDashboardResponseDTO,
} from "../services/api/bankStatementsDashboardService";
import { updateTransaction } from "../services/api/transactionsService";
import { tryParseISODateLike } from "../utils/date";
import BudgetPage from "./BudgetPage";
import InvestmentPage from "./InvestmentPage";
import PatrimonioPage from "./PatrimonioPage";
import ScorePage from "./ScorePage";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = sessionStorage.getItem("dashboard_date");
    return saved ? new Date(saved) : new Date();
  });
  const [showUpload, setShowUpload] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [bankDashboard, setBankDashboard] = useState<BankStatementDashboardResponseDTO | null>(
    null,
  );
  const [bankDashboardLoading, setBankDashboardLoading] = useState(false);
  const [bankDashboardError, setBankDashboardError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen]);

  if (!personId)
    return <div className="flex h-screen items-center justify-center">Carregando usuário...</div>;

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  console.log("[Dashboard] Data selecionada:", selectedDate, { year, month });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!personId) return;
      setBankDashboardLoading(true);
      setBankDashboardError(null);
      try {
        const data = await fetchBankStatementsDashboard(personId, year, month);
        if (!cancelled) setBankDashboard(data);
      } catch (e: any) {
        if (!cancelled) {
          setBankDashboard(null);
          setBankDashboardError(String(e?.message ?? "Erro ao carregar extrato"));
        }
      } finally {
        if (!cancelled) setBankDashboardLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [personId, year, month, refreshKey]);

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

  const formatLocalDatePtBr = (raw: string) => {
    const s = String(raw ?? "").trim();
    if (!s) return "";
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      return `${m[3]}/${m[2]}/${m[1]}`;
    }
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString("pt-BR");
  };

  return (
    <div className="ella-gradient-bg min-h-screen">
      {/* Mobile header */}
      <div className="border-ella-muted/40 bg-ella-card/70 sticky top-0 z-40 border-b backdrop-blur lg:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <button
            type="button"
            className="border-ella-muted text-ella-navy bg-ella-card/80 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={mobileNavOpen}
          >
            <Menu size={18} />
            Menu
          </button>
          <div className="text-right">
            <p className="text-ella-navy text-sm font-semibold">Dashboard</p>
            <p className="text-ella-subtile text-xs">Visão geral das finanças</p>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Fechar menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative h-full w-full max-w-sm p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-ella-navy text-sm font-semibold">Navegação</p>
              <button
                type="button"
                className="border-ella-muted text-ella-navy bg-ella-card rounded-lg border px-3 py-2 text-sm font-semibold"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
            <DashboardSidebar
              mode="drawer"
              selected={selectedSection}
              onSelect={(id) => {
                setSelectedSection(id);
                setMobileNavOpen(false);
              }}
              onNewUpload={() => {
                setShowUpload(true);
                setMobileNavOpen(false);
              }}
              selectedDate={selectedDate}
              onDateChange={(date) => {
                handleDateChange(date);
              }}
            />
          </div>
        </div>
      )}

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
                        {({ data: invoicesData, loading: invoicesLoading }) => (
                          <GoalsController personId={personId}>
                            {({ data: goalsData, loading: goalsLoading }) =>
                              loading || insightsLoading || invoicesLoading || goalsLoading ? (
                                <div>Carregando resumo...</div>
                              ) : data && insightsData ? (
                                <SummaryCards
                                  personId={personId}
                                  summary={mapSummary(data)}
                                  insights={mapInsights(insightsData.insights)}
                                  goalsCount={goalsData?.goals?.length ?? 0}
                                  invoices={invoicesData?.invoices ?? []}
                                  bankStatementSummary={bankDashboard?.summary ?? null}
                                  bankStatementLoading={bankDashboardLoading}
                                  onOpenInvestments={() => setSelectedSection("investments")}
                                  onOpenBudget={() => setSelectedSection("budget")}
                                  onOpenScore={() => setSelectedSection("score")}
                                />
                              ) : null
                            }
                          </GoalsController>
                        )}
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

          {selectedSection === "bank-statements" && (
            <div className="space-y-6">
              <div className="bg-ella-card rounded-lg p-6 shadow-sm">
                <h2 className="text-ella-navy mb-4 text-lg font-semibold">Movimentação C/C</h2>
                {bankDashboardLoading ? (
                  <p className="text-ella-subtile">Carregando extrato...</p>
                ) : bankDashboardError ? (
                  <p className="text-ella-subtile">{bankDashboardError}</p>
                ) : !bankDashboard?.transactions?.length ? (
                  <p className="text-ella-subtile">Sem movimentações no período.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-ella-subtile border-b">
                          <th className="px-3 py-2 text-left font-semibold">Data</th>
                          <th className="px-3 py-2 text-left font-semibold">Descrição</th>
                          <th className="px-3 py-2 text-right font-semibold">Valor</th>
                          <th className="px-3 py-2 text-right font-semibold">Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bankDashboard.transactions.map((t) => {
                          const amount = Number(t.amount ?? 0);
                          const balance = t.balance != null ? Number(t.balance) : null;
                          const isIncome = amount >= 0;
                          const date = t.transactionDate
                            ? formatLocalDatePtBr(t.transactionDate)
                            : "";

                          return (
                            <tr key={t.id} className="border-b last:border-0">
                              <td className="text-ella-subtile px-3 py-2 whitespace-nowrap">
                                {date}
                              </td>
                              <td className="text-ella-navy px-3 py-2">{t.description}</td>
                              <td
                                className={`px-3 py-2 text-right whitespace-nowrap ${
                                  isIncome ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {"R$\u00A0"}
                                {Math.abs(amount).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td className="text-ella-subtile px-3 py-2 text-right whitespace-nowrap">
                                {balance == null
                                  ? "—"
                                  : `R$\u00A0${balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
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

          {selectedSection === "score" && <ScorePage />}

          {selectedSection === "budget" && <BudgetPage />}

          {selectedSection === "investments" && <InvestmentPage />}

          {selectedSection === "patrimonio" && <PatrimonioPage />}
        </div>
      </main>
      {showUpload && (
        <UploadState
          onClose={() => setShowUpload(false)}
          onSuccess={(result) => {
            const targetDateStr = result?.endDate || result?.startDate;
            if (targetDateStr) {
              const parsed = tryParseISODateLike(targetDateStr);
              if (parsed) handleDateChange(parsed);
            }
            setRefreshKey((k) => k + 1);
            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
}

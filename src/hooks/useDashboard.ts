import { useEffect, useState } from "react";
import { getToken } from "../lib/auth";
import {
  fetchCurrentUserDashboard,
  fetchDashboard,
  getInvoices,
  getPersonIdFromToken,
  uploadInvoice,
  type DashboardDataLocal,
  type DashboardResponseDTO,
} from "../lib/dashboard";
import { mapBackendToDashboard } from "../lib/mappers/dashboardMapper";
import type { DashboardData, SectionId } from "../types/dashboard";

export function useDashboard(navigate?: (path: string) => void) {
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionId>("overview");
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = sessionStorage.getItem("dashboard_date");
    return saved ? new Date(saved) : new Date();
  });

  // Redirect to login if no token
  useEffect(() => {
    const token = getToken();
    if (!token && navigate) navigate("/auth/login");
  }, [navigate]);

  async function loadDashboardData(date = selectedDate) {
    try {
      setIsLoading(true);
      setError(null);
      // Persist date
      sessionStorage.setItem("dashboard_date", date.toISOString());

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const backendData = await fetchCurrentUserDashboard(year, month);
      console.log("[Dashboard] backendData (quick or full):", backendData);
      if (!backendData) {
        setDashboardData({
          summary: { balance: 0, totalIncome: 0, totalExpenses: 0, savingsRate: 0 },
          transactions: [],
          insights: [
            {
              id: 1,
              title: "Bem-vindo ao Ella! 👋",
              description:
                "Faça upload da sua primeira fatura para começar a acompanhar suas finanças.",
              type: "INFO",
              priority: "HIGH",
            },
          ],
          monthly: [],
        });
        setHasData(true);
        return;
      }

      let mapped: DashboardData | null = null;
      try {
        mapped = mapBackendToDashboard(backendData as DashboardResponseDTO);
      } catch (e) {
        console.error("[Dashboard] Erro ao mapear dados do backend:", e);
      }
      console.log("[Dashboard] mapped:", mapped);
      setDashboardData(mapped);
      setHasData(true);
      setSelectedSection("overview");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao carregar dashboard";
      setError(errorMsg);
      setDashboardData({
        summary: { balance: 0, totalIncome: 0, totalExpenses: 0, savingsRate: 0 },
        transactions: [],
        insights: [
          {
            id: 1,
            title: "Bem-vindo ao Ella! 👋",
            description:
              "Faça upload da sua primeira fatura para começar a acompanhar suas finanças.",
            type: "INFO",
            priority: "HIGH",
          },
        ],
        monthly: [],
      });
      setHasData(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData(selectedDate);
    getInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  function handleDateChange(date: Date) {
    setSelectedDate(date);
  }

  function handleSelectSection(id: string) {
    setSelectedSection(id as SectionId);
  }

  async function simulateAIProcessing() {
    const steps = [20, 40, 60, 80, 100];
    for (const step of steps) {
      setUploadProgress(step);
      // biome-ignore lint/suspicious/noAsyncPromiseExecutor: simple delay
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

      const uploaded: DashboardDataLocal = await uploadInvoice(file);
      console.log("[Upload] parsed local data:", uploaded);

      const latestTxDate = uploaded.transactions
        .map((t) => new Date(t.date))
        .filter((d) => !Number.isNaN(d.getTime()))
        .sort((a, b) => b.getTime() - a.getTime())[0];

      if (latestTxDate) {
        const year = latestTxDate.getFullYear();
        const month = latestTxDate.getMonth() + 1;
        try {
          // Atualiza a data selecionada para a data da fatura
          setSelectedDate(latestTxDate);

          const personId = getPersonIdFromToken();
          if (!personId) throw new Error("Token sem personId");
          const backendData = await fetchDashboard(personId, year, month);
          console.log("[Upload] backend dashboard for period:", { year, month }, backendData);
          if (backendData) {
            let mapped: DashboardData | null = null;
            try {
              mapped = mapBackendToDashboard(backendData);
            } catch (e) {
              console.error("[Upload] Erro ao mapear dados do backend:", e);
            }
            console.log("[Upload] mapped:", mapped);
            setDashboardData(mapped);
            setHasData(true);
            setSelectedSection("overview");
            const invoices = await getInvoices();
            console.log("[Upload] invoices:", invoices);
          } else {
            await loadDashboardData(latestTxDate);
          }
        } catch {
          await loadDashboardData(latestTxDate);
        }
      } else {
        await loadDashboardData();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao processar arquivo";
      setError(errorMsg);
      // Surface error to the page if needed
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      event.target.value = "";
    }
  }

  return {
    // state
    hasData,
    isLoading,
    isUploading,
    uploadProgress,
    dashboardData,
    selectedSection,
    error,
    showUpload,
    selectedDate,
    // actions
    setShowUpload,
    handleSelectSection,
    handleFileUpload,
    handleDateChange,
  };
}

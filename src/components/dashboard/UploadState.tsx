// src/components/dashboard/UploadState.tsx
import {
  CheckCircle,
  FileText,
  Loader,
  PieChart as PieChartIcon,
  Sparkles,
  TrendingUp,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import type { DashboardDataLocal } from "../../lib/dashboard";
import {
  uploadBankStatement,
  type BankStatementUploadResponse,
} from "../../services/api/bankStatementUploadService";
import { applyTrip } from "../../services/api/tripService";
import { uploadInvoice } from "../../services/api/uploadService";
import { formatDatePtBR } from "../../utils/date";
import { InfoModal } from "../shared/InfoModal";

interface Props {
  onClose: () => void;
  onSuccess: (result?: DashboardDataLocal | { startDate?: string; endDate?: string }) => void;
}

export function UploadState({ onClose, onSuccess }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [password, setPassword] = useState("");
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultToReturn, setResultToReturn] = useState<DashboardDataLocal | null>(null);
  const [tripIsApplying, setTripIsApplying] = useState(false);
  const [uploadType, setUploadType] = useState<"CREDIT_CARD" | "BANK_STATEMENT" | null>(null);
  const [bankStatementResult, setBankStatementResult] =
    useState<BankStatementUploadResponse | null>(null);
  const [bankStatementBank, setBankStatementBank] = useState<"ITAU" | "C6" | "NUBANK" | "BRADESCO">(
    "ITAU",
  );

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState<string>("");
  const [infoModalMessage, setInfoModalMessage] = useState<string>("");

  function showInfoModal(title: string, message: string) {
    setInfoModalTitle(title);
    setInfoModalMessage(message);
    setInfoModalOpen(true);
  }

  async function processUpload(file: File, pwd?: string) {
    setIsUploading(true);
    setIsPasswordRequired(false);
    setUploadProgress(10);
    setErrorMessage(null);
    setResultToReturn(null);
    setBankStatementResult(null);

    try {
      // Simulate progress steps
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);

      let result: DashboardDataLocal | undefined;

      if (uploadType === "CREDIT_CARD") {
        // Upload de cartão de crédito (existente)
        result = await uploadInvoice(file, pwd);
      } else if (uploadType === "BANK_STATEMENT") {
        // Upload de extrato bancário (novo)
        const bankResult = await uploadBankStatement(file, pwd, bankStatementBank);
        setBankStatementResult(bankResult);
        clearInterval(interval);
        setUploadProgress(100);
        setIsUploading(false);
        return; // Mostrar tela de sucesso de extrato
      }

      clearInterval(interval);
      setUploadProgress(100);

      setTimeout(() => {
        if (!result) {
          setIsUploading(false);
          return;
        }

        if (result.tripSuggestion) {
          setIsUploading(false);
          setResultToReturn(result);
          return;
        }
        onSuccess(result);
        onClose();
      }, 1000);
    } catch (error: any) {
      console.error(error);
      setIsUploading(false);
      setUploadProgress(0);

      const msg = error.response?.data?.message || error.message || "Erro ao fazer upload";

      if (/requisi\S*\s+expirou/i.test(String(msg)) || /timeout/i.test(String(msg))) {
        showInfoModal(
          "Processando",
          "Processando… pode levar até 2 min. Se demorar, atualize a lista.",
        );
        return;
      }

      if (msg.toLowerCase().includes("senha") || msg.toLowerCase().includes("password")) {
        setIsPasswordRequired(true);
        setErrorMessage(msg);
      } else {
        showInfoModal("Erro no upload", String(msg));
      }
    }
  }

  async function handleApplyTrip() {
    if (!resultToReturn?.tripSuggestion) return;
    try {
      setTripIsApplying(true);
      await applyTrip(
        resultToReturn.tripSuggestion.tripId,
        resultToReturn.tripSuggestion.transactionIds,
      );
      onSuccess(resultToReturn);
      onClose();
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Erro ao aplicar sugestão de viagem";
      showInfoModal("Erro", String(msg));
    } finally {
      setTripIsApplying(false);
    }
  }

  function handleIgnoreTrip() {
    if (!resultToReturn) return;
    onSuccess(resultToReturn);
    onClose();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!uploadType) {
      showInfoModal("Atenção", "Selecione o tipo de documento");
      return;
    }

    setFileToUpload(file);
    processUpload(file);
  }

  function handleCloseTypeSelection() {
    setUploadType(null);
    setFileToUpload(null);
  }

  function handleCloseBankStatementResult() {
    const statementDate = bankStatementResult?.statementDate;
    setBankStatementResult(null);
    if (statementDate) {
      onSuccess({ startDate: statementDate, endDate: statementDate });
    } else {
      onSuccess();
    }
    onClose();
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fileToUpload) return;

    if (isPasswordRequired && !password) return;

    processUpload(fileToUpload, password || undefined);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-ella-card relative w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl">
        <InfoModal
          open={infoModalOpen}
          title={infoModalTitle}
          message={infoModalMessage}
          onClose={() => setInfoModalOpen(false)}
        />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-600"
          disabled={isUploading}
        >
          <X size={24} />
        </button>

        {/* Tela de Sucesso - Extrato Bancário */}
        {bankStatementResult ? (
          <div className="ella-glass p-12 text-center">
            <div
              className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(201, 164, 59, 0.1)" }}
            >
              <CheckCircle size={48} style={{ color: "#C9A43B" }} />
            </div>
            <h2 className="text-ella-navy mb-4 text-2xl font-semibold">
              Extrato Processado com Sucesso!
            </h2>
            <p className="text-ella-subtile mx-auto mb-8 max-w-2xl text-sm">
              {bankStatementResult.transactionCount} transações importadas de{" "}
              {formatDatePtBR(bankStatementResult.statementDate)}
            </p>

            <div className="mx-auto mb-8 max-w-md space-y-3 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-ella-subtile">Saldo Inicial:</span>
                <span className="text-ella-navy font-semibold">
                  R$ {bankStatementResult.openingBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ella-subtile">Saldo Final:</span>
                <span className="text-ella-navy font-semibold">
                  R$ {bankStatementResult.closingBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ella-subtile">Limite Disponível:</span>
                <span className="text-ella-navy font-semibold">
                  R$ {bankStatementResult.availableLimit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ella-subtile">Total Recebido:</span>
                <span className="font-semibold text-emerald-600">
                  R$ {bankStatementResult.totalIncome.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ella-subtile">Total Debitado:</span>
                <span className="font-semibold text-red-600">
                  R$ {bankStatementResult.totalExpenses.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCloseBankStatementResult}
              className="w-full rounded-xl px-8 py-4 text-sm font-medium shadow-lg transition-all hover:opacity-90"
              style={{ backgroundColor: "#C9A43B", color: "#FFFFFF" }}
            >
              Concluído
            </button>
          </div>
        ) : uploadType === null ? (
          /* Tela de Seleção de Tipo */
          <div className="ella-glass p-12 text-center">
            <div
              className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(201, 164, 59, 0.1)" }}
            >
              <FileText size={48} style={{ color: "#C9A43B" }} />
            </div>

            <h2 className="text-ella-navy mb-4 text-2xl font-semibold">Qual tipo de documento?</h2>
            <p className="text-ella-subtile mx-auto mb-10 max-w-md text-sm">
              Escolha se deseja enviar uma fatura de cartão de crédito ou um extrato bancário.
            </p>

            <div className="mx-auto flex max-w-md flex-col gap-4">
              <button
                onClick={() => setUploadType("CREDIT_CARD")}
                className="rounded-xl border-2 border-gray-200 px-8 py-6 text-left transition-all hover:border-[#C9A43B] hover:bg-amber-50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "rgba(201, 164, 59, 0.1)" }}
                  >
                    <FileText size={24} style={{ color: "#C9A43B" }} />
                  </div>
                  <div>
                    <h3 className="text-ella-navy font-semibold">Cartão de Crédito</h3>
                    <p className="text-ella-subtile text-sm">Fatura do cartão de crédito</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setUploadType("BANK_STATEMENT")}
                className="rounded-xl border-2 border-gray-200 px-8 py-6 text-left transition-all hover:border-[#C9A43B] hover:bg-amber-50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "rgba(201, 164, 59, 0.1)" }}
                  >
                    <TrendingUp size={24} style={{ color: "#C9A43B" }} />
                  </div>
                  <div>
                    <h3 className="text-ella-navy font-semibold">Extrato Bancário</h3>
                    <p className="text-ella-subtile text-sm">Extrato da conta corrente</p>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={handleCloseTypeSelection}
              className="text-ella-subtile hover:text-ella-navy mt-6 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : resultToReturn?.tripSuggestion ? (
          <div className="ella-glass p-12 text-center">
            <div
              className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(201, 164, 59, 0.1)" }}
            >
              <Sparkles size={48} style={{ color: "#C9A43B" }} />
            </div>
            <h2 className="text-ella-navy mb-4 text-2xl font-semibold">
              Possível viagem detectada
            </h2>
            <p className="text-ella-subtile mx-auto mb-8 max-w-2xl text-sm">
              {resultToReturn.tripSuggestion.message ||
                "Identificamos um conjunto de transações que parece uma viagem. Quer agrupar como 'Viagem' preservando a categoria original como subcategoria?"}
            </p>

            <div className="mx-auto flex max-w-md flex-col gap-3">
              <button
                onClick={handleApplyTrip}
                disabled={tripIsApplying}
                className="w-full rounded-xl px-8 py-4 text-sm font-medium shadow-lg transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#C9A43B", color: "#FFFFFF" }}
              >
                {tripIsApplying ? "Aplicando..." : "Sim, agrupar como Viagem"}
              </button>
              <button
                onClick={handleIgnoreTrip}
                disabled={tripIsApplying}
                className="w-full rounded-xl border px-8 py-4 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-60"
              >
                Não, ignorar
              </button>
            </div>
          </div>
        ) : isPasswordRequired ? (
          <div className="ella-glass p-12 text-center">
            <div
              className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(201, 164, 59, 0.1)" }}
            >
              <FileText size={48} style={{ color: "#C9A43B" }} />
            </div>
            <h2 className="text-ella-navy mb-4 text-2xl font-semibold">Arquivo Protegido</h2>
            <p className="text-ella-subtile mx-auto mb-6 max-w-md text-sm">{errorMessage}</p>
            <form onSubmit={handlePasswordSubmit} className="mx-auto max-w-xs space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha do PDF"
                className="w-full rounded-lg border p-3 outline-none focus:border-[#C9A43B]"
                autoFocus
              />
              <button
                type="submit"
                className="w-full rounded-xl px-8 py-4 text-sm font-medium shadow-lg transition-all hover:opacity-90"
                style={{ backgroundColor: "#C9A43B", color: "#FFFFFF" }}
              >
                Tentar Novamente
              </button>
            </form>
          </div>
        ) : isUploading ? (
          <div className="ella-glass p-12 text-center">
            <div
              className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(201, 164, 59, 0.1)" }}
            >
              <Loader className="animate-spin" size={48} style={{ color: "#C9A43B" }} />
            </div>

            <h2 className="text-ella-navy mb-4 text-2xl font-semibold">Processando com IA...</h2>
            <p className="text-ella-subtile mb-8 text-sm">
              A ELLA está analisando seu documento e extraindo informações financeiras.
            </p>

            {/* Barra de progresso */}
            <div className="mx-auto max-w-md">
              <div className="bg-ella-background h-3 w-full overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${uploadProgress}%`,
                    backgroundColor: "#C9A43B",
                  }}
                />
              </div>
              <p className="text-ella-subtile mt-3 text-sm">{uploadProgress}% concluído</p>
            </div>

            {/* Etapas */}
            <div className="mx-auto mt-10 max-w-sm space-y-3 text-left text-sm">
              {[
                { step: 20, label: "Lendo documento PDF" },
                { step: 40, label: "Extraindo transações" },
                { step: 60, label: "Categorizando gastos" },
                { step: 80, label: "Gerando insights inteligentes" },
                { step: 100, label: "Finalizando análise" },
              ].map(({ step, label }) => (
                <div
                  key={step}
                  className={`flex items-center gap-3 ${
                    uploadProgress >= step ? "text-ella-navy" : "text-ella-subtile"
                  }`}
                >
                  {uploadProgress >= step ? (
                    <CheckCircle size={18} className="text-emerald-500" />
                  ) : (
                    <div className="border-ella-muted h-4 w-4 rounded-full border-2" />
                  )}
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="ella-glass p-12 text-center">
            <div
              className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(201, 164, 59, 0.1)" }}
            >
              <FileText size={48} style={{ color: "#C9A43B" }} />
            </div>

            <h2 className="text-ella-navy mb-4 text-2xl font-semibold">
              {uploadType === "CREDIT_CARD" ? "Enviar Fatura de Cartão" : "Enviar Extrato Bancário"}
            </h2>
            <p className="text-ella-subtile mx-auto mb-10 max-w-md text-sm">
              {uploadType === "CREDIT_CARD"
                ? "Envie uma fatura bancária em PDF ou CSV. A ELLA vai analisar automaticamente suas transações."
                : "Envie um extrato bancário em PDF. A ELLA vai importar suas movimentações."}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              {uploadType === "BANK_STATEMENT" && (
                <div className="border-ella-muted bg-ella-card flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
                  <span className="text-ella-subtile">Banco:</span>
                  <button
                    type="button"
                    onClick={() => setBankStatementBank("ITAU")}
                    className={`rounded-lg px-3 py-1 transition-colors ${
                      bankStatementBank === "ITAU"
                        ? "text-ella-navy bg-amber-100"
                        : "text-ella-subtile hover:bg-black/5"
                    }`}
                  >
                    Itaú
                  </button>
                  <button
                    type="button"
                    onClick={() => setBankStatementBank("C6")}
                    className={`rounded-lg px-3 py-1 transition-colors ${
                      bankStatementBank === "C6"
                        ? "text-ella-navy bg-amber-100"
                        : "text-ella-subtile hover:bg-black/5"
                    }`}
                  >
                    C6
                  </button>
                  <button
                    type="button"
                    onClick={() => setBankStatementBank("NUBANK")}
                    className={`rounded-lg px-3 py-1 transition-colors ${
                      bankStatementBank === "NUBANK"
                        ? "text-ella-navy bg-amber-100"
                        : "text-ella-subtile hover:bg-black/5"
                    }`}
                  >
                    Nubank
                  </button>
                  <button
                    type="button"
                    onClick={() => setBankStatementBank("BRADESCO")}
                    className={`rounded-lg px-3 py-1 transition-colors ${
                      bankStatementBank === "BRADESCO"
                        ? "text-ella-navy bg-amber-100"
                        : "text-ella-subtile hover:bg-black/5"
                    }`}
                  >
                    Bradesco
                  </button>
                </div>
              )}
              <label className="inline-block cursor-pointer">
                <input
                  type="file"
                  accept={uploadType === "CREDIT_CARD" ? ".pdf,.csv" : ".pdf"}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  className="inline-flex items-center gap-3 rounded-xl px-8 py-4 text-sm font-medium shadow-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: "#C9A43B", color: "#FFFFFF" }}
                >
                  <Upload size={24} />
                  <span>
                    {uploadType === "CREDIT_CARD"
                      ? "Enviar Fatura (PDF/CSV)"
                      : "Enviar Extrato (PDF)"}
                  </span>
                </div>
              </label>

              <button
                onClick={() => setUploadType(null)}
                className="text-ella-subtile hover:text-ella-navy inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5"
              >
                ← Voltar
              </button>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
              <div className="bg-ella-background rounded-xl p-6">
                <Sparkles size={32} className="mb-3" style={{ color: "#C9A43B" }} />
                <h4 className="text-ella-navy mb-2 text-sm font-semibold">
                  {uploadType === "CREDIT_CARD" ? "Análise com IA" : "Importação com IA"}
                </h4>
                <p className="text-ella-subtile text-sm">
                  {uploadType === "CREDIT_CARD"
                    ? "Processamento inteligente de suas faturas."
                    : "Leitura inteligente do seu extrato e importação das movimentações."}
                </p>
              </div>
              <div className="bg-ella-background rounded-xl p-6">
                <PieChartIcon size={32} className="mb-3" style={{ color: "#C9A43B" }} />
                <h4 className="text-ella-navy mb-2 text-sm font-semibold">
                  Categorização Automática
                </h4>
                <p className="text-ella-subtile text-sm">Organiza seus gastos por categoria.</p>
              </div>
              <div className="bg-ella-background rounded-xl p-6">
                <TrendingUp size={32} className="mb-3" style={{ color: "#C9A43B" }} />
                <h4 className="text-ella-navy mb-2 text-sm font-semibold">
                  Insights Personalizados
                </h4>
                <p className="text-ella-subtile text-sm">
                  Recomendações para melhorar suas finanças.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

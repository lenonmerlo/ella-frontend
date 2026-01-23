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
import { applyTrip } from "../../services/api/tripService";
import { uploadInvoice } from "../../services/api/uploadService";

interface Props {
  onClose: () => void;
  onSuccess: (result?: DashboardDataLocal) => void;
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

  async function processUpload(file: File, pwd?: string) {
    setIsUploading(true);
    setIsPasswordRequired(false);
    setUploadProgress(10);
    setErrorMessage(null);
    setResultToReturn(null);

    try {
      // Simulate progress steps
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);

      const result = await uploadInvoice(file, pwd);

      clearInterval(interval);
      setUploadProgress(100);

      setTimeout(() => {
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
        alert("Processando… pode levar até 2 min. Se demorar, atualize a lista.");
        return;
      }

      if (msg.toLowerCase().includes("senha") || msg.toLowerCase().includes("password")) {
        setIsPasswordRequired(true);
        setErrorMessage(msg);
      } else {
        alert(msg);
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
      alert(msg);
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
    setFileToUpload(file);
    processUpload(file);
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fileToUpload) return;

    if (isPasswordRequired && !password) return;

    processUpload(fileToUpload, password || undefined);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-600"
          disabled={isUploading}
        >
          <X size={24} />
        </button>

        {resultToReturn?.tripSuggestion ? (
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

            <h2 className="text-ella-navy mb-4 text-2xl font-semibold">Novo Upload</h2>
            <p className="text-ella-subtile mx-auto mb-10 max-w-md text-sm">
              Envie uma fatura bancária em PDF ou CSV. A ELLA vai analisar automaticamente suas
              transações e gerar insights personalizados.
            </p>

            <label className="inline-block cursor-pointer">
              <input
                type="file"
                accept=".pdf,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                className="inline-flex items-center gap-3 rounded-xl px-8 py-4 text-sm font-medium shadow-lg transition-all hover:opacity-90"
                style={{ backgroundColor: "#C9A43B", color: "#FFFFFF" }}
              >
                <Upload size={24} />
                <span>Enviar Fatura (PDF/CSV)</span>
              </div>
            </label>

            <div className="mt-12 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
              <div className="bg-ella-background rounded-xl p-6">
                <Sparkles size={32} className="mb-3" style={{ color: "#C9A43B" }} />
                <h4 className="text-ella-navy mb-2 text-sm font-semibold">Análise com IA</h4>
                <p className="text-ella-subtile text-sm">
                  Processamento inteligente de suas faturas.
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

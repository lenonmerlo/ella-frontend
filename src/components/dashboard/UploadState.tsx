// src/components/dashboard/UploadState.tsx
import {
  CheckCircle,
  FileText,
  Loader,
  Sparkles,
  Upload,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";

interface Props {
  isUploading: boolean;
  uploadProgress: number;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadState({ isUploading, uploadProgress, onFileUpload }: Props) {
  if (isUploading) {
    return (
      <div className="ella-glass p-12 text-center">
        <div
          className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(201, 164, 59, 0.1)" }}
        >
          <Loader
            className="animate-spin"
            size={48}
            style={{ color: "#C9A43B" }}
          />
        </div>

        <h2 className="mb-4 text-2xl font-semibold text-ella-navy">
          Processando com IA...
        </h2>
        <p className="mb-8 text-sm text-ella-subtile">
          A ELLA está analisando seu documento e extraindo informações
          financeiras.
        </p>

        {/* Barra de progresso */}
        <div className="mx-auto max-w-md">
          <div className="h-3 w-full overflow-hidden rounded-full bg-ella-background">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${uploadProgress}%`,
                backgroundColor: "#C9A43B",
              }}
            />
          </div>
          <p className="mt-3 text-sm text-ella-subtile">
            {uploadProgress}% concluído
          </p>
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
                <div className="h-4 w-4 rounded-full border-2 border-ella-muted" />
              )}
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // estado inicial aguardando upload
  return (
    <div className="ella-glass p-12 text-center">
      <div
        className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(201, 164, 59, 0.1)" }}
      >
        <FileText size={48} style={{ color: "#C9A43B" }} />
      </div>

      <h2 className="mb-4 text-2xl font-semibold text-ella-navy">
        Bem-vinda ao seu Dashboard!
      </h2>
      <p className="mx-auto mb-10 max-w-md text-sm text-ella-subtile">
        Para começar, envie uma fatura bancária em PDF ou CSV. A ELLA vai
        analisar automaticamente suas transações e gerar insights
        personalizados.
      </p>

      <label className="inline-block cursor-pointer">
        <input
          type="file"
          accept=".pdf,.csv"
          onChange={onFileUpload}
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
        <div className="rounded-xl bg-ella-background p-6">
          <Sparkles
            size={32}
            className="mb-3"
            style={{ color: "#C9A43B" }}
          />
          <h4 className="mb-2 text-sm font-semibold text-ella-navy">
            Análise com IA
          </h4>
          <p className="text-sm text-ella-subtile">
            Processamento inteligente de suas faturas.
          </p>
        </div>
        <div className="rounded-xl bg-ella-background p-6">
          <PieChartIcon
            size={32}
            className="mb-3"
            style={{ color: "#C9A43B" }}
          />
          <h4 className="mb-2 text-sm font-semibold text-ella-navy">
            Categorização Automática
          </h4>
          <p className="text-sm text-ella-subtile">
            Organiza seus gastos por categoria.
          </p>
        </div>
        <div className="rounded-xl bg-ella-background p-6">
          <TrendingUp
            size={32}
            className="mb-3"
            style={{ color: "#C9A43B" }}
          />
          <h4 className="mb-2 text-sm font-semibold text-ella-navy">
            Insights Personalizados
          </h4>
          <p className="text-sm text-ella-subtile">
            Recomendações para melhorar suas finanças.
          </p>
        </div>
      </div>
    </div>
  );
}

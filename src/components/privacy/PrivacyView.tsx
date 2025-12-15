import { ConsentHistoryDTO } from "@/services/api/privacyService";

type Props = {
  loading: boolean;
  error: string | null;
  history: ConsentHistoryDTO[];
  onAccept: () => void;
};

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString("pt-BR");
}

export function PrivacyView({ loading, error, history, onAccept }: Props) {
  const latest = history?.[0];

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="space-y-2">
        <h1 className="text-ella-navy text-2xl font-semibold">Privacidade &amp; LGPD</h1>
        <p className="text-ella-subtile text-sm leading-relaxed">
          Para continuar usando a ELLA Finanças, precisamos confirmar seu aceite do tratamento de
          dados, conforme a LGPD (Lei 13.709/2018).
        </p>
      </div>

      <div className="ella-glass space-y-4 rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div>
          <h2 className="text-ella-navy text-lg font-semibold">Como usamos seus dados</h2>
          <ul className="text-ella-subtile mt-2 list-disc space-y-2 pl-5 text-sm">
            <li>Criar e manter sua conta</li>
            <li>Processar transações e gerar relatórios</li>
            <li>Gerar insights e recomendações personalizadas</li>
            <li>Enviar comunicações importantes (assinatura, avisos, etc.)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-ella-navy text-lg font-semibold">Seus direitos</h2>
          <ul className="text-ella-subtile mt-2 list-disc space-y-2 pl-5 text-sm">
            <li>Acessar e corrigir seus dados</li>
            <li>Solicitar exclusão</li>
            <li>Solicitar portabilidade</li>
            <li>Revogar consentimento (quando aplicável)</li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong className="font-semibold">Erro: </strong>
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={onAccept}
        disabled={loading}
        className="bg-ella-navy hover:bg-ella-navy/90 disabled:bg-ella-navy/50 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed"
      >
        {loading ? "Carregando..." : "Concordo e continuar"}
      </button>

      {latest && (
        <div className="text-ella-subtile text-sm">
          Último aceite:{" "}
          <span className="text-ella-navy font-semibold">{formatDate(latest.acceptedAt)}</span> •
          versão
          <span className="text-ella-navy font-semibold"> {latest.contractVersion}</span> • IP
          <span className="text-ella-navy font-semibold"> {latest.ip}</span>
        </div>
      )}
    </div>
  );
}

import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { getScore } from "../../services/scoreService";
import type { Score } from "../../types/score";

interface ScoreCardProps {
  personId: string;
  onViewDetails?: () => void;
  variant?: "summary" | "details";
}

function formatDateShort(isoDate: string): string {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("pt-BR");
  } catch {
    return "";
  }
}

export function ScoreCard({ personId, onViewDetails, variant = "summary" }: ScoreCardProps) {
  const [score, setScore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchScore() {
      try {
        setLoading(true);
        setError(null);
        const data = await getScore(personId);
        if (cancelled) return;
        setScore(data);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
        setScore(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchScore();

    return () => {
      cancelled = true;
    };
  }, [personId]);

  if (loading) {
    return (
      <div className="ella-glass p-6" aria-busy="true" aria-live="polite">
        <span className="sr-only">Carregando...</span>
        <div className="animate-pulse">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-12 w-12 rounded-full bg-gray-300" />
            <div className="h-3 w-24 rounded bg-gray-300" />
          </div>
          <div className="mb-2 h-4 w-24 rounded bg-gray-300" />
          <div className="mb-2 h-8 w-28 rounded bg-gray-300" />
          <div className="h-3 w-56 rounded bg-gray-300" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ella-glass border border-red-500 p-6" role="alert">
        <p className="font-semibold text-red-600">Erro ao carregar score</p>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="ella-glass p-6">
        <p className="text-gray-500">Score não encontrado</p>
      </div>
    );
  }

  const calculatedAt = formatDateShort(score.calculationDate);

  return (
    <div className="ella-glass p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="bg-ella-background flex h-12 w-12 items-center justify-center rounded-full">
          <Activity size={24} className="text-ella-gold" />
        </div>
        <span className="text-ella-subtile text-xs font-medium uppercase">saúde financeira</span>
      </div>

      <p className="text-ella-subtile mb-1 text-sm">Score ELLA</p>
      <p className="text-ella-navy text-3xl font-bold">{score.scoreValue}/100</p>
      <p className="text-ella-subtile mt-1 text-xs">
        Baseado nas suas faturas e gastos recentes.
        {calculatedAt ? ` Atualizado em ${calculatedAt}.` : ""}
      </p>

      {variant === "summary" ? (
        onViewDetails ? (
          <button
            type="button"
            className="text-ella-navy mt-3 text-xs font-semibold hover:underline"
            onClick={onViewDetails}
          >
            Ver detalhes
          </button>
        ) : null
      ) : (
        <div className="mt-4 border-t border-gray-200 pt-4" aria-label="Detalhamento do score">
          <p className="mb-2 text-xs font-semibold text-gray-600">Detalhamento</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Utilização:</span>
              <span className="ml-1 font-semibold">{score.creditUtilizationScore}</span>
            </div>
            <div>
              <span className="text-gray-600">Pagamento:</span>
              <span className="ml-1 font-semibold">{score.onTimePaymentScore}</span>
            </div>
            <div>
              <span className="text-gray-600">Diversidade:</span>
              <span className="ml-1 font-semibold">{score.spendingDiversityScore}</span>
            </div>
            <div>
              <span className="text-gray-600">Consistência:</span>
              <span className="ml-1 font-semibold">{score.spendingConsistencyScore}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Histórico:</span>
              <span className="ml-1 font-semibold">{score.creditHistoryScore}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

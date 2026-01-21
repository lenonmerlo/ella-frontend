import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { useAuth } from "@/contexts/AuthContext";

export default function ScorePage() {
  const { user } = useAuth();
  const personId = user?.id ?? "";

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <h2 className="text-ella-navy text-lg font-semibold">Score ELLA</h2>
        <p className="text-ella-subtile mt-1 text-sm">
          Detalhamento da sua saúde financeira com base nas faturas e gastos recentes.
        </p>
      </div>

      <div className="max-w-md">
        <ScoreCard personId={personId} variant="details" />
      </div>

      <div className="rounded-2xl bg-white/80 p-6 text-sm shadow-sm backdrop-blur-sm">
        <p className="text-ella-subtile">
          Dica: para atualizar o score com dados mais recentes, faça um novo upload de fatura.
        </p>
      </div>
    </section>
  );
}

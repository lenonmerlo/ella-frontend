import { useEffect, useState } from "react";
import { fetchTransactions, TransactionListDTO } from "../services/api/transactionsService";

interface Props {
  personId: string;
  year: number;
  month: number;
  limit?: number;
  children: (props: {
    data: TransactionListDTO | null;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

export function TransactionsController({ personId, year, month, limit = 50, children }: Props) {
  const [data, setData] = useState<TransactionListDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personId) return;

    async function load() {
      setLoading(true);
      try {
        const result = await fetchTransactions(personId, year, month, limit);
        setData(result);
      } catch (err) {
        setError("Erro ao carregar transações");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [personId, year, month, limit]);

  return <>{children({ data, loading, error })}</>;
}

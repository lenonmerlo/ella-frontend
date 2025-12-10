import { useEffect, useState } from "react";
import {
  fetchTransactions,
  TransactionFilters,
  TransactionListDTO,
} from "../services/api/transactionsService";

interface Props {
  personId: string;
  filters: TransactionFilters;
  children: (props: {
    data: TransactionListDTO | null;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

export function TransactionsController({ personId, filters, children }: Props) {
  const [data, setData] = useState<TransactionListDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personId) return;

    async function load() {
      setLoading(true);
      try {
        const result = await fetchTransactions(personId, filters);
        setData(result);
      } catch (err) {
        setError("Erro ao carregar transações");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    // Spread dependencies to evitar refetch em cada render com objeto novo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    personId,
    filters.year,
    filters.month,
    filters.start,
    filters.end,
    filters.page,
    filters.size,
  ]);

  return <>{children({ data, loading, error })}</>;
}

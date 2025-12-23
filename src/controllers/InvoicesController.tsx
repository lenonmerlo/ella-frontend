import { useEffect, useState } from "react";
import { fetchInvoices } from "../services/api/invoicesService";
import type { DashboardInvoice } from "../types/dashboard";

interface Props {
  personId: string;
  year: number;
  month: number;
  children: (props: {
    data: { invoices: DashboardInvoice[] } | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
  }) => React.ReactNode;
}

export function InvoicesController({ personId, year, month, children }: Props) {
  const [data, setData] = useState<{ invoices: DashboardInvoice[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!personId) return;
    setLoading(true);
    try {
      const result = await fetchInvoices(personId, year, month);
      const mapped: DashboardInvoice[] = (result?.invoices ?? []).map((inv) => ({
        id: inv.invoiceId ?? inv.creditCardId ?? inv.creditCardName ?? "invoice",
        cardId: inv.creditCardId ?? "",
        cardName: inv.creditCardName ?? "Cartão",
        brand: inv.creditCardBrand ?? "",
        lastFourDigits: inv.creditCardLastFourDigits ?? "****",
        personName: inv.personName ?? "",
        amount: Number(inv.totalAmount ?? 0),
        dueDate: inv.dueDate ?? "",
        isOverdue: Boolean(inv.isOverdue),
        isPaid: Boolean(inv.isPaid),
        paidDate: inv.paidDate ?? undefined,
      }));
      setData({ invoices: mapped });
    } catch (err) {
      setError("Erro ao carregar faturas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!personId) return;
    load();
  }, [personId, year, month]);

  return <>{children({ data, loading, error, refresh: load })}</>;
}

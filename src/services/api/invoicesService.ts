import { InvoiceSummaryDTO } from "../../lib/dashboard";
import { http } from "../../lib/http";

export interface InvoiceListDTO {
  invoices: InvoiceSummaryDTO[];
}

export async function fetchInvoices(personId: string, year: number, month: number) {
  const res = await http.get<{ data: InvoiceListDTO }>(`/dashboard/${personId}/invoices`, {
    params: { year, month },
  });
  return res.data.data;
}

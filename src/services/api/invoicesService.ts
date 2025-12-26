import { FinancialTransactionResponseDTO, InvoiceSummaryDTO } from "../../lib/dashboard";
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

export async function updateInvoicePayment(invoiceId: string, paid: boolean, paidDate?: string) {
  const res = await http.put<{ data: any }>(`/invoices/${invoiceId}/payment`, {
    paid,
    paidDate: paid ? (paidDate ?? null) : null,
  });
  return res.data.data;
}

export interface InvoiceInsightsDTO {
  spendingByCategory: Record<string, number>;
  /** ex.: 0.18 para +18% vs mês anterior */
  comparisonWithPreviousMonth: number | null;
  highestTransaction: FinancialTransactionResponseDTO | null;
  recurringSubscriptions: FinancialTransactionResponseDTO[];
}

export async function fetchInvoiceInsights(invoiceId: string): Promise<InvoiceInsightsDTO> {
  const res = await http.get<{ data: InvoiceInsightsDTO }>(`/invoices/${invoiceId}/insights`);
  return res.data.data;
}

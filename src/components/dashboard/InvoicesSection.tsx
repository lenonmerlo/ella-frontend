// src/components/dashboard/InvoicesSection.tsx
import { ChevronRight, CreditCard } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchInvoiceInsights, updateInvoicePayment } from "../../services/api/invoicesService";
import { DashboardInvoice } from "../../types/dashboard";
import { formatDatePtBR } from "../../utils/date";

interface InvoicesSectionProps {
  invoices?: DashboardInvoice[];
  onRefresh?: () => void;
}

export function InvoicesSection({ invoices = [], onRefresh }: InvoicesSectionProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [insights, setInsights] = useState<Awaited<ReturnType<typeof fetchInvoiceInsights>> | null>(
    null,
  );

  const selectedInvoiceObj = useMemo(() => {
    if (!selectedInvoice) return null;
    return invoices.find((i) => i.id === selectedInvoice) ?? null;
  }, [invoices, selectedInvoice]);

  useEffect(() => {
    async function load() {
      setInsights(null);
      setInsightsError(null);

      const invoiceId = selectedInvoiceObj?.invoiceId;
      if (!selectedInvoice || !invoiceId) return;

      try {
        setInsightsLoading(true);
        const data = await fetchInvoiceInsights(invoiceId);
        setInsights(data);
      } catch (e) {
        console.error(e);
        setInsightsError("Erro ao carregar insights da fatura");
      } finally {
        setInsightsLoading(false);
      }
    }

    load();
  }, [selectedInvoice, selectedInvoiceObj?.invoiceId]);

  const sortedCategoryEntries = useMemo(() => {
    const entries = Object.entries(insights?.spendingByCategory ?? {});
    entries.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
    return entries;
  }, [insights?.spendingByCategory]);

  // Se não houver dados reais, mostrar mensagem
  if (invoices.length === 0) {
    return (
      <section className="ella-glass rounded-2xl p-6">
        <h2 className="text-ella-navy text-lg font-semibold">Faturas de cartão</h2>
        <p className="text-ella-subtile mt-1 text-sm">
          Nenhuma fatura encontrada para este período.
        </p>
      </section>
    );
  }

  return (
    <section className="ella-glass rounded-2xl p-6">
      <h2 className="text-ella-navy text-lg font-semibold">Faturas de cartão</h2>
      <p className="text-ella-subtile mt-1 text-sm">Resumo das suas faturas recentes</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="group border-ella-muted/50 hover:border-ella-gold/50 relative cursor-pointer overflow-hidden rounded-xl border bg-white/70 p-5 transition-all hover:shadow-md"
            onClick={() => setSelectedInvoice((prev) => (prev === invoice.id ? null : invoice.id))}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-ella-background/10 text-ella-navy flex h-10 w-10 items-center justify-center rounded-full">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-ella-navy font-medium">{invoice.cardName}</h3>
                  <p className="text-ella-subtile text-xs">{invoice.brand}</p>
                </div>
              </div>
              {invoice.isOverdue && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  Vencida
                </span>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ella-subtile">Final do Cartão</span>
                <span className="text-ella-navy font-medium">
                  {invoice.lastFourDigits || "****"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ella-subtile">Titular</span>
                <span className="text-ella-navy font-medium">{invoice.personName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ella-subtile">Vencimento</span>
                <span className="text-ella-navy font-medium">
                  {formatDatePtBR(invoice.dueDate)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ella-subtile">Pago?</span>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(invoice.isPaid)}
                    disabled={saving === invoice.id}
                    onClick={(e) => e.stopPropagation()}
                    onChange={async (e) => {
                      e.stopPropagation();
                      const paid = e.target.checked;
                      const dateToSend = paid
                        ? invoice.paidDate || new Date().toISOString().slice(0, 10)
                        : undefined;
                      try {
                        setSaving(invoice.id);
                        await updateInvoicePayment(invoice.id, paid, dateToSend);
                        onRefresh?.();
                      } finally {
                        setSaving(null);
                      }
                    }}
                    className="h-4 w-4"
                    aria-label="Marcar fatura como paga"
                  />
                  {Boolean(invoice.isPaid) && (
                    <input
                      type="date"
                      value={invoice.paidDate ? invoice.paidDate.slice(0, 10) : ""}
                      disabled={saving === invoice.id}
                      onClick={(e) => e.stopPropagation()}
                      onChange={async (e) => {
                        e.stopPropagation();
                        const paidDate = e.target.value;
                        try {
                          setSaving(invoice.id);
                          await updateInvoicePayment(invoice.id, true, paidDate);
                          onRefresh?.();
                        } finally {
                          setSaving(null);
                        }
                      }}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="border-ella-muted/30 mt-4 border-t pt-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-ella-subtile text-xs">Valor Total</p>
                  <p className="text-ella-navy text-lg font-bold">
                    R$ {(invoice.amount ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-ella-background/5 text-ella-navy group-hover:bg-ella-gold rounded-full p-1.5 transition-colors group-hover:text-white">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedInvoice && (
        <div className="border-ella-muted/30 mt-6 rounded-xl border bg-white/70 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-ella-navy text-base font-semibold">Insights da fatura</h3>
              <p className="text-ella-subtile text-xs">
                {selectedInvoiceObj?.cardName ?? "Cartão"}{" "}
                {selectedInvoiceObj?.brand ? `• ${selectedInvoiceObj.brand}` : ""}
                {selectedInvoiceObj?.lastFourDigits
                  ? ` • final ${selectedInvoiceObj.lastFourDigits}`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedInvoice(null)}
              className="text-ella-subtile hover:text-ella-navy text-xs"
            >
              Fechar
            </button>
          </div>

          {!selectedInvoiceObj?.invoiceId && (
            <div className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
              Não foi possível carregar detalhes desta fatura (invoiceId ausente).
            </div>
          )}

          {selectedInvoiceObj?.invoiceId && insightsLoading && (
            <div className="text-ella-subtile mt-4 text-sm">Carregando insights...</div>
          )}

          {selectedInvoiceObj?.invoiceId && insightsError && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {insightsError}
            </div>
          )}

          {selectedInvoiceObj?.invoiceId && !insightsLoading && !insightsError && insights && (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="ella-glass rounded-xl p-4">
                <h4 className="text-ella-navy text-sm font-semibold">Gastos por categoria</h4>
                {sortedCategoryEntries.length === 0 ? (
                  <p className="text-ella-subtile mt-2 text-sm">Sem despesas nesta fatura.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {sortedCategoryEntries.slice(0, 8).map(([cat, value]) => (
                      <div key={cat} className="flex items-center justify-between text-sm">
                        <span className="text-ella-subtile truncate pr-3">{cat}</span>
                        <span className="text-ella-navy font-medium">
                          R$ {(value ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {insights.comparisonWithPreviousMonth !== null && (
                  <p className="text-ella-subtile mt-4 text-xs">
                    Comparativo vs mês anterior:{" "}
                    {insights.comparisonWithPreviousMonth >= 0 ? "+" : ""}
                    {(insights.comparisonWithPreviousMonth * 100).toFixed(1)}%
                  </p>
                )}
              </div>

              <div className="ella-glass rounded-xl p-4">
                <h4 className="text-ella-navy text-sm font-semibold">Destaques</h4>

                <div className="mt-3">
                  <p className="text-ella-subtile text-xs">Maior compra</p>
                  {insights.highestTransaction ? (
                    <div className="mt-1 flex items-start justify-between gap-3 text-sm">
                      <span className="text-ella-navy line-clamp-2">
                        {insights.highestTransaction.description}
                      </span>
                      <span className="text-ella-navy font-semibold whitespace-nowrap">
                        R${" "}
                        {(insights.highestTransaction.amount ?? 0).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ) : (
                    <p className="text-ella-subtile mt-1 text-sm">--</p>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-ella-subtile text-xs">Assinaturas recorrentes</p>
                  {insights.recurringSubscriptions?.length ? (
                    <div className="mt-2 space-y-2">
                      {insights.recurringSubscriptions.slice(0, 6).map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span className="text-ella-subtile truncate">{tx.description}</span>
                          <span className="text-ella-navy font-medium whitespace-nowrap">
                            R${" "}
                            {(tx.amount ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-ella-subtile mt-1 text-sm">Nenhuma identificada.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

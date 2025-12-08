// src/components/dashboard/InvoicesSection.tsx
import { ChevronRight, CreditCard } from "lucide-react";
import { useState } from "react";
import { DashboardInvoice } from "../../types/dashboard";

interface InvoicesSectionProps {
  invoices?: DashboardInvoice[];
}

export function InvoicesSection({ invoices = [] }: InvoicesSectionProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

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
            onClick={() => setSelectedInvoice(invoice.id)}
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
                  {new Date(invoice.dueDate).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>

            <div className="border-ella-muted/30 mt-4 border-t pt-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-ella-subtile text-xs">Valor Total</p>
                  <p className="text-ella-navy text-lg font-bold">
                    R$ {invoice.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
        <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
          <p>
            <strong>Funcionalidade em breve:</strong> Detalhes da fatura {selectedInvoice} seriam
            exibidos aqui.
          </p>
        </div>
      )}
    </section>
  );
}

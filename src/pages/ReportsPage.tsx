import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { downloadReportPdf, generateReport, getReport, listReports } from "../lib/reports";
import type { BankStatementTransaction, ReportListItem, ReportResponse, ReportType } from "../types/reports";

function formatMoneyBRL(value: number | null | undefined) {
  const v = Number(value ?? 0);
  return `R$\u00A0${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function formatDateBR(dateIso: string | null | undefined) {
  if (!dateIso) return "";
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return dateIso;
  return d.toLocaleDateString("pt-BR");
}

function formatPercent(value: number | null | undefined) {
  const v = Number(value ?? 0);
  return `${v.toFixed(2)}%`;
}

function sumNumbers(...values: Array<number | null | undefined>) {
  return values.reduce<number>((acc, v) => acc + Number(v ?? 0), 0);
}

type Props = {
  personId: string;
  referenceDate: Date;
};

export default function ReportsPage({ personId, referenceDate }: Props) {
  const [type, setType] = useState<ReportType>("MONTHLY");
  const [date, setDate] = useState<Date>(referenceDate);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [selected, setSelected] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDate(referenceDate);
  }, [referenceDate]);

  async function refreshList() {
    const list = await listReports(personId);
    setReports(list);
  }

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        await refreshList();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao carregar relatórios");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personId]);

  const expenseChartData = useMemo(() => {
    const items = selected?.expensesByCategory ?? [];
    return items.slice(0, 8).map((i) => ({ name: i.category, value: Number(i.amount ?? 0) }));
  }, [selected]);

  const incomeChartData = useMemo(() => {
    const items = selected?.incomesByCategory ?? [];
    return items.slice(0, 8).map((i) => ({ name: i.category, value: Number(i.amount ?? 0) }));
  }, [selected]);

  const budget = selected?.budget;
  const budgetConfigured = Boolean(budget?.configured);
  const budgetNeedsTotal = useMemo(() => {
    if (!budgetConfigured) return 0;
    return sumNumbers(budget?.essentialFixedCost, budget?.necessaryFixedCost);
  }, [budgetConfigured, budget?.essentialFixedCost, budget?.necessaryFixedCost]);

  const bankStatements = selected?.bankStatements;
  const bankSummary = bankStatements?.summary;
  const bankTransactions: BankStatementTransaction[] = bankStatements?.transactions ?? [];

  async function onGenerate() {
    try {
      setIsGenerating(true);
      setError(null);
      const created = await generateReport(personId, type, date);
      setSelected(created);
      await refreshList();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar relatório");
    } finally {
      setIsGenerating(false);
    }
  }

  async function onOpen(reportId: string) {
    try {
      setError(null);
      const r = await getReport(personId, reportId);
      setSelected(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao abrir relatório");
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-ella-card rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-ella-navy text-lg font-semibold">Relatórios</h2>
            <p className="text-ella-subtile text-sm">
              Gere um relatório consolidado (mensal, semestral ou anual).
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <label className="text-ella-subtile flex flex-col gap-1 text-xs font-semibold tracking-wide">
              Tipo
              <select
                className="bg-ella-background/60 text-ella-navy rounded-xl px-3 py-2 text-sm"
                value={type}
                onChange={(e) => setType(e.target.value as ReportType)}
              >
                <option value="MONTHLY">Mensal</option>
                <option value="SEMIANNUAL">Semestral</option>
                <option value="ANNUAL">Anual</option>
              </select>
            </label>

            <label className="text-ella-subtile flex flex-col gap-1 text-xs font-semibold tracking-wide">
              Mês de referência
              <input
                type="month"
                className="bg-ella-background/60 text-ella-navy rounded-xl px-3 py-2 text-sm"
                value={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`}
                onChange={(e) => {
                  const [y, m] = e.target.value.split("-").map(Number);
                  if (!y || !m) return;
                  setDate(new Date(y, m - 1, 1));
                }}
              />
            </label>

            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="bg-ella-brand text-white hover:bg-ella-brand/90 rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {isGenerating ? "Gerando..." : "Gerar"}
            </button>

            {selected && (
              <button
                type="button"
                onClick={() => downloadReportPdf(personId, selected.id)}
                className="bg-ella-background text-ella-navy hover:bg-ella-background/80 rounded-xl px-4 py-2 text-sm font-semibold"
              >
                Baixar PDF
              </button>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-ella-card rounded-2xl p-6 shadow-sm lg:col-span-1">
          <h3 className="text-ella-navy mb-3 text-sm font-semibold">Relatórios salvos</h3>
          {!reports.length ? (
            <p className="text-ella-subtile text-sm">Nenhum relatório gerado ainda.</p>
          ) : (
            <div className="space-y-2">
              {reports.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onOpen(r.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                    selected?.id === r.id
                      ? "border-ella-brand bg-ella-background/60"
                      : "border-ella-muted hover:bg-ella-background/60"
                  }`}
                >
                  <div className="text-ella-navy font-semibold">{r.title}</div>
                  <div className="text-ella-subtile text-xs">
                    {formatDateBR(r.periodStart)} – {formatDateBR(r.periodEnd)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!selected ? (
            <div className="bg-ella-card rounded-2xl p-6 shadow-sm">
              <p className="text-ella-subtile text-sm">Selecione ou gere um relatório para ver detalhes.</p>
            </div>
          ) : (
            <>
              <div className="bg-ella-card rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-ella-navy text-lg font-semibold">{selected.title}</h3>
                    <p className="text-ella-subtile text-sm">
                      Período: {formatDateBR(selected.periodStart)} – {formatDateBR(selected.periodEnd)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="text-ella-subtile hover:bg-ella-background/60 rounded-lg p-2"
                    aria-label="Fechar"
                    title="Fechar"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="bg-ella-background/50 rounded-2xl p-4">
                    <p className="text-ella-subtile text-xs font-semibold tracking-wide">RECEITAS</p>
                    <p className="text-ella-navy mt-1 text-lg font-bold">
                      {formatMoneyBRL(selected.summary?.totalIncome)}
                    </p>
                  </div>
                  <div className="bg-ella-background/50 rounded-2xl p-4">
                    <p className="text-ella-subtile text-xs font-semibold tracking-wide">DESPESAS</p>
                    <p className="text-ella-navy mt-1 text-lg font-bold">
                      {formatMoneyBRL(selected.summary?.totalExpenses)}
                    </p>
                  </div>
                  <div className="bg-ella-background/50 rounded-2xl p-4">
                    <p className="text-ella-subtile text-xs font-semibold tracking-wide">SALDO</p>
                    <p className="text-ella-navy mt-1 text-lg font-bold">
                      {formatMoneyBRL(selected.summary?.balance)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-ella-card rounded-2xl p-6 shadow-sm">
                <h4 className="text-ella-navy mb-4 text-sm font-semibold">Gastos por categoria</h4>
                {!expenseChartData.length ? (
                  <p className="text-ella-subtile text-sm">Sem despesas no período.</p>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={expenseChartData} margin={{ left: 8, right: 8 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} height={60} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: any) => formatMoneyBRL(Number(v))} />
                        <Bar dataKey="value" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="bg-ella-card rounded-2xl p-6 shadow-sm">
                <h4 className="text-ella-navy mb-4 text-sm font-semibold">Receitas por categoria</h4>
                {!incomeChartData.length ? (
                  <p className="text-ella-subtile text-sm">Sem receitas no período.</p>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={incomeChartData} margin={{ left: 8, right: 8 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} height={60} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: any) => formatMoneyBRL(Number(v))} />
                        <Bar dataKey="value" fill="#22C55E" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="bg-ella-card rounded-2xl p-6 shadow-sm">
                <h4 className="text-ella-navy mb-4 text-sm font-semibold">Orçamento</h4>
                {!budgetConfigured ? (
                  <p className="text-ella-subtile text-sm">Orçamento não configurado.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="bg-ella-background/50 rounded-2xl p-4">
                        <p className="text-ella-subtile text-xs font-semibold tracking-wide">RENDA (PLANEJADA)</p>
                        <p className="text-ella-navy mt-1 text-lg font-bold">
                          {formatMoneyBRL(budget?.income)}
                        </p>
                      </div>
                      <div className="bg-ella-background/50 rounded-2xl p-4">
                        <p className="text-ella-subtile text-xs font-semibold tracking-wide">TOTAL (PLANEJADO)</p>
                        <p className="text-ella-navy mt-1 text-lg font-bold">
                          {formatMoneyBRL(budget?.total)}
                        </p>
                      </div>
                      <div className="bg-ella-background/50 rounded-2xl p-4">
                        <p className="text-ella-subtile text-xs font-semibold tracking-wide">SALDO (PLANEJADO)</p>
                        <p className="text-ella-navy mt-1 text-lg font-bold">
                          {formatMoneyBRL(budget?.balance)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-ella-subtile text-xs">
                            <th className="py-2 text-left font-semibold">Grupo</th>
                            <th className="py-2 text-right font-semibold">Valor</th>
                            <th className="py-2 text-right font-semibold">%</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ella-muted/40">
                          <tr>
                            <td className="py-2 text-ella-navy font-medium">Necessidades</td>
                            <td className="py-2 text-right text-ella-navy">
                              {formatMoneyBRL(budgetNeedsTotal)}
                            </td>
                            <td className="py-2 text-right text-ella-subtile">
                              {formatPercent(budget?.necessitiesPercentage)}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 text-ella-navy font-medium">Desejos</td>
                            <td className="py-2 text-right text-ella-navy">
                              {formatMoneyBRL(budget?.variableFixedCost)}
                            </td>
                            <td className="py-2 text-right text-ella-subtile">
                              {formatPercent(budget?.desiresPercentage)}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 text-ella-navy font-medium">Investimentos</td>
                            <td className="py-2 text-right text-ella-navy">
                              {formatMoneyBRL(
                                sumNumbers(budget?.investment, budget?.plannedPurchase, budget?.protection)
                              )}
                            </td>
                            <td className="py-2 text-right text-ella-subtile">
                              {formatPercent(budget?.investmentsPercentage)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {!!budget?.updatedAt && (
                      <p className="text-ella-subtile mt-3 text-xs">Atualizado em {formatDateBR(budget.updatedAt)}</p>
                    )}
                  </>
                )}
              </div>

              <div className="bg-ella-card rounded-2xl p-6 shadow-sm">
                <h4 className="text-ella-navy mb-4 text-sm font-semibold">Movimentação de conta corrente</h4>
                {!bankStatements || !bankSummary ? (
                  <p className="text-ella-subtile text-sm">Sem dados de conta corrente no período.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="bg-ella-background/50 rounded-2xl p-4">
                        <p className="text-ella-subtile text-xs font-semibold tracking-wide">ENTRADAS</p>
                        <p className="text-ella-navy mt-1 text-lg font-bold">
                          {formatMoneyBRL(bankSummary.totalIncome)}
                        </p>
                      </div>
                      <div className="bg-ella-background/50 rounded-2xl p-4">
                        <p className="text-ella-subtile text-xs font-semibold tracking-wide">SAÍDAS</p>
                        <p className="text-ella-navy mt-1 text-lg font-bold">
                          {formatMoneyBRL(bankSummary.totalExpenses)}
                        </p>
                      </div>
                      <div className="bg-ella-background/50 rounded-2xl p-4">
                        <p className="text-ella-subtile text-xs font-semibold tracking-wide">SALDO DO PERÍODO</p>
                        <p className="text-ella-navy mt-1 text-lg font-bold">
                          {formatMoneyBRL(bankSummary.balance)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="bg-ella-background/40 rounded-2xl p-4">
                        <p className="text-ella-subtile text-xs font-semibold tracking-wide">SALDO INICIAL</p>
                        <p className="text-ella-navy mt-1 text-base font-bold">
                          {formatMoneyBRL(bankSummary.openingBalance as any)}
                        </p>
                      </div>
                      <div className="bg-ella-background/40 rounded-2xl p-4">
                        <p className="text-ella-subtile text-xs font-semibold tracking-wide">SALDO FINAL</p>
                        <p className="text-ella-navy mt-1 text-base font-bold">
                          {formatMoneyBRL(bankSummary.closingBalance as any)}
                        </p>
                      </div>
                    </div>

                    <p className="text-ella-subtile mt-3 text-xs">
                      Transações: {Number(bankSummary.transactionCount ?? bankTransactions.length)} (mostrando até 40)
                    </p>

                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-ella-subtile text-xs">
                            <th className="py-2 text-left font-semibold">Data</th>
                            <th className="py-2 text-left font-semibold">Descrição</th>
                            <th className="py-2 text-right font-semibold">Valor</th>
                            <th className="py-2 text-right font-semibold">Saldo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ella-muted/40">
                          {!bankTransactions.length ? (
                            <tr>
                              <td className="py-2 text-ella-subtile" colSpan={4}>
                                Sem transações no período.
                              </td>
                            </tr>
                          ) : (
                            bankTransactions.slice(0, 40).map((t) => (
                              <tr key={t.id ?? `${t.transactionDate}-${t.description}`}
                                  className="align-top">
                                <td className="py-2 text-ella-navy whitespace-nowrap">
                                  {formatDateBR(t.transactionDate)}
                                </td>
                                <td className="py-2 text-ella-navy min-w-[260px]">
                                  {t.description ?? ""}
                                </td>
                                <td className="py-2 text-right text-ella-navy whitespace-nowrap">
                                  {formatMoneyBRL(t.amount)}
                                </td>
                                <td className="py-2 text-right text-ella-subtile whitespace-nowrap">
                                  {formatMoneyBRL(t.balance)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

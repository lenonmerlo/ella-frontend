import { InvestmentType } from "@/types/investment";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InvestmentForm } from "./InvestmentForm";

vi.mock("@/services/api/investmentService", () => ({
  createInvestment: vi.fn(),
  updateInvestment: vi.fn(),
}));

const investmentService = await import("@/services/api/investmentService");

describe("InvestmentForm", () => {
  it("renders form fields", () => {
    render(<InvestmentForm personId="p1" />);

    expect(screen.getByLabelText(/Nome do Investimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipo de Investimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Valor Inicial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Valor Atual/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de Investimento/i)).toBeInTheDocument();
  });

  it("submits create when no investment provided", async () => {
    vi.mocked(investmentService.createInvestment).mockResolvedValue({
      id: "i1",
      name: "Tesouro",
      type: InvestmentType.FIXED_INCOME,
      initialValue: 1000,
      currentValue: 1100,
      investmentDate: "2026-01-01",
      description: "",
      profitability: 10,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    });

    const onSuccess = vi.fn();
    render(<InvestmentForm personId="p1" onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText(/Nome do Investimento/i), {
      target: { value: "Tesouro" },
    });
    fireEvent.change(screen.getByLabelText(/Valor Inicial/i), { target: { value: "1000" } });
    fireEvent.change(screen.getByLabelText(/Valor Atual/i), { target: { value: "1100" } });

    fireEvent.click(screen.getByRole("button", { name: /Adicionar/i }));

    await waitFor(() => {
      expect(investmentService.createInvestment).toHaveBeenCalledWith(
        "p1",
        expect.objectContaining({ name: "Tesouro", initialValue: 1000, currentValue: 1100 }),
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("prefills and submits update when investment provided", async () => {
    vi.mocked(investmentService.updateInvestment).mockResolvedValue({
      id: "i1",
      name: "BTC",
      type: InvestmentType.CRYPTOCURRENCY,
      initialValue: 100,
      currentValue: 90,
      investmentDate: "2026-01-01",
      description: "",
      profitability: -10,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    });

    render(
      <InvestmentForm
        personId="p1"
        investment={{
          id: "i1",
          name: "BTC",
          type: InvestmentType.CRYPTOCURRENCY,
          initialValue: 100,
          currentValue: 100,
          investmentDate: "2026-01-01",
          description: "",
          profitability: 0,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        }}
      />,
    );

    expect(screen.getByLabelText(/Nome do Investimento/i)).toHaveValue("BTC");

    fireEvent.change(screen.getByLabelText(/Valor Atual/i), { target: { value: "90" } });
    fireEvent.click(screen.getByRole("button", { name: /Atualizar/i }));

    await waitFor(() => {
      expect(investmentService.updateInvestment).toHaveBeenCalledWith(
        "i1",
        expect.objectContaining({ currentValue: 90 }),
      );
    });
  });
});

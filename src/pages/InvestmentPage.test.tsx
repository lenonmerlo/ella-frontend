import { InvestmentType } from "@/types/investment";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import InvestmentPage from "./InvestmentPage";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "p1", name: "Teste" } }),
}));

vi.mock("@/services/api/investmentService", () => ({
  fetchInvestmentsSummary: vi.fn(),
  deleteInvestment: vi.fn(),
}));

const investmentService = await import("@/services/api/investmentService");

describe("InvestmentPage", () => {
  it("loads and shows summary + cards", async () => {
    vi.mocked(investmentService.fetchInvestmentsSummary).mockResolvedValue({
      totalInvested: 1000,
      totalCurrent: 1100,
      totalProfitability: 10,
      investments: [
        {
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
        },
      ],
    });

    render(<InvestmentPage />);

    await waitFor(() => {
      expect(screen.getByText(/Meus Investimentos \(1\)/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Tesouro/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\+10\.00%/i).length).toBeGreaterThanOrEqual(1);
  });

  it("can open edit form", async () => {
    vi.mocked(investmentService.fetchInvestmentsSummary).mockResolvedValue({
      totalInvested: 1000,
      totalCurrent: 1100,
      totalProfitability: 10,
      investments: [
        {
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
        },
      ],
    });

    render(<InvestmentPage />);

    await waitFor(() => {
      expect(screen.getByText(/Tesouro/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Editar Tesouro/i }));
    expect(screen.getByLabelText(/Nome do Investimento/i)).toHaveValue("Tesouro");
  });

  it("deletes an investment when confirmed", async () => {
    vi.mocked(investmentService.fetchInvestmentsSummary).mockResolvedValue({
      totalInvested: 1000,
      totalCurrent: 1100,
      totalProfitability: 10,
      investments: [
        {
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
        },
      ],
    });

    render(<InvestmentPage />);

    await waitFor(() => {
      expect(screen.getByText(/Tesouro/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Excluir Tesouro/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Excluir$/i }));

    await waitFor(() => {
      expect(investmentService.deleteInvestment).toHaveBeenCalledWith("i1");
    });
  });
});

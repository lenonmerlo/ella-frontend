import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BudgetSummary } from "./BudgetSummary";

describe("BudgetSummary", () => {
  it("renders summary values and annual balance", () => {
    render(
      <BudgetSummary
        budget={{
          id: "b1",
          income: 1000,
          essentialFixedCost: 100,
          necessaryFixedCost: 50,
          variableFixedCost: 20,
          investment: 200,
          plannedPurchase: 10,
          protection: 5,
          total: 385,
          balance: 100,
          necessitiesPercentage: 15,
          desiresPercentage: 2,
          investmentsPercentage: 21,
          recommendation: "✅ Excelente!",
          isHealthy: true,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        }}
      />,
    );

    expect(screen.getByText(/Renda/i)).toBeInTheDocument();
    expect(screen.getByText(/Saldo Anual/i)).toBeInTheDocument();

    // balance = 100 => annualBalance = 1200
    expect(screen.getByText(/R\$\s*1\.200,00/)).toBeInTheDocument();
    expect(screen.getByText(/Excelente/i)).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BudgetRule5030202 } from "./BudgetRule5030202";

describe("BudgetRule5030202", () => {
  it("renders 50/30/20 details", () => {
    render(
      <BudgetRule5030202
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
          balance: 615,
          necessitiesPercentage: 55.1,
          desiresPercentage: 29.9,
          investmentsPercentage: 20.0,
          recommendation: "⚠️",
          isHealthy: false,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        }}
      />,
    );

    expect(screen.getByText(/Regra 50\/30\/20/i)).toBeInTheDocument();
    expect(screen.getByText(/Necessidades/i)).toBeInTheDocument();
    expect(screen.getByText(/55\.1%/)).toBeInTheDocument();
    expect(screen.getByText(/Desejos/i)).toBeInTheDocument();
    expect(screen.getByText(/29\.9%/)).toBeInTheDocument();
    expect(screen.getByText(/Investimentos/i)).toBeInTheDocument();
    expect(screen.getByText(/20\.0%/)).toBeInTheDocument();
  });
});

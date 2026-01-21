import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InvestmentSummary } from "./InvestmentSummary";

describe("InvestmentSummary", () => {
  it("renders totals and profitability", () => {
    render(
      <InvestmentSummary
        summary={{
          totalInvested: 1000,
          totalCurrent: 1200,
          totalProfitability: 20,
          investments: [],
        }}
      />,
    );

    expect(screen.getByText(/Total Investido/i)).toBeInTheDocument();
    expect(screen.getByText(/Valor Atual/i)).toBeInTheDocument();
    expect(screen.getByText(/Rentabilidade Geral/i)).toBeInTheDocument();
    expect(screen.getByText(/\+20\.00%/i)).toBeInTheDocument();
  });
});

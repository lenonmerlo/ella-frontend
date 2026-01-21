import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ForgotPasswordPage from "./ForgotPasswordPage";

vi.mock("../lib/http", () => ({
  http: {
    post: vi.fn(),
  },
}));

const httpModule = await import("../lib/http");

describe("ForgotPasswordPage", () => {
  it("submits email and shows success message", async () => {
    vi.mocked(httpModule.http.post).mockResolvedValue({ data: {} });

    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar link/i }));

    await waitFor(() => {
      expect(httpModule.http.post).toHaveBeenCalledWith("/auth/forgot-password", null, {
        params: { email: "test@example.com" },
      });
    });

    expect(screen.getByRole("status")).toHaveTextContent(/você receberá um link/i);
  });
});

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ResetPasswordPage from "./ResetPasswordPage";

vi.mock("../lib/http", () => ({
  http: {
    post: vi.fn(),
  },
}));

const httpModule = await import("../lib/http");

describe("ResetPasswordPage", () => {
  it("disables submit and shows error when token is missing", () => {
    render(
      <MemoryRouter initialEntries={["/auth/reset-password"]}>
        <ResetPasswordPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/token inválido/i);
    expect(screen.getByRole("button", { name: /redefinir senha/i })).toBeDisabled();
  });

  it("validates password mismatch", async () => {
    render(
      <MemoryRouter initialEntries={["/auth/reset-password?token=abc"]}>
        <ResetPasswordPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/^nova senha$/i), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByLabelText(/confirmar nova senha/i), {
      target: { value: "password456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /redefinir senha/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/não conferem/i);
    expect(httpModule.http.post).not.toHaveBeenCalled();
  });

  it("submits token + newPassword and shows success", async () => {
    vi.mocked(httpModule.http.post).mockResolvedValue({ data: {} });

    render(
      <MemoryRouter initialEntries={["/auth/reset-password?token=abc"]}>
        <ResetPasswordPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/^nova senha$/i), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByLabelText(/confirmar nova senha/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /redefinir senha/i }));

    await waitFor(() => {
      expect(httpModule.http.post).toHaveBeenCalledWith("/auth/reset-password", {
        token: "abc",
        newPassword: "password123",
      });
    });

    expect(screen.getByRole("status")).toHaveTextContent(/senha redefinida com sucesso/i);
  });
});

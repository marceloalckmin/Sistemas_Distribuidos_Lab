import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../../src/App";

describe("App", () => {
  it("começa com a lista vazia", () => {
    render(<App />);
    expect(screen.getByText("Nenhum item cadastrado.")).toBeInTheDocument();
  });

  it("cadastra um item e o exibe na lista", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Nome"), "Notebook");
    await user.type(screen.getByLabelText("Preço"), "12,50");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByText("Notebook")).toBeInTheDocument();
    expect(screen.getByText(/12,50/)).toBeInTheDocument();
    expect(
      screen.queryByText("Nenhum item cadastrado."),
    ).not.toBeInTheDocument();
  });

  it("não cadastra item com preço inválido", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Nome"), "Notebook");
    await user.type(screen.getByLabelText("Preço"), "abc");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "O preço deve ser um número.",
    );
    expect(screen.getByText("Nenhum item cadastrado.")).toBeInTheDocument();
  });
});

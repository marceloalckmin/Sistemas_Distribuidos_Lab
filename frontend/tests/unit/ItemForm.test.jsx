import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ItemForm } from "../../src/components/ItemForm";

describe("ItemForm", () => {
  it("mostra erros e não chama onAdd com campos vazios", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<ItemForm onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    const alerts = screen.getAllByRole("alert");
    expect(alerts[0]).toHaveTextContent("O nome é obrigatório.");
    expect(alerts[1]).toHaveTextContent("O preço é obrigatório.");
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("chama onAdd com os valores e limpa o formulário", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<ItemForm onAdd={onAdd} />);

    await user.type(screen.getByLabelText("Nome"), "Notebook");
    await user.type(screen.getByLabelText("Preço"), "12,50");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(onAdd).toHaveBeenCalledWith({ name: "Notebook", price: 12.5 });
    expect(screen.getByLabelText("Nome")).toHaveValue("");
    expect(screen.getByLabelText("Preço")).toHaveValue("");
  });
});

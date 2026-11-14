import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function fillAndSubmit(user, name, price) {
  await user.type(screen.getByLabelText("Nome"), name);
  await user.type(screen.getByLabelText("Preço"), price);
  await user.click(screen.getByRole("button", { name: "Adicionar" }));
}

describe("App", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("mostra 'Carregando itens...' até a API responder", async () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    render(<App />);

    expect(screen.getByText("Carregando itens...")).toBeInTheDocument();
  });

  it("mostra a lista vazia quando a API não tem itens", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([])));
    render(<App />);

    expect(
      await screen.findByText("Nenhum item cadastrado."),
    ).toBeInTheDocument();
  });

  it("mostra os itens vindos da API", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse([{ id: 1, name: "Café", price: 12.5 }]),
        ),
    );
    render(<App />);

    expect(await screen.findByText("Café")).toBeInTheDocument();
    expect(screen.getByText(/12,50/)).toBeInTheDocument();
  });

  it("mostra erro quando a API está inacessível", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fail")));
    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível conectar à API.",
    );
  });

  it("envia o POST e adiciona o item criado à lista", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(
        jsonResponse({ id: 1, name: "Notebook", price: 12.5 }, 201),
      );
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    await screen.findByText("Nenhum item cadastrado.");

    await fillAndSubmit(user, "Notebook", "12,50");

    expect(await screen.findByText("Notebook")).toBeInTheDocument();
    const [, options] = fetchMock.mock.calls[1];
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({ name: "Notebook", price: 12.5 });
    expect(screen.getByLabelText("Nome")).toHaveValue("");
  });

  it("mostra o erro 409 e mantém o que foi digitado", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(jsonResponse([]))
        .mockResolvedValueOnce(
          jsonResponse({ detail: "Já existe um item com esse nome" }, 409),
        ),
    );
    render(<App />);
    await screen.findByText("Nenhum item cadastrado.");

    await fillAndSubmit(user, "Notebook", "12,50");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Já existe um item com esse nome",
    );
    expect(screen.getByLabelText("Nome")).toHaveValue("Notebook");
    expect(screen.getByLabelText("Preço")).toHaveValue("12,50");
  });

  it("não chama a API com preço inválido", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]));
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    await screen.findByText("Nenhum item cadastrado.");

    await fillAndSubmit(user, "Notebook", "abc");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "O preço deve ser um número.",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1); // só o GET inicial
  });
});

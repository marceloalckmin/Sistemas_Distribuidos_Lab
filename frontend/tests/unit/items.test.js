import { afterEach, describe, expect, it, vi } from "vitest";
import { createItem, listItems } from "../../src/services/items";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("services/items", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("listItems faz GET em /items/ e devolve o JSON", async () => {
    const data = [{ id: 1, name: "Café", price: 12.5 }];
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(data));
    vi.stubGlobal("fetch", fetchMock);

    await expect(listItems()).resolves.toEqual(data);
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/items\/$/);
  });

  it("createItem envia POST com JSON", async () => {
    const created = { id: 2, name: "Chá", price: 5 };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(created, 201));
    vi.stubGlobal("fetch", fetchMock);

    await expect(createItem({ name: "Chá", price: 5 })).resolves.toEqual(
      created,
    );

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/items\/$/);
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(options.body)).toEqual({ name: "Chá", price: 5 });
  });

  it("usa o detail da API quando a resposta é de erro", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse({ detail: "Já existe um item com esse nome" }, 409),
        ),
    );

    await expect(createItem({ name: "Café", price: 1 })).rejects.toThrow(
      "Já existe um item com esse nome",
    );
  });

  it("usa a mensagem padrão quando o erro não traz detail em texto", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ detail: [{ msg: "x" }] }, 422)),
    );

    await expect(listItems()).rejects.toThrow("Erro ao carregar os itens.");
  });

  it("avisa quando a API está inacessível", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fail")));

    await expect(listItems()).rejects.toThrow(
      "Não foi possível conectar à API.",
    );
  });
});

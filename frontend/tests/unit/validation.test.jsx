import { describe, expect, it } from "vitest";
import { NAME_MAX_LENGTH, validateItem } from "../../src/validation";

describe("validateItem", () => {
  it("rejeita nome vazio ou só com espaços", () => {
    const { errors } = validateItem({ name: "   ", price: "10" });
    expect(errors.name).toBeDefined();
  });

  it("rejeita nome acima do limite", () => {
    const name = "a".repeat(NAME_MAX_LENGTH + 1);
    const { errors } = validateItem({ name, price: "10" });
    expect(errors.name).toBeDefined();
  });

  it("rejeita preço vazio", () => {
    const { errors } = validateItem({ name: "Café", price: "" });
    expect(errors.price).toBe("O preço é obrigatório.");
  });

  it("rejeita preço que não é número", () => {
    const { errors } = validateItem({ name: "Café", price: "abc" });
    expect(errors.price).toBe("O preço deve ser um número.");
  });

  it("rejeita preço negativo", () => {
    const { errors } = validateItem({ name: "Café", price: "-5" });
    expect(errors.price).toBe("O preço não pode ser negativo.");
  });

  it("aceita vírgula como separador decimal", () => {
    const { errors, values } = validateItem({ name: "Café", price: "12,50" });
    expect(errors).toEqual({});
    expect(values).toEqual({ name: "Café", price: 12.5 });
  });

  it("remove espaços do nome", () => {
    const { values } = validateItem({ name: "  Café  ", price: "1" });
    expect(values.name).toBe("Café");
  });
});

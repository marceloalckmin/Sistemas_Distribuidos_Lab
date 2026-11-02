import { useState } from "react";
import { validateItem } from "../validation";

export function ItemForm({ onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    const result = validateItem({ name, price });
    setErrors(result.errors);
    if (Object.keys(result.errors).length > 0) return;

    onAdd(result.values);
    setName("");
    setPrice("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="space-y-1">
        <label htmlFor="item-name" className="block text-sm font-medium">
          Nome
        </label>
        <input
          id="item-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "item-name-error" : undefined}
          className="w-full rounded border border-slate-300 p-2"
        />
        {errors.name && (
          <p id="item-name-error" role="alert" className="text-sm text-red-700">
            {errors.name}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label htmlFor="item-price" className="block text-sm font-medium">
          Preço
        </label>
        <input
          id="item-price"
          inputMode="decimal"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          aria-invalid={errors.price ? "true" : "false"}
          aria-describedby={errors.price ? "item-price-error" : undefined}
          className="w-full rounded border border-slate-300 p-2"
        />
        {errors.price && (
          <p
            id="item-price-error"
            role="alert"
            className="text-sm text-red-700"
          >
            {errors.price}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 sm:w-auto"
      >
        Adicionar
      </button>
    </form>
  );
}

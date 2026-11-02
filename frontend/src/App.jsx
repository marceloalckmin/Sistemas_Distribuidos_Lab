import { useState } from "react";
import { ItemForm } from "./components/ItemForm";
import { ItemList } from "./components/ItemList";

export default function App() {
  const [items, setItems] = useState([]);

  function addItem({ name, price }) {
    setItems((current) => [
      ...current,
      { id: crypto.randomUUID(), name, price },
    ]);
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-6 p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-amber-500">
        Gerenciador de Itens
      </h1>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <div className="md:order-last">
          <ItemForm onAdd={addItem} />
        </div>
        <section aria-labelledby="items-heading" className="space-y-3">
          <h2
            id="items-heading"
            className="text-xl font-semibold text-orange-400"
          >
            Itens cadastrados
          </h2>
          <ItemList items={items} />
        </section>
      </div>
    </main>
  );
}

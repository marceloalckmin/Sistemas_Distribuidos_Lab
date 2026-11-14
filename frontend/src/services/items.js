export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// Barra final obrigatória: "/items" causaria um redirect 307 (ruim com CORS).
const ITEMS_URL = `${API_URL}/items/`;

async function request(url, options, defaultMessage) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    // fetch só rejeita em falha de rede (API fora do ar, CORS bloqueado...)
    throw new Error("Não foi possível conectar à API.");
  }

  if (!response.ok) {
    // fetch NÃO rejeita em 4xx/5xx: precisamos checar response.ok
    let message = defaultMessage;
    try {
      const body = await response.json();
      if (typeof body.detail === "string") message = body.detail;
    } catch {
      // corpo sem JSON: mantém a mensagem padrão
    }
    throw new Error(message);
  }

  return response.json();
}

export function listItems() {
  return request(ITEMS_URL, undefined, "Erro ao carregar os itens.");
}

export function createItem({ name, price }) {
  return request(
    ITEMS_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    },
    "Erro ao cadastrar o item.",
  );
}

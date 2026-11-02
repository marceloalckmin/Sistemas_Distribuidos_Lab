export const NAME_MAX_LENGTH = 100;

export function validateItem({ name, price }) {
  const errors = {};
  const trimmedName = name.trim();
  const normalizedPrice = price.trim().replace(",", ".");
  const numericPrice = Number(normalizedPrice);

  if (!trimmedName) {
    errors.name = "O nome é obrigatório.";
  } else if (trimmedName.length > NAME_MAX_LENGTH) {
    errors.name = `O nome deve ter no máximo ${NAME_MAX_LENGTH} caracteres.`;
  }

  if (!normalizedPrice) {
    errors.price = "O preço é obrigatório.";
  } else if (Number.isNaN(numericPrice)) {
    errors.price = "O preço deve ser um número.";
  } else if (numericPrice < 0) {
    errors.price = "O preço não pode ser negativo.";
  }

  return {
    errors,
    values: { name: trimmedName, price: numericPrice },
  };
}

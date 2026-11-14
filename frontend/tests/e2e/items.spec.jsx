import { expect, test } from "@playwright/test";

// Nomes únicos: o teste não depende de dados prévios nem colide ao repetir.
const uniqueName = (prefix) => `${prefix} ${Date.now()}`;

test("carrega a interface", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Gerenciador de Itens" }),
  ).toBeVisible();
  await expect(page.getByText("Carregando itens...")).toBeHidden();
});

test("cadastra um item e ele persiste após recarregar a página", async ({
  page,
}) => {
  const name = uniqueName("Notebook");
  await page.goto("/");

  await page.getByLabel("Nome").fill(name);
  await page.getByLabel("Preço").fill("12,50");
  await page.getByRole("button", { name: "Adicionar" }).click();

  const item = page.getByRole("listitem").filter({ hasText: name });
  await expect(item).toBeVisible();
  await expect(item).toContainText("12,50");

  await page.reload();
  await expect(item).toBeVisible(); // veio do PostgreSQL
});

test("mostra erro ao cadastrar um nome duplicado", async ({ page }) => {
  const name = uniqueName("Duplicado");
  await page.goto("/");

  for (const attempt of [1, 2]) {
    await page.getByLabel("Nome").fill(name);
    await page.getByLabel("Preço").fill("5");
    await page.getByRole("button", { name: "Adicionar" }).click();
    if (attempt === 1) {
      await expect(
        page.getByRole("listitem").filter({ hasText: name }),
      ).toBeVisible();
    }
  }

  await expect(page.getByRole("alert")).toContainText(
    "Já existe um item com esse nome",
  );
});

test("mostra erro ao enviar com nome vazio", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Adicionar" }).click();

  await expect(page.getByRole("alert").first()).toContainText(
    "O nome é obrigatório.",
  );
});

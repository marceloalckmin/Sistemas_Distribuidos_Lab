import { expect, test } from "@playwright/test";

test("carrega a interface", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Gerenciador de Itens" }),
  ).toBeVisible();
  await expect(page.getByText("Nenhum item cadastrado.")).toBeVisible();
});

test("cadastra um item e o exibe na listagem", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Nome").fill("Notebook");
  await page.getByLabel("Preço").fill("12,50");
  await page.getByRole("button", { name: "Adicionar" }).click();

  await expect(page.getByRole("listitem")).toContainText("Notebook");
  await expect(page.getByRole("listitem")).toContainText("12,50");
  await expect(page.getByText("Nenhum item cadastrado.")).toBeHidden();
});

test("mostra erro ao enviar com nome vazio", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Adicionar" }).click();

  await expect(page.getByRole("alert").first()).toContainText(
    "O nome é obrigatório.",
  );
});

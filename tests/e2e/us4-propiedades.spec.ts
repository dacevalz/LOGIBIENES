import { expect, test } from "@playwright/test";

/**
 * User Story 4 con JavaScript (T046): capturar criterios de búsqueda cuando
 * todavía no hay inventario cargado.
 */

test("la página dice la verdad: no hay listados, y ofrece dejar los criterios", async ({
  page,
}) => {
  await page.goto("/propiedades");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Cuéntanos qué buscas",
  );
  // Constitución III: no simula un catálogo vacío ni promete inventario.
  await expect(page.getByText("Todavía no publicamos listados")).toBeVisible();
});

test("el formulario de búsqueda pide los criterios de CriterioBusqueda", async ({
  page,
}) => {
  await page.goto("/propiedades");

  await expect(page.getByLabel("Operación")).toBeVisible();
  await expect(page.getByLabel("Tipo de inmueble")).toBeVisible();
  await expect(page.getByLabel("Zona")).toBeVisible();
  await expect(page.getByLabel("Presupuesto mínimo (COP)")).toBeVisible();
  await expect(page.getByLabel("Presupuesto máximo (COP)")).toBeVisible();
});

test("el envío por fetch confirma el registro sin recargar", async ({
  page,
}) => {
  await page.goto("/propiedades");

  await page.getByLabel("Nombre").fill("Juan Pérez");
  await page.getByLabel("Correo o WhatsApp").fill("+573001234567");
  await page.getByLabel("Operación").selectOption("arrendar");
  await page.getByLabel("Tipo de inmueble").fill("apartamento");
  await page.getByLabel("Zona").fill("Laureles, Medellín");
  await page.getByLabel("Presupuesto máximo (COP)").fill("2500000");
  await page.getByRole("checkbox").check();

  await page.waitForTimeout(1_800);

  // Sin credenciales reales de Resend el envío daría 502, así que se
  // intercepta: lo que se verifica aquí es la respuesta del CLIENTE ante un
  // {ok:true}, no la entrega del correo (eso es T059).
  await page.route("**/api/leads", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    }),
  );

  await page.getByRole("button", { name: "Enviar" }).click();

  await expect(
    page.getByRole("heading", { name: "Recibimos tu mensaje" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/propiedades$/);
});

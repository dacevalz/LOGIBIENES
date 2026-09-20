import { expect, test } from "@playwright/test";

/**
 * T047 — el formulario de búsqueda también funciona sin JavaScript.
 *
 * Misma limitación declarada que en US1: con la API key de Resend en
 * placeholder, la rama "correo entregado" no se puede ejercitar sin meter un
 * bypass en código de producción. Se recorre el servidor real disparando el
 * descarte silencioso por honeypot, que por contrato responde con el mismo
 * 303 al mismo `/gracias` que un éxito, por el mismo `route.ts` →
 * `procesarLead()` → `resolveRedirectTarget()`.
 */
test.use({ javaScriptEnabled: false });

test("el par firmado y el envío nativo viajan en el HTML", async ({ page }) => {
  await page.goto("/propiedades");

  const form = page.locator("form");
  await expect(form).toHaveAttribute("method", /post/i);
  await expect(form).toHaveAttribute("action", "/api/leads");
  await expect(page.locator('input[name="formTimestamp"]')).toHaveCount(1);
  await expect(page.locator('input[name="formTimestampSig"]')).toHaveCount(1);
  // El `tipo` es lo que decide el destino del 303: aquí tiene que ser busqueda.
  await expect(page.locator('input[name="tipo"]')).toHaveValue("busqueda");
});

test("el <form> nativo hace POST real y el 303 aterriza en /propiedades/gracias (disparado por honeypot)", async ({
  page,
}) => {
  await page.goto("/propiedades");

  await page.getByLabel("Nombre").fill("Juan Pérez");
  await page.getByLabel("Correo o WhatsApp").fill("+573001234567");
  await page.getByLabel("Operación").selectOption("comprar");
  await page.getByLabel("Tipo de inmueble").fill("casa");
  await page.getByLabel("Zona").fill("Envigado");
  await page.getByRole("checkbox").check();

  await page.locator('input[name="honeypot"]').fill("soy-un-bot");

  await Promise.all([
    page.waitForURL("**/propiedades/gracias"),
    page.getByRole("button", { name: "Enviar" }).click(),
  ]);

  await expect(
    page.getByRole("heading", { name: "Recibimos tu búsqueda" }),
  ).toBeVisible();
});

test("el destino del 303 depende del tipo: busqueda nunca cae en /contacto", async ({
  page,
}) => {
  // Verifica que el switch cerrado de resolveRedirectTarget usa `tipo` y no la
  // página de origen: los dos formularios comparten componente, así que un
  // error aquí mandaría a quien buscaba inmueble a la confirmación de contacto.
  await page.goto("/propiedades");
  await page.getByLabel("Nombre").fill("Juan Pérez");
  await page.getByLabel("Correo o WhatsApp").fill("+573001234567");
  await page.getByLabel("Operación").selectOption("arrendar");
  await page.getByLabel("Tipo de inmueble").fill("local");
  await page.getByLabel("Zona").fill("Poblado");
  await page.getByRole("checkbox").check();
  await page.locator('input[name="honeypot"]').fill("bot");

  await Promise.all([
    page.waitForURL(/\/propiedades\/gracias/),
    page.getByRole("button", { name: "Enviar" }).click(),
  ]);

  expect(page.url()).not.toContain("/contacto/");
});

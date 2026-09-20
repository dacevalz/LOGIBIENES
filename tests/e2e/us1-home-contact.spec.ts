import { expect, test } from "@playwright/test";

/**
 * User Story 1 con JavaScript habilitado (T023).
 *
 * Cubre: la propuesta de valor se lee sin scroll; el contacto está a un clic
 * desde cualquier página; y el envío por `fetch` pinta confirmación sin
 * recargar.
 */

test("el home comunica la propuesta de valor sin necesidad de hacer scroll", async ({
  page,
}) => {
  await page.goto("/");

  const titular = page.getByRole("heading", { level: 1 });
  await expect(titular).toContainText("comprar, vender, arrendar o invertir");

  // "Sin scroll" en serio: el titular tiene que caer dentro del viewport
  // inicial, no solo existir en el documento.
  const caja = await titular.boundingBox();
  const alto = page.viewportSize()?.height ?? 0;
  expect(caja).not.toBeNull();
  expect(caja!.y + caja!.height).toBeLessThanOrEqual(alto);

  await expect(page.getByText("Fácil, rápido, digital")).toBeVisible();
});

test("el contacto está a un clic desde cualquier página", async ({ page }) => {
  for (const ruta of ["/", "/contacto", "/aviso-de-privacidad"]) {
    await page.goto(ruta);
    // El CTA del header lo pone `contact-cta.tsx` en el layout, así que existe
    // en toda página sin que cada una tenga que acordarse de ponerlo.
    const cta = page
      .locator("header")
      .getByRole("link", { name: /escríbenos/i });
    await expect(cta.first()).toBeVisible();
  }
});

test("el envío por fetch responde sin recargar y pinta confirmación", async ({
  page,
}) => {
  await page.goto("/contacto");

  await page.getByLabel("Nombre").fill("María Restrepo");
  await page.getByLabel("Correo o WhatsApp").fill("maria@example.com");
  await page
    .getByLabel("¿En qué te ayudamos?")
    .fill("Quiero vender un apartamento en El Poblado.");
  await page.getByRole("checkbox").check();

  // Por encima del umbral mínimo de llenado: por debajo, el servidor
  // descartaría el envío en silencio y estaríamos probando otra cosa.
  await page.waitForTimeout(1_800);

  // El entorno de pruebas no tiene una API key real de Resend, así que se
  // intercepta la ruta: lo que se verifica aquí es el comportamiento del
  // cliente ante un {ok:true}, no la entrega del correo.
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
  // Sin recargar: seguimos en /contacto, no en /contacto/gracias.
  await expect(page).toHaveURL(/\/contacto$/);
});

test("un error del servidor ofrece una vía de contacto alterna, no solo el mensaje", async ({
  page,
}) => {
  await page.goto("/contacto");

  await page.getByLabel("Nombre").fill("María Restrepo");
  await page.getByLabel("Correo o WhatsApp").fill("maria@example.com");
  await page.getByLabel("¿En qué te ayudamos?").fill("Hola.");
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(1_800);

  await page.route("**/api/leads", (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        error: "no pudimos confirmar el envío",
      }),
    }),
  );

  await page.getByRole("button", { name: "Enviar" }).click();

  // Acotado al formulario: Next monta su propio route-announcer con
  // role="alert", y un getByRole suelto resolvería a dos elementos.
  const alerta = page.locator("form").getByRole("alert");
  await expect(alerta).toContainText("no pudimos confirmar el envío");
  await expect(alerta.getByRole("link")).toBeVisible();
});

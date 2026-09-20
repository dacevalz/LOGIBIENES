import { expect, test } from "@playwright/test";

/**
 * FR-016 / SC-008 (T024): el formulario de contacto funciona con JavaScript
 * deshabilitado. Es el camino que recorre un agente que no ejecuta JS, y el
 * que prueba que el `<form method="post">` nativo no es decorativo.
 *
 * LIMITACIÓN CONOCIDA, declarada a propósito: en este entorno la API key de
 * Resend es un placeholder (AS-01/AS-02), así que un envío por lo demás
 * perfecto termina en `falloEnvio` → `/contacto/error`. Por eso la rama
 * "correo entregado de verdad" no se puede ejercitar aquí sin meter un bypass
 * en código de producción, que sería peor que la brecha que cubriría.
 *
 * Lo que sí se ejercita abajo es el envío nativo real contra el servidor real,
 * disparando la rama de descarte silencioso, que el contrato define como
 * INDISTINGUIBLE del éxito: mismo 303 al mismo `/gracias`, por el mismo
 * `route.ts` → `procesarLead()` → `resolveRedirectTarget()`, sin tocar Resend.
 * La única pieza que queda sin cubrir es la entrega del correo en sí, que se
 * verifica en T059 con credenciales de verdad.
 */
test.use({ javaScriptEnabled: false });

async function llenarFormulario(page: import("@playwright/test").Page) {
  await page.getByLabel("Nombre").fill("María Restrepo");
  await page.getByLabel("Correo o WhatsApp").fill("maria@example.com");
  await page
    .getByLabel("¿En qué te ayudamos?")
    .fill("Quiero vender un apartamento.");
  await page.getByRole("checkbox").check();
}

test("el formulario declara el envío nativo, no solo el de fetch", async ({
  page,
}) => {
  await page.goto("/contacto");

  const form = page.locator("form");
  await expect(form).toHaveAttribute("method", /post/i);
  await expect(form).toHaveAttribute("action", "/api/leads");

  // El par firmado viaja en el HTML servido: sin él no hay envío posible sin JS.
  await expect(page.locator('input[name="formTimestamp"]')).toHaveCount(1);
  await expect(page.locator('input[name="formTimestampSig"]')).toHaveCount(1);
});

test("el <form> nativo hace POST real y el 303 aterriza en /contacto/gracias (disparado por honeypot: descarte silencioso ≡ éxito por contrato)", async ({
  page,
}) => {
  await page.goto("/contacto");
  await llenarFormulario(page);

  // Se dispara el descarte silencioso por HONEYPOT, no por tiempo. Depender
  // del umbral de 1.5 s haría que el test ganara o perdiera según lo que
  // tardara Playwright en teclear — pasaría o fallaría por la razón
  // equivocada. El honeypot es determinista y produce, por contrato, el mismo
  // 303 al mismo /gracias que un éxito real, sin tocar Resend: eso es lo que
  // permite recorrer el servidor entero en un entorno sin credenciales.
  await page.locator('input[name="honeypot"]').fill("soy-un-bot");

  await Promise.all([
    page.waitForURL("**/contacto/gracias"),
    page.getByRole("button", { name: "Enviar" }).click(),
  ]);

  await expect(
    page.getByRole("heading", { name: "Recibimos tu mensaje" }),
  ).toBeVisible();
});

// Aquí vivía un tercer test que interceptaba /api/leads con `page.route` para
// devolver un 303 y comprobar que el formulario aterrizaba en /gracias.
// Se eliminó: al interceptar en la capa de red nunca ejecutaba `route.ts` ni
// `procesarLead`, así que solo verificaba que un navegador sigue un 303 —
// habría pasado igual contra un servidor con la lógica completamente rota.
// El test de arriba ya recorre ese mismo camino con código de producción real.

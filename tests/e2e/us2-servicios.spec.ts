import { expect, test } from "@playwright/test";
import { SERVICIOS } from "../../content/servicios";

/**
 * User Story 2 (T038): el hub enlaza a las 5 líneas, y cada página muestra su
 * propio contenido y su propio CTA — no una plantilla genérica repetida.
 */

test("el hub enlaza a las 5 líneas de servicio", async ({ page }) => {
  await page.goto("/servicios");

  for (const servicio of SERVICIOS) {
    await expect(
      page.locator(`a[href="/servicios/${servicio.slug}"]`).first(),
    ).toBeVisible();
  }
});

test("cada página de servicio se abre directo por URL y muestra lo suyo", async ({
  page,
}) => {
  for (const servicio of SERVICIOS) {
    await page.goto(`/servicios/${servicio.slug}`);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      servicio.nombre,
    );
    // Su CTA, no uno genérico compartido.
    await expect(
      page.getByRole("heading", { name: servicio.ctaTexto }),
    ).toBeVisible();
    // El primer párrafo de su descripción larga, que es distinto en cada una.
    const primerParrafo = servicio.descripcionLarga.split("\n\n")[0];
    await expect(page.getByText(primerParrafo)).toBeVisible();
  }
});

test("el cuerpo de cada servicio es realmente distinto, no una plantilla genérica", async ({
  page,
}) => {
  // Comparar solo los <h1> no probaría nada: pasarían igual 5 páginas con el
  // mismo cuerpo y distinto título. Lo que distingue una plantilla genérica de
  // contenido propio es el CUERPO, así que se compara el texto del contenedor
  // [data-content] sin su encabezado.
  const cuerpos = new Set<string>();

  for (const servicio of SERVICIOS) {
    await page.goto(`/servicios/${servicio.slug}`);

    const textoCompleto =
      (await page.locator("[data-content]").innerText()) ?? "";
    const titular =
      (await page.getByRole("heading", { level: 1 }).innerText()) ?? "";

    cuerpos.add(textoCompleto.replace(titular, "").trim());
  }

  expect(cuerpos.size).toBe(SERVICIOS.length);
});

test("un slug inventado devuelve 404, no una página vacía", async ({
  page,
}) => {
  const respuesta = await page.goto("/servicios/no-existe-este-servicio");
  expect(respuesta?.status()).toBe(404);
});

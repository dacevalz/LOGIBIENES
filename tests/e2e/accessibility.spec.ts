import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { SERVICIOS } from "../../content/servicios";

/**
 * T052 / SC-005 — 0 violaciones críticas de WCAG 2.2 AA en las 13 páginas
 * indexables.
 *
 * El `<video>` del hero va `aria-hidden="true"` por ser decorativo, así que
 * axe no le aplica `video-caption` (mismo criterio que la excepción del
 * honeypot en `research.md` §10).
 */
const PAGINAS_INDEXABLES = [
  "/",
  "/nosotros",
  "/servicios",
  ...SERVICIOS.map((s) => `/servicios/${s.slug}`),
  "/propiedades",
  "/preguntas-frecuentes",
  "/contacto",
  "/aviso-de-privacidad",
  "/terminos-y-condiciones",
];

test("la lista cubre exactamente las 13 rutas indexables del contrato", () => {
  // Si alguien agrega una página al sitemap y no a esta lista, la auditoría
  // de accesibilidad la dejaría fuera sin que nadie lo note.
  expect(PAGINAS_INDEXABLES.length).toBe(13);
  expect(new Set(PAGINAS_INDEXABLES).size).toBe(13);
});

for (const ruta of PAGINAS_INDEXABLES) {
  test(`${ruta} no tiene violaciones críticas de WCAG 2.2 AA`, async ({
    page,
  }) => {
    await page.goto(ruta);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const criticas = violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );

    // El mensaje importa: un fallo aquí sin detalle obliga a reproducirlo a
    // mano para saber qué regla se rompió y en qué nodo.
    const detalle = criticas
      .map(
        (v) =>
          `  [${v.impact}] ${v.id}: ${v.help}\n    ${v.nodes
            .map((n) => n.target.join(" "))
            .join("\n    ")}`,
      )
      .join("\n");

    expect(criticas.length, `violaciones en ${ruta}:\n${detalle}`).toBe(0);
  });
}

test("bajo prefers-reduced-motion el hero muestra el poster y no anima", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  // El fallback de T026 es CSS puro: el <video> se oculta y aparece el
  // poster. Se comprueba el estilo COMPUTADO, no la clase, porque lo que
  // importa es lo que el navegador realmente aplica.
  const video = page.locator("video");
  const poster = page.locator('img[src="/video/hero-poster.webp"]');

  await expect(video).toBeHidden();
  await expect(poster).toBeVisible();

  // Y el contenido del hero está en su estado final, sin transición de
  // entrada pendiente: `Reveal` devuelve los hijos sin wrapper de motion
  // cuando se pide movimiento reducido.
  const titular = page.getByRole("heading", { level: 1 });
  await expect(titular).toBeVisible();
  await expect(titular).toHaveCSS("opacity", "1");

  const serviceGrid = page.getByRole("heading", { name: "Qué hacemos" });
  await expect(serviceGrid).toHaveCSS("opacity", "1");
});

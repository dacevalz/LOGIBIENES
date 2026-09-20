import { expect, test } from "@playwright/test";
import { verificarContenidoSinJs } from "./_contenido-sin-js";

/** T048 — FR-008 / SC-003 / R-03 sobre las tres páginas de User Story 4. */

test("/propiedades sirve el formulario de búsqueda completo sin JavaScript", async ({
  request,
}) => {
  const html = await verificarContenidoSinJs(request, "/propiedades");

  // Cada campo de CriterioBusqueda con su etiqueta accesible: es lo que un
  // agente necesita para completar el formulario sin ver la pantalla (FR-009).
  expect(html).toContain('for="operacion"');
  expect(html).toContain('for="tipoInmueble"');
  expect(html).toContain('for="zona"');
  expect(html).toContain('for="presupuestoMin"');
  expect(html).toContain('for="presupuestoMax"');
  expect(html).toContain('for="consentimientoDatos"');

  // El mensaje de "todavía no hay listados" es contenido real, no un vacío.
  expect(html).toContain("Todavía no publicamos listados");
});

test("las páginas de confirmación de búsqueda sirven contenido sin JavaScript", async ({
  request,
}) => {
  await verificarContenidoSinJs(request, "/propiedades/gracias");
  await verificarContenidoSinJs(request, "/propiedades/error");
});

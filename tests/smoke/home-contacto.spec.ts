import { expect, test } from "@playwright/test";
import { verificarContenidoSinJs } from "./_contenido-sin-js";

/** T025 — FR-008 / SC-003 / R-03 sobre las dos páginas de User Story 1. */

test("/ sirve su contenido sin JavaScript y sin ocultamientos en línea", async ({
  request,
}) => {
  const html = await verificarContenidoSinJs(request, "/");

  // La propuesta de valor tiene que estar en el HTML, no solo tras hidratar.
  expect(html).toContain("comprar, vender, arrendar o invertir");
  expect(html).toContain("Fácil, rápido, digital");
  // Las 5 líneas de servicio se leen sin ejecutar nada.
  expect(html).toContain("Compra y venta de inmuebles");
  expect(html).toContain("Asesoría y avalúos");
});

test("/contacto sirve el formulario completo sin JavaScript", async ({
  request,
}) => {
  const html = await verificarContenidoSinJs(request, "/contacto");

  // Los campos y su etiqueta accesible: es lo que un agente necesita para
  // mapear cada input a su propósito (FR-009).
  expect(html).toContain('for="nombre"');
  expect(html).toContain('for="medioContacto"');
  expect(html).toContain('for="mensaje"');
  expect(html).toContain('for="consentimientoDatos"');

  // El honeypot existe, está oculto, y su técnica no usa ninguna de las
  // propiedades que este smoke vigila — por eso el test de arriba no lo marca.
  expect(html).toContain('name="honeypot"');
  expect(html).toContain("-9999px");
});

test("las páginas de confirmación también sirven contenido sin JavaScript", async ({
  request,
}) => {
  await verificarContenidoSinJs(request, "/contacto/gracias");
  await verificarContenidoSinJs(request, "/contacto/error");
});

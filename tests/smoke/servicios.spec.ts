import { expect, test } from "@playwright/test";
import { SERVICIOS } from "../../content/servicios";
import { verificarContenidoSinJs } from "./_contenido-sin-js";

/** T039 — FR-008 / SC-003 / R-03 sobre el hub y las 5 páginas de servicio. */

test("el hub /servicios sirve su contenido sin JavaScript", async ({
  request,
}) => {
  const html = await verificarContenidoSinJs(request, "/servicios");

  for (const servicio of SERVICIOS) {
    expect(
      html.includes(servicio.nombre),
      `el hub no menciona "${servicio.nombre}" en el HTML servido`,
    ).toBe(true);
  }
});

for (const servicio of SERVICIOS) {
  test(`/servicios/${servicio.slug} sirve su contenido sin JavaScript`, async ({
    request,
  }) => {
    const html = await verificarContenidoSinJs(
      request,
      `/servicios/${servicio.slug}`,
    );

    // Su propio texto, no solo el cascarón de la plantilla.
    const primerParrafo = servicio.descripcionLarga.split("\n\n")[0];
    expect(html).toContain(servicio.nombre);
    expect(html).toContain(primerParrafo.slice(0, 60));

    // El JSON-LD Service tiene que viajar en el HTML, no inyectarse por JS:
    // es la forma más fiable que tiene un agente de extraer datos exactos.
    expect(html).toContain('"@type":"Service"');
  });
}

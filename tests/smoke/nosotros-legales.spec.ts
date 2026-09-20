import { expect, test } from "@playwright/test";
import {
  AVISO_PRIVACIDAD_VERSION,
  TERMINOS_VERSION,
} from "../../content/legal";
import { verificarContenidoSinJs } from "./_contenido-sin-js";

/** T051 — FR-008 / SC-003 / R-03 sobre /nosotros y las dos páginas legales. */

test("/nosotros sirve su contenido sin JavaScript", async ({ request }) => {
  const html = await verificarContenidoSinJs(request, "/nosotros");
  expect(html).toContain("Una inmobiliaria simple y digital");
});

test("/aviso-de-privacidad sirve su contenido y declara su versión", async ({
  request,
}) => {
  const html = await verificarContenidoSinJs(request, "/aviso-de-privacidad");

  // La versión es la evidencia de QUÉ aceptó cada persona: si no se pinta,
  // el registro del correo apunta a un documento que nadie puede identificar.
  expect(html).toContain(AVISO_PRIVACIDAD_VERSION);
  expect(html).toContain("Ley 1581 de 2012");
});

test("/terminos-y-condiciones sirve su contenido sin JavaScript", async ({
  request,
}) => {
  const html = await verificarContenidoSinJs(
    request,
    "/terminos-y-condiciones",
  );
  expect(html).toContain("Términos y condiciones");
  // Su PROPIA versión. Que hoy coincida en valor con la del aviso no es
  // suficiente garantía: el acoplamiento se verifica a nivel de import en
  // `tests/unit/versiones-legales.test.ts`, porque esta aserción por sí sola
  // no distinguiría una constante de la otra mientras valgan lo mismo.
  expect(html).toContain(TERMINOS_VERSION);
});

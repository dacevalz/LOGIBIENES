import { expect, type APIRequestContext } from "@playwright/test";

/**
 * Verificación compartida de FR-008 / SC-003 / R-03.
 *
 * Pide el HTML crudo por HTTP — sin navegador, sin hidratación, sin JS — que
 * es exactamente lo que ve un crawler o un agente con timeout corto, y
 * comprueba dos cosas:
 *
 *  1. La página trae al menos un contenedor `[data-content]` con texto real.
 *  2. No hay `opacity:0`, `visibility:hidden` ni `display:none` EN LÍNEA.
 *
 * El punto 2 es el que atrapa la regresión que motivó `research.md` §10:
 * Framer Motion emite el `initial` como estilo inline durante el SSR, así que
 * un scroll-reveal mal hecho deja el texto presente pero invisible — y un test
 * que solo buscara el texto pasaría igual.
 *
 * El honeypot queda fuera por construcción: se oculta con
 * `position:absolute; left:-9999px`, que no usa ninguna de las tres
 * propiedades vigiladas. No hay que excluirlo a mano.
 */
const OCULTAMIENTOS = [
  /opacity\s*:\s*0(?![.\d%])/i,
  /visibility\s*:\s*hidden/i,
  /display\s*:\s*none/i,
];

export async function verificarContenidoSinJs(
  request: APIRequestContext,
  ruta: string,
) {
  const respuesta = await request.get(ruta);
  expect(respuesta.status(), `${ruta} debería responder 200`).toBe(200);

  const html = await respuesta.text();

  expect(
    html.includes("data-content"),
    `${ruta} no trae ningún contenedor [data-content] en el HTML servido`,
  ).toBe(true);

  // Solo los atributos style="..." — no cualquier aparición del texto en, por
  // ejemplo, una hoja de estilos enlazada o el payload de React.
  const estilosEnLinea = [...html.matchAll(/style="([^"]*)"/gi)].map(
    (m) => m[1],
  );

  for (const estilo of estilosEnLinea) {
    for (const patron of OCULTAMIENTOS) {
      expect(
        patron.test(estilo),
        `${ruta} tiene un estilo en línea que oculta contenido (${estilo}). ` +
          `El motion no puede partir de un estado oculto: sin JS quedaría invisible (research.md §10).`,
      ).toBe(false);
    }
  }

  return html;
}

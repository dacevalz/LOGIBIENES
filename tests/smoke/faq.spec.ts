import { expect, test } from "@playwright/test";
import { FAQ } from "../../content/faq";
import { ID_POR_PREGUNTA } from "../../content/faq-ids";
import { verificarContenidoSinJs } from "./_contenido-sin-js";

/**
 * T042 — el punto entero de esta página para AEO: la respuesta COMPLETA de
 * cada pregunta tiene que estar en el HTML crudo aunque el acordeón esté
 * colapsado. Si el texto solo apareciera al hacer clic, un motor de respuestas
 * no podría citarlo y un lector de pantalla tendría que abrir cada uno.
 */
test("cada respuesta está completa en el HTML servido, con el acordeón cerrado", async ({
  request,
}) => {
  const html = await verificarContenidoSinJs(request, "/preguntas-frecuentes");

  for (const { pregunta, respuesta } of FAQ) {
    expect(html.includes(pregunta), `falta la pregunta: "${pregunta}"`).toBe(
      true,
    );
    // La respuesta ENTERA, no un resumen ni los primeros caracteres.
    expect(
      html.includes(respuesta),
      `la respuesta de "${pregunta}" no está completa en el HTML crudo`,
    ).toBe(true);
  }
});

test("ningún <details> viene abierto: el colapso es real, no simulado", async ({
  request,
}) => {
  const respuesta = await request.get("/preguntas-frecuentes");
  const html = await respuesta.text();

  // Si algún <details> trajera `open`, el texto del test anterior estaría
  // porque la tarjeta está desplegada, no porque el marcado mantenga la
  // respuesta en el DOM al estar cerrada.
  const detallesAbiertos = [...html.matchAll(/<details[^>]*\sopen[\s>]/gi)];
  expect(
    detallesAbiertos.length,
    "hay <details open> en el HTML: el test de respuestas completas no probaría nada",
  ).toBe(0);

  // NO BORRAR pensando que es redundante: ESTA es la aserción que cierra el
  // hueco del primer test. El JSON-LD FAQPage duplica pregunta y respuesta en
  // el HTML, así que si el acordeón no renderizara ningún <details>, aquel
  // test pasaría igual por ese texto duplicado. Exigir un <details> por
  // entrada de content/faq.ts es lo que prueba que el acordeón existe de
  // verdad. (Lo señaló el code-reviewer en el gate de la fase 5: mi
  // razonamiento original atribuía el mérito al chequeo de `open`.)
  //
  // Se ancla al `id` de cada pregunta en vez de contar los <details> del
  // documento. Contar daba por hecho que el layout no tenía ninguno, y dejó de
  // ser cierto cuando el header ganó su menú móvil — también <details> nativo,
  // por la misma razón que este acordeón. Anclar al id es además más estricto:
  // catorce <details> cualesquiera ya no satisfacen la guarda.
  for (const { pregunta } of FAQ) {
    const id = ID_POR_PREGUNTA.get(pregunta);
    expect(id, `content/faq-ids.ts no asignó id a "${pregunta}"`).toBeDefined();

    expect(
      new RegExp(`<details[^>]*\\sid="${id}"[\\s>]`, "i").test(html),
      `no hay un <details id="${id}"> para "${pregunta}": el acordeón no está ` +
        `renderizando esa entrada como elemento colapsable propio`,
    ).toBe(true);
  }
});

test("el JSON-LD FAQPage viaja en el HTML y cubre todas las preguntas", async ({
  request,
}) => {
  const respuesta = await request.get("/preguntas-frecuentes");
  const html = await respuesta.text();

  expect(html).toContain('"@type":"FAQPage"');
  // Una entidad Question por entrada de content/faq.ts — ni de más ni de menos.
  expect([...html.matchAll(/"@type":"Question"/g)].length).toBe(FAQ.length);
});

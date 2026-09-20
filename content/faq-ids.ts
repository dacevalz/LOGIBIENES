import { FAQ } from "./faq";

/** Texto libre → fragmento de URL seguro, truncado. */
export function aSlug(pregunta: string): string {
  return (
    "faq-" +
    pregunta
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60)
  );
}

/**
 * Los `id` de las preguntas, calculados UNA vez sobre el arreglo completo.
 *
 * Son anclas de la página y atributos `id` del DOM. El truncado a 60
 * caracteres no garantiza unicidad por sí solo: dos preguntas que compartan
 * prefijo producirían el mismo `id`, que es HTML inválido y rompe el enlace
 * directo a una pregunta. Por eso se desambigua con un sufijo al detectar la
 * colisión, en vez de confiar en que el contenido actual no colisione.
 *
 * Vive aquí y no en `components/sections/faq-accordion.tsx` porque es dato
 * derivado del contenido, no UI: así `tests/unit/faq-ids.test.ts` puede
 * importarlo sin arrastrar JSX al runner de unitarios.
 */
export function construirIds(
  preguntas: readonly string[],
): ReadonlyMap<string, string> {
  const usados = new Map<string, number>();
  const mapa = new Map<string, string>();

  for (const pregunta of preguntas) {
    const base = aSlug(pregunta);
    const vistas = usados.get(base) ?? 0;
    usados.set(base, vistas + 1);
    mapa.set(pregunta, vistas === 0 ? base : `${base}-${vistas + 1}`);
  }
  return mapa;
}

export const ID_POR_PREGUNTA = construirIds(FAQ.map((p) => p.pregunta));

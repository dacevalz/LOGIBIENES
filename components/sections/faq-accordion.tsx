import { Accordion } from "@/components/ui/accordion";
import { FAQ, type CategoriaFaq } from "@/content/faq";
import { ID_POR_PREGUNTA } from "@/content/faq-ids";

/**
 * FAQ agrupada por categoría (T040).
 *
 * El texto completo de cada respuesta vive siempre en el DOM, dentro de
 * `[data-content]`: colapsar es solo visual, nunca condiciona el render
 * (FR-008). Eso lo garantiza `<details>` nativo — ver D-07 (por qué no lleva
 * `aria-expanded`) y D-10 (por qué el colapso no es el CSS de altura que
 * describe T040, y por qué el invariante se cumple igual).
 */
const ETIQUETAS: Record<CategoriaFaq, string> = {
  general: "Sobre Logibienes",
  venta: "Vender",
  compra: "Comprar",
  arriendo: "Arrendar",
  inversion: "Invertir y valorar",
};

/** Orden de presentación; no depende del orden del archivo de contenido. */
const ORDEN: readonly CategoriaFaq[] = [
  "general",
  "venta",
  "compra",
  "arriendo",
  "inversion",
];

export function FaqAccordion() {
  return (
    <div className="space-y-14">
      {ORDEN.map((categoria) => {
        const preguntas = FAQ.filter((p) => p.categoria === categoria);
        if (preguntas.length === 0) return null;

        return (
          <section key={categoria}>
            <h2 className="flex items-center gap-4 font-display text-2xl tracking-[-0.01em] text-navy">
              {ETIQUETAS[categoria]}
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-gradient-to-r from-navy/20 to-transparent"
              />
            </h2>
            <div className="mt-5">
              <Accordion
                items={preguntas.map((p) => ({
                  id: ID_POR_PREGUNTA.get(p.pregunta)!,
                  titulo: p.pregunta,
                  contenido: <p>{p.respuesta}</p>,
                }))}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}

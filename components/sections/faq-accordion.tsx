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
    <div className="space-y-12">
      {ORDEN.map((categoria) => {
        const preguntas = FAQ.filter((p) => p.categoria === categoria);
        if (preguntas.length === 0) return null;

        return (
          <section key={categoria}>
            <h2 className="font-display text-2xl text-navy">
              {ETIQUETAS[categoria]}
            </h2>
            <div className="mt-4">
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

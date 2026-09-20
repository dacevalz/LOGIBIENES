import type { ReactNode } from "react";

export type AccordionItem = {
  id: string;
  titulo: string;
  contenido: ReactNode;
};

/**
 * Acordeón sobre `<details>`/`<summary>` nativos.
 *
 * Por qué nativo y no un `<button aria-expanded>` con estado de React: sin
 * JavaScript, un `aria-expanded` no puede cambiar, así que el contenido
 * quedaría colapsado para siempre y la FAQ sería inoperable — exactamente lo
 * que prohíbe la Constitución I. `<details>` colapsa y expande sin una línea
 * de JS, expone el estado abierto/cerrado a los lectores de pantalla por sí
 * solo, y mantiene el texto de la respuesta en el HTML servido aunque esté
 * cerrado (FR-008).
 *
 * Por eso no lleva `aria-expanded` propio: agregárselo a un `<summary>`
 * duplica un estado que el elemento ya expone y es un antipatrón de ARIA.
 * Desviación registrada como D-07 frente al texto literal de T040.
 */
export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  return (
    <div className="divide-y divide-carbon/15 border-y border-carbon/15">
      {items.map((item) => (
        <details key={item.id} id={item.id} className="group py-2">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-lg font-medium text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric">
            {item.titulo}
            <span
              aria-hidden="true"
              className="shrink-0 text-electric transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="pb-4 text-carbon/90">{item.contenido}</div>
        </details>
      ))}
    </div>
  );
}

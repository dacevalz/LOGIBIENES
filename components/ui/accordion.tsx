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
          {/*
            El título va dentro de un <h3>, que el spec de HTML permite
            explícitamente como hijo de <summary>. Sin él, quien navega por
            encabezados con un lector de pantalla llega a la sección pero no a
            cada ítem del acordeón. Nivel 3 fijo: el único consumidor lo usa
            bajo un <h2> de categoría; si algún día hace falta otro nivel, se
            parametriza entonces y no antes.
          */}
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric">
            <h3 className="text-lg font-medium text-navy">{item.titulo}</h3>
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

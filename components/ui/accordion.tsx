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
 *
 * El movimiento es solo del indicador `+` → `×` y de un realce de fondo al
 * pasar el cursor. Animar el ALTO de `<details>` requiere `::details-content`,
 * que hoy no está en todos los motores: si falla, falla ocultando texto de la
 * FAQ, que es justo lo que este marcado existe para evitar.
 */
export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  return (
    <div className="divide-y divide-navy/10 overflow-hidden rounded-card border border-navy/10 bg-white shadow-card">
      {items.map((item) => (
        <details key={item.id} id={item.id} className="group scroll-mt-28">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-frost focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-electric sm:px-6 sm:py-5">
            {/*
              El título va dentro de un <h3>, que el spec de HTML permite
              explícitamente como hijo de <summary>. Sin él, quien navega por
              encabezados con un lector de pantalla llega a la sección pero no a
              cada ítem del acordeón. Nivel 3 fijo: el único consumidor lo usa
              bajo un <h2> de categoría; si algún día hace falta otro nivel, se
              parametriza entonces y no antes.
            */}
            <h3 className="text-lg font-medium leading-snug text-navy">
              {item.titulo}
            </h3>
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-full border border-navy/15 text-xl leading-none text-electric transition-transform duration-300 ease-brand group-open:rotate-45 motion-reduce:transform-none"
            >
              +
            </span>
          </summary>
          <div className="px-5 pb-5 leading-relaxed text-carbon/85 sm:px-6 sm:pb-6">
            {item.contenido}
          </div>
        </details>
      ))}
    </div>
  );
}

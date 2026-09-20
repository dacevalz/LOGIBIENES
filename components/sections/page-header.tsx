import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Encabezado de página interior.
 *
 * Existe por la misma razón que `CtaBand`: siete páginas repetían el mismo
 * bloque (`h1` + párrafo guía) con cuatro escalas tipográficas distintas y
 * tres espaciados distintos, así que el sitio cambiaba de ritmo al navegar.
 *
 * NO lleva `data-content` a propósito. `/servicios/{slug}` afirma tener UN
 * solo contenedor `[data-content]` (`tests/e2e/us2-servicios.spec.ts` lo lee
 * con `innerText` en modo estricto); este componente va DENTRO del que la
 * página ya declara.
 */
export function PageHeader({
  eyebrow,
  titulo,
  volver,
  children,
}: {
  /** Rótulo corto de sección. Decorativo: el `h1` no depende de él. */
  eyebrow?: string;
  titulo: string;
  /** Migaja de vuelta al hub, cuando la página cuelga de uno. */
  volver?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      {volver && (
        <p className="mb-6">
          <Link
            href={volver.href}
            className="group inline-flex min-h-11 items-center gap-2 text-sm text-carbon/70 transition-colors duration-200 hover:text-electric"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-brand group-hover:-translate-x-1 motion-reduce:transform-none"
            >
              ←
            </span>
            {volver.label}
          </Link>
        </p>
      )}

      {eyebrow && (
        <p className="font-display text-sm uppercase tracking-[0.2em] text-electric">
          {eyebrow}
        </p>
      )}

      <h1 className="mt-4 font-display text-[clamp(2.25rem,5.2vw,3.75rem)] leading-[1.06] tracking-[-0.015em] text-navy">
        {titulo}
      </h1>

      {children && (
        <div className="mt-5 max-w-2xl text-lg leading-relaxed text-carbon/75 sm:text-xl">
          {children}
        </div>
      )}
    </div>
  );
}

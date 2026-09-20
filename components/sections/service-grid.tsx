import Link from "next/link";
import { SERVICIOS } from "@/content/servicios";

/**
 * Resumen de las 5 líneas de servicio en el Home (T026).
 *
 * Cada tarjeta es un enlace completo a su página: un solo destino por tarjeta,
 * sin enlaces anidados, y con área de toque muy por encima de los 44 px.
 */
export function ServiceGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div data-content>
        <h2 className="font-display text-3xl text-navy sm:text-4xl">
          Qué hacemos
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-carbon/80">
          Cinco frentes, una sola inmobiliaria. No tienes que buscar un
          proveedor distinto para cada paso de la misma operación.
        </p>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICIOS.map((servicio) => (
            <li key={servicio.slug}>
              <Link
                href={`/servicios/${servicio.slug}`}
                className="flex h-full flex-col rounded-xl border border-carbon/15 bg-white p-6 transition-colors hover:border-electric focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric"
              >
                <h3 className="font-display text-xl text-navy">
                  {servicio.nombre}
                </h3>
                <p className="mt-3 text-carbon/80">
                  {servicio.descripcionCorta}
                </p>
                <span
                  aria-hidden="true"
                  className="mt-4 font-medium text-electric"
                >
                  Ver más →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10">
          <Link
            href="/servicios"
            className="font-medium text-electric underline underline-offset-4"
          >
            Ver todos los servicios en detalle
          </Link>
        </p>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Reveal } from "@/components/sections/reveal";
import { SERVICIOS } from "@/content/servicios";

/**
 * Resumen de las 5 líneas de servicio en el Home (T026).
 *
 * Cada tarjeta es un enlace completo a su página: un solo destino por tarjeta,
 * sin enlaces anidados, y con área de toque muy por encima de los 44 px.
 *
 * Distribución: la grilla es de 6 columnas en `lg`, con las tres primeras
 * tarjetas a 2 y las dos últimas a 3. Con `grid-cols-3` (lo anterior) cinco
 * ítems dejaban la última fila coja, con dos tarjetas angostas y un hueco. Así
 * las dos filas quedan llenas y el corte se lee intencional.
 *
 * El reveal escalonado vive aquí y no en `app/page.tsx`: envolver toda la
 * sección en un solo `<Reveal>` animaba un bloque de 700 px de una sola pieza,
 * que a esa escala se percibe como un salto, no como una entrada.
 */
export function ServiceGrid() {
  const ultimaFila = SERVICIOS.length % 3 || 3;

  return (
    <section className="shell section-y max-w-6xl">
      <div data-content>
        <Reveal>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-electric">
            Líneas de servicio
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl leading-[1.1] tracking-[-0.015em] text-navy sm:text-5xl">
            Qué hacemos
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-carbon/75">
            Cinco frentes, una sola inmobiliaria. No tienes que buscar un
            proveedor distinto para cada paso de la misma operación.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {SERVICIOS.map((servicio, i) => (
            <li
              key={servicio.slug}
              className={
                i < SERVICIOS.length - ultimaFila
                  ? "lg:col-span-2"
                  : "lg:col-span-3"
              }
            >
              <Reveal delay={i * 70} className="h-full">
                <Link
                  href={`/servicios/${servicio.slug}`}
                  className="group flex h-full flex-col rounded-card border border-navy/10 bg-white p-7 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-brand hover:-translate-y-1 hover:border-electric/40 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric motion-reduce:hover:translate-y-0 sm:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-sm tracking-[0.2em] text-electric"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-4 font-display text-xl leading-snug text-navy sm:text-2xl">
                    {servicio.nombre}
                  </h3>

                  <p className="mt-3 flex-1 leading-relaxed text-carbon/75">
                    {servicio.descripcionCorta}
                  </p>

                  <span
                    aria-hidden="true"
                    className="mt-6 inline-flex items-center gap-2 font-medium text-electric"
                  >
                    Ver más
                    <svg
                      viewBox="0 0 20 20"
                      className="size-4 transition-transform duration-300 ease-brand group-hover:translate-x-1 motion-reduce:transform-none"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={120}>
          <p className="mt-12">
            <Link
              href="/servicios"
              className="group inline-flex min-h-11 items-center gap-2 font-medium text-electric"
            >
              <span className="underline underline-offset-4">
                Ver todos los servicios en detalle
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-brand group-hover:translate-x-1 motion-reduce:transform-none"
              >
                →
              </span>
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

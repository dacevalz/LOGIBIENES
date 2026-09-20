import Link from "next/link";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import { Reveal } from "@/components/sections/reveal";
import { SERVICIOS } from "@/content/servicios";
import { buildBreadcrumbJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Servicios",
  description:
    "Compra y venta, arrendamientos e intermediación, administración de inmuebles, proyectos y construcción, y asesoría y avalúos. Las cinco líneas de Logibienes en Medellín y el resto de Colombia.",
  path: "/servicios",
});

const breadcrumb = buildBreadcrumbJsonLd([
  { name: "Servicios", path: "/servicios" },
]);

/** Hub de servicios (T031). Itera `content/servicios.ts` — no repite la lista. */
export default function Servicios() {
  return (
    <main id="contenido" className="shell section-y max-w-6xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />

      <div data-content>
        <PageHeader eyebrow="Líneas de servicio" titulo="Servicios">
          Cinco frentes que cubren el ciclo completo de un inmueble: comprarlo o
          venderlo, arrendarlo, administrarlo, construirlo, o simplemente
          entender cuánto vale antes de decidir.
        </PageHeader>

        {/*
          Lista de lectura, no grilla: aquí cada línea lleva más texto que en el
          home y una tarjeta angosta la partiría en seis renglones. El número al
          margen da el ancla visual que hacía falta para no leerlas como cinco
          párrafos seguidos.
        */}
        <ul className="mt-14 space-y-5">
          {SERVICIOS.map((servicio, i) => (
            <li key={servicio.slug}>
              <Reveal delay={i * 60}>
                <article className="group rounded-card border border-navy/10 bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-brand hover:-translate-y-1 hover:border-electric/40 hover:shadow-lift motion-reduce:hover:translate-y-0 sm:p-8">
                  <div className="flex gap-5 sm:gap-7">
                    <span
                      aria-hidden="true"
                      className="hidden shrink-0 font-display text-sm tracking-[0.2em] text-electric sm:block sm:pt-2"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0">
                      <h2 className="font-display text-2xl leading-snug text-navy sm:text-3xl">
                        <Link
                          href={`/servicios/${servicio.slug}`}
                          className="transition-colors duration-200 hover:text-electric focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric"
                        >
                          {servicio.nombre}
                        </Link>
                      </h2>
                      <p className="mt-3 max-w-3xl leading-relaxed text-carbon/75">
                        {servicio.descripcionCorta}
                      </p>
                      <p className="mt-5">
                        <Link
                          href={`/servicios/${servicio.slug}`}
                          className="inline-flex min-h-11 items-center gap-2 font-medium text-electric"
                        >
                          <span className="underline underline-offset-4">
                            {servicio.ctaTexto}
                          </span>
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-300 ease-brand group-hover:translate-x-1 motion-reduce:transform-none"
                          >
                            →
                          </span>
                        </Link>
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <CtaBand titulo="¿No sabes cuál de los cinco necesitas?">
          Cuéntanos tu caso y te decimos por dónde empezar. No tienes que
          tenerlo resuelto para escribirnos.
        </CtaBand>
      </div>
    </main>
  );
}

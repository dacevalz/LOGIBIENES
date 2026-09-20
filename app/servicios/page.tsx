import Link from "next/link";
import { ContactCta } from "@/components/contact-cta";
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
    <main id="contenido" className="mx-auto max-w-6xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />

      <div data-content>
        <h1 className="font-display text-4xl text-navy sm:text-5xl">
          Servicios
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-carbon/80">
          Cinco frentes que cubren el ciclo completo de un inmueble: comprarlo o
          venderlo, arrendarlo, administrarlo, construirlo, o simplemente
          entender cuánto vale antes de decidir.
        </p>

        <ul className="mt-12 space-y-6">
          {SERVICIOS.map((servicio) => (
            <li
              key={servicio.slug}
              className="rounded-xl border border-carbon/15 bg-white p-6 sm:p-8"
            >
              <h2 className="font-display text-2xl text-navy">
                <Link
                  href={`/servicios/${servicio.slug}`}
                  className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric"
                >
                  {servicio.nombre}
                </Link>
              </h2>
              <p className="mt-3 max-w-3xl text-carbon/80">
                {servicio.descripcionCorta}
              </p>
              <p className="mt-4">
                <Link
                  href={`/servicios/${servicio.slug}`}
                  className="font-medium text-electric underline underline-offset-4"
                >
                  {servicio.ctaTexto}
                </Link>
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-xl bg-navy p-8 text-white">
          <h2 className="font-display text-2xl">
            ¿No sabes cuál de los cinco necesitas?
          </h2>
          <p className="mt-3 text-white/85">
            Cuéntanos tu caso y te decimos por dónde empezar. No tienes que
            tenerlo resuelto para escribirnos.
          </p>
          <div className="mt-6">
            <ContactCta />
          </div>
        </div>
      </div>
    </main>
  );
}

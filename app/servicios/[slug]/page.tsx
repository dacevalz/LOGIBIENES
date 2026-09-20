import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import { SERVICIOS, getServicio } from "@/content/servicios";
import {
  SITE_NAME,
  SITE_URL,
  buildBreadcrumbJsonLd,
  buildMetadata,
  jsonLdScript,
} from "@/lib/seo";

/**
 * Las 5 páginas de servicio (T032–T037).
 *
 * DESVIACIÓN DECLARADA (D-09): `tasks.md` pide cinco `page.tsx` separados.
 * Esto es una ruta `[slug]` con `generateStaticParams`, que produce
 * exactamente las mismas 5 URLs estáticas, cada una con su contenido, su
 * metadata y su JSON-LD `Service` propios — el resultado servido es idéntico.
 * La razón de unificar: las cinco páginas leerían el mismo
 * `content/servicios.ts` y renderizarían la misma estructura, así que cinco
 * archivos serían cinco copias que pueden divergir. Además `app/sitemap.ts` ya
 * deriva las URLs de ese mismo archivo: con páginas escritas a mano, agregar
 * una sexta línea de servicio publicaría una URL en el sitemap que devuelve
 * 404, y aquí es imposible que eso pase.
 */
export function generateStaticParams() {
  return SERVICIOS.map((servicio) => ({ slug: servicio.slug }));
}

/** Solo los 5 slugs conocidos: cualquier otro es 404, no una página vacía. */
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const servicio = getServicio(slug);
  if (!servicio) return {};

  return buildMetadata({
    title: servicio.nombre,
    description: servicio.descripcionCorta,
    path: `/servicios/${servicio.slug}`,
  });
}

export default async function PaginaServicio({ params }: Props) {
  const { slug } = await params;
  const servicio = getServicio(slug);
  if (!servicio) notFound();

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Servicios", path: "/servicios" },
    { name: servicio.nombre, path: `/servicios/${servicio.slug}` },
  ]);

  // `provider` apunta a la misma Organization que declara `app/layout.tsx`.
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: servicio.nombre,
    description: servicio.descripcionCorta,
    url: `${SITE_URL}/servicios/${servicio.slug}`,
    areaServed: { "@type": "Country", name: "Colombia" },
    provider: {
      "@type": "RealEstateAgent",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const parrafos = servicio.descripcionLarga.split("\n\n");

  return (
    <main id="contenido" className="shell section-y max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(serviceJsonLd) }}
      />

      {/*
        UN solo contenedor [data-content] en esta ruta: `us2-servicios.spec.ts`
        lo lee con `innerText` en modo estricto para comprobar que los cinco
        cuerpos son distintos. Un segundo contenedor rompería ese test.
      */}
      <div data-content>
        <PageHeader
          titulo={servicio.nombre}
          volver={{ href: "/servicios", label: "Todos los servicios" }}
        >
          {servicio.descripcionCorta}
        </PageHeader>

        {/* Primer párrafo destacado: da una entrada de lectura en vez de un
            muro de texto de la misma densidad desde la primera línea. */}
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-carbon/90">
          {parrafos.map((parrafo, i) =>
            i === 0 ? (
              <p
                key={i}
                className="border-l-2 border-electric/40 pl-5 text-xl leading-relaxed text-carbon"
              >
                {parrafo}
              </p>
            ) : (
              <p key={i}>{parrafo}</p>
            ),
          )}
        </div>

        <CtaBand titulo={servicio.ctaTexto}>
          Te respondemos por el medio que prefieras.
        </CtaBand>
      </div>
    </main>
  );
}

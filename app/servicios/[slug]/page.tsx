import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactCta } from "@/components/contact-cta";
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
    <main id="contenido" className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(serviceJsonLd) }}
      />

      <div data-content>
        <p className="text-sm text-carbon/70">
          <Link
            href="/servicios"
            className="underline underline-offset-4 hover:text-electric"
          >
            Servicios
          </Link>
        </p>

        <h1 className="mt-3 font-display text-4xl text-navy sm:text-5xl">
          {servicio.nombre}
        </h1>
        <p className="mt-4 text-xl text-carbon/80">
          {servicio.descripcionCorta}
        </p>

        <div className="mt-8 space-y-5 text-lg leading-relaxed">
          {parrafos.map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-navy p-8 text-white">
          <h2 className="font-display text-2xl">{servicio.ctaTexto}</h2>
          <p className="mt-3 text-white/85">
            Te respondemos por el medio que prefieras.
          </p>
          <div className="mt-6">
            <ContactCta />
          </div>
        </div>
      </div>
    </main>
  );
}

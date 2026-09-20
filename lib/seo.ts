import type { Metadata } from "next";

/**
 * Origen absoluto del sitio. Lo necesitan `sitemap.xml`, `robots.txt`, los
 * canonical y el JSON-LD.
 *
 * Deliberadamente NO trae un dominio por defecto: publicar `logibienes.com`
 * antes de que el dominio esté confirmado sería un dato inventado en datos
 * estructurados, que un consumidor de máquina trata como fuente de verdad
 * (Constitución III, mismo criterio que `research.md` §9 aplica a
 * `telephone`/`email`). Orden de resolución:
 *   1. NEXT_PUBLIC_SITE_URL — el dominio real, cuando exista.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — lo inyecta Vercel en cada deploy.
 *   3. localhost — desarrollo.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");

export const SITE_NAME = "Logibienes";

/** Imagen de marca para Open Graph. ponytail: el logo real en vez de una OG
 *  image generada — no hay tarea que pida una, y una imagen dedicada 1200x630
 *  es trabajo de Polish, no de Foundational. */
const OG_IMAGE = "/logo/navy-b.png";

type BuildMetadataInput = {
  /** Sin el sufijo de marca: `buildMetadata` lo agrega salvo en el home. */
  title: string;
  description: string;
  /** Ruta absoluta desde la raíz, ej. `/servicios/compra-venta`. */
  path: string;
  /** `true` en las páginas /gracias y las páginas /error — no son contenido a posicionar. */
  noindex?: boolean;
};

/**
 * Metadata única por página (FR-010): title/description propios, canonical
 * absoluto y Open Graph. Usado por TODAS las páginas — no repetir esta lógica
 * página por página.
 */
export function buildMetadata({
  title,
  description,
  path,
  noindex = false,
}: BuildMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;

  // El sufijo de marca lo pone el `title.template` de `app/layout.tsx`. Una
  // versión anterior lo concatenaba TAMBIÉN aquí, y el resultado era
  // "Contacto | Logibienes | Logibienes" en las 12 páginas que no son el
  // home. Para el home se usa `absolute`, que salta la plantilla: su título
  // ya nombra la marca al principio.
  const tituloResuelto = path === "/" ? { absolute: title } : title;
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: tituloResuelto,
    description,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      locale: "es_CO",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
      images: [{ url: OG_IMAGE, alt: `Logotipo de ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}

export type Breadcrumb = { name: string; path: string };

/**
 * `BreadcrumbList` JSON-LD para páginas internas (`contracts/machine-readable.md`).
 * El home siempre es el primer eslabón; no lo pases en `trail`.
 */
export function buildBreadcrumbJsonLd(trail: readonly Breadcrumb[]) {
  const items = [{ name: "Inicio", path: "/" }, ...trail];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * Serializa JSON-LD para un `<script type="application/ld+json">`.
 *
 * Escapa `<` como `<`: sin eso, un `</script>` dentro de cualquier string
 * del objeto cierra la etiqueta antes de tiempo y el resto del JSON se
 * interpreta como HTML (XSS por ruptura de contexto). Todo JSON-LD del sitio
 * pasa por aquí — no uses `JSON.stringify` suelto en una página.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

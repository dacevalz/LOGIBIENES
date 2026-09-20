import type { MetadataRoute } from "next";
import { SERVICIOS } from "@/content/servicios";
import { SITE_URL } from "@/lib/seo";

/**
 * Las 13 rutas indexables (`contracts/machine-readable.md`).
 *
 * Excluye `/api/` y las páginas de confirmación (`/contacto/gracias`,
 * `/contacto/error`, `/propiedades/gracias`, `/propiedades/error`): no son
 * contenido a indexar, y van `noindex`.
 *
 * Las 5 de servicio se derivan de `content/servicios.ts` — agregar una línea
 * de servicio ahí la publica aquí sola, sin tocar este archivo.
 */
const RUTAS_FIJAS = [
  { path: "/", priority: 1 },
  { path: "/servicios", priority: 0.9 },
  { path: "/contacto", priority: 0.9 },
  { path: "/propiedades", priority: 0.8 },
  { path: "/nosotros", priority: 0.7 },
  { path: "/preguntas-frecuentes", priority: 0.7 },
  { path: "/aviso-de-privacidad", priority: 0.3 },
  { path: "/terminos-y-condiciones", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...RUTAS_FIJAS.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      priority,
    })),
    ...SERVICIOS.map((servicio) => ({
      url: `${SITE_URL}/servicios/${servicio.slug}`,
      lastModified,
      priority: 0.8,
    })),
  ];
}

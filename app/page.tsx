import { Hero } from "@/components/sections/hero";
import { ServiceGrid } from "@/components/sections/service-grid";
import { buildBreadcrumbJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = buildMetadata({
  title:
    "Logibienes — comprar, vender, arrendar o invertir en bienes raíces en Colombia",
  description:
    "Inmobiliaria colombiana con domicilio en Medellín. Compra y venta, arrendamientos, administración de inmuebles, proyectos y construcción, y asesoría y avalúos. Fácil, rápido, digital.",
  path: "/",
});

// El home es el primer eslabón, así que su BreadcrumbList es solo "Inicio".
const breadcrumb = buildBreadcrumbJsonLd([]);

export default function Home() {
  return (
    <main id="contenido">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />

      <Hero />

      {/* El reveal ya no se aplica aquí en bloque: `ServiceGrid` escalona sus
          propios hijos. Envolver los 700 px de la sección en un solo `<Reveal>`
          se percibía como un salto, no como una entrada. Sigue estando por
          debajo del pliegue, así que no hay parpadeo al hidratar. */}
      <ServiceGrid />
    </main>
  );
}

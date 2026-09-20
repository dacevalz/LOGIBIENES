import { Hero } from "@/components/sections/hero";
import { Reveal } from "@/components/sections/reveal";
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

      {/* Por debajo del pliegue: aquí el reveal no produce parpadeo al hidratar. */}
      <Reveal>
        <ServiceGrid />
      </Reveal>
    </main>
  );
}

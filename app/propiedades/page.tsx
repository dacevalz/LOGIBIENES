import Link from "next/link";
import { ContactCta } from "@/components/contact-cta";
import { LeadForm } from "@/components/sections/lead-form";
import { PageHeader } from "@/components/sections/page-header";
import { nuevoFormTimestamp } from "@/lib/leads";
import { buildBreadcrumbJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";

/**
 * NO QUITAR (AS-03). Igual que en `/contacto`: sin `force-dynamic` esta página
 * se prerrenderiza y el par `(formTimestamp, formTimestampSig)` queda congelado
 * en tiempo de build, con lo que el mismo par serviría para todo visitante
 * indefinidamente y la ventana anti-replay de 2 h dejaría de acotar nada.
 * `tests/unit/paginas-formulario.test.ts` falla si este export desaparece.
 */
export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Propiedades",
  description:
    "Todavía no publicamos listados. Cuéntanos qué buscas — operación, tipo de inmueble, zona y presupuesto — y te contactamos cuando tengamos algo que encaje.",
  path: "/propiedades",
});

const breadcrumb = buildBreadcrumbJsonLd([
  { name: "Propiedades", path: "/propiedades" },
]);

export default function Propiedades() {
  const { formTimestamp, formTimestampSig } = nuevoFormTimestamp();

  return (
    <main id="contenido" className="shell section-y max-w-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />

      <div data-content className="mb-10">
        {/*
          Constitución III: se dice lo que hay, no se simula un catálogo vacío
          ni se promete inventario que no existe.
        */}
        <PageHeader eyebrow="Propiedades" titulo="Cuéntanos qué buscas">
          Todavía no publicamos listados en el sitio. En vez de mostrarte una
          lista que no corresponde a lo que necesitas, preferimos que nos digas
          qué estás buscando y avisarte cuando tengamos algo que encaje.
        </PageHeader>

        <p className="mt-5 max-w-2xl leading-relaxed text-carbon/75">
          Toma menos de un minuto. Si prefieres contarlo en una conversación,{" "}
          <Link
            href="/contacto"
            className="font-medium text-electric underline underline-offset-4"
          >
            escríbenos por aquí
          </Link>
          .
        </p>
      </div>

      <div className="rounded-card border border-navy/10 bg-white p-6 shadow-card sm:p-8">
        <LeadForm
          tipo="busqueda"
          paginaOrigen="/propiedades"
          formTimestamp={formTimestamp}
          formTimestampSig={formTimestampSig}
          fallbackCta={<ContactCta />}
        />
      </div>
    </main>
  );
}

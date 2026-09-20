import Link from "next/link";
import { ContactCta } from "@/components/contact-cta";
import { LeadForm } from "@/components/sections/lead-form";
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
    <main id="contenido" className="mx-auto max-w-2xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />

      <div data-content className="mb-10">
        <h1 className="font-display text-4xl text-navy sm:text-5xl">
          Cuéntanos qué buscas
        </h1>
        {/*
          Constitución III: se dice lo que hay, no se simula un catálogo vacío
          ni se promete inventario que no existe.
        */}
        <p className="mt-4 text-lg text-carbon/80">
          Todavía no publicamos listados en el sitio. En vez de mostrarte una
          lista que no corresponde a lo que necesitas, preferimos que nos digas
          qué estás buscando y avisarte cuando tengamos algo que encaje.
        </p>
        <p className="mt-4 text-carbon/80">
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

      <LeadForm
        tipo="busqueda"
        paginaOrigen="/propiedades"
        formTimestamp={formTimestamp}
        formTimestampSig={formTimestampSig}
        fallbackCta={<ContactCta />}
      />
    </main>
  );
}

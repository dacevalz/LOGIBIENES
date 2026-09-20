import { ContactCta } from "@/components/contact-cta";
import { LeadForm } from "@/components/sections/lead-form";
import { nuevoFormTimestamp } from "@/lib/leads";
import { buildBreadcrumbJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";

/**
 * NO QUITAR (AS-03). Sin `force-dynamic` esta página se prerrenderiza y el par
 * `(formTimestamp, formTimestampSig)` queda congelado en tiempo de build: el
 * mismo par serviría para todo visitante, indefinidamente, y la ventana de 2 h
 * del contrato dejaría de acotar nada. Es la precondición de la que depende
 * toda la defensa anti-replay del formulario. `tests/unit/paginas-formulario.test.ts`
 * falla si este export desaparece.
 */
export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Contacto",
  description:
    "Escríbenos y te respondemos por el medio que prefieras. Compra, venta, arriendo, administración de inmuebles, proyectos y avalúos en Medellín y el resto de Colombia.",
  path: "/contacto",
});

const breadcrumb = buildBreadcrumbJsonLd([
  { name: "Contacto", path: "/contacto" },
]);

export default function Contacto() {
  // Fresco en cada request, precisamente porque la página es force-dynamic.
  const { formTimestamp, formTimestampSig } = nuevoFormTimestamp();

  return (
    <main id="contenido" className="mx-auto max-w-2xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />

      <div data-content className="mb-10">
        <h1 className="font-display text-4xl text-navy">Hablemos</h1>
        <p className="mt-4 text-lg text-carbon/80">
          Cuéntanos qué necesitas y te respondemos por donde prefieras. No hace
          falta que tengas los papeles listos ni las cuentas claras para
          escribirnos.
        </p>
        <div className="mt-6">
          <ContactCta variant="secondary" />
        </div>
      </div>

      <LeadForm
        tipo="contacto"
        paginaOrigen="/contacto"
        formTimestamp={formTimestamp}
        formTimestampSig={formTimestampSig}
        fallbackCta={<ContactCta />}
      />
    </main>
  );
}

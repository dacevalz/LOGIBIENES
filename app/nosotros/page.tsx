import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import { SERVICIOS } from "@/content/servicios";
import { buildBreadcrumbJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Nosotros",
  description:
    "Logibienes S.A.S. es una inmobiliaria colombiana con domicilio en Medellín. Cubrimos el ciclo completo de un inmueble: comprarlo, venderlo, arrendarlo, administrarlo, construirlo o valorarlo.",
  path: "/nosotros",
});

const breadcrumb = buildBreadcrumbJsonLd([
  { name: "Nosotros", path: "/nosotros" },
]);

/**
 * T049. No tiene FR dedicado: apoya SC-001 (propuesta de valor) y SC-006
 * (contexto para que un motor de respuestas pueda describir a la empresa).
 *
 * Constitución III: esta es la página donde más tienta inventar — años de
 * experiencia, número de operaciones cerradas, tamaño del equipo, premios.
 * No hay ninguno de esos datos porque nadie los ha entregado. Lo único que se
 * afirma sale de los estatutos (el objeto social) y de `spec.md` §Assumptions
 * (el domicilio en Medellín, confirmado por el cliente; el Artículo 4 de los
 * estatutos quedó sin diligenciar).
 */
export default function Nosotros() {
  return (
    <main id="contenido" className="shell section-y max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />

      <div data-content>
        <PageHeader
          eyebrow="Nosotros"
          titulo="Una inmobiliaria simple y digital"
        />

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-carbon/90">
          <p>
            Logibienes S.A.S. es una sociedad comercial colombiana con domicilio
            en Medellín, Antioquia. Trabajamos bienes raíces en el país, urbanos
            y rurales.
          </p>
          <p>
            La idea detrás del nombre es simple: que mover un inmueble deje de
            ser un proceso opaco. Que sepas en qué paso vas, qué falta, quién lo
            hace y cuándo. Que no tengas que perseguir a nadie para enterarte de
            algo que te concierne.
          </p>
          <p>
            Por eso cubrimos el ciclo completo en vez de una sola parte: la
            mayoría de los dolores de cabeza de una operación inmobiliaria
            aparecen justo en las costuras entre un proveedor y el siguiente.
          </p>
        </div>

        <h2 className="mt-16 font-display text-2xl tracking-[-0.01em] text-navy sm:text-3xl">
          Qué cubrimos
        </h2>
        {/* Tarjeta por línea en vez de viñetas: cinco entradas de dos renglones
            seguidas se leen como un solo bloque gris. */}
        <ul className="mt-6 divide-y divide-navy/10 overflow-hidden rounded-card border border-navy/10 bg-white shadow-card">
          {SERVICIOS.map((servicio) => (
            <li key={servicio.slug} className="flex gap-4 p-5 sm:p-6">
              <span
                aria-hidden="true"
                className="mt-2.5 h-px w-5 shrink-0 bg-electric"
              />
              <span className="leading-relaxed text-carbon/85">
                <strong className="font-display text-lg text-navy">
                  {servicio.nombre}
                </strong>
                <br />
                {servicio.descripcionCorta}
              </span>
            </li>
          ))}
        </ul>

        <h2 className="mt-16 font-display text-2xl tracking-[-0.01em] text-navy sm:text-3xl">
          Cómo hablamos
        </h2>
        <div className="mt-6 space-y-6 text-lg leading-relaxed text-carbon/90">
          <p>
            Sin jerga notarial en la conversación de venta. La letra menuda va
            donde corresponde —en el contrato y en los documentos legales— y ahí
            sí, completa y sin sorpresas.
          </p>
          <p>
            Si todavía no sabes qué necesitas, esa también es una conversación
            válida. No hace falta que llegues con la decisión tomada ni con los
            papeles en la mano.
          </p>
        </div>

        <CtaBand titulo="¿Hablamos?">
          Cuéntanos qué tienes en mente y te decimos por dónde empezar.
        </CtaBand>
      </div>
    </main>
  );
}

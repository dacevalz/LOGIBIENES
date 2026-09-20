import Link from "next/link";
import { TERMINOS_VERSION } from "@/content/legal";
import { buildBreadcrumbJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Términos y condiciones",
  description:
    "Condiciones de uso del sitio web de Logibienes S.A.S.: alcance de la información publicada, propiedad intelectual, enlaces externos y ley aplicable.",
  path: "/terminos-y-condiciones",
});

const breadcrumb = buildBreadcrumbJsonLd([
  { name: "Términos y condiciones", path: "/terminos-y-condiciones" },
]);

/**
 * T050. Condiciones de uso del SITIO, no de los contratos de servicio: esos
 * se pactan por escrito caso por caso y este documento no los sustituye ni
 * los resume.
 *
 * Constitución III: no se nombran tarifas, plazos, garantías ni datos de
 * contacto que todavía no existen (AS-01). Igual que el aviso de privacidad,
 * recomendado que lo revise un abogado antes de producción — es la misma nota
 * que traen los propios estatutos.
 */
export default function TerminosYCondiciones() {
  return (
    <main id="contenido" className="shell section-y max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />

      {/* Ver nota en `/aviso-de-privacidad`: mismo tratamiento tipográfico. */}
      <div data-content className="legal-doc leading-relaxed text-carbon/90">
        <h1 className="font-display text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.06] tracking-[-0.015em] text-navy">
          Términos y condiciones
        </h1>
        <p className="text-sm text-carbon/70">
          Versión vigente: <strong>{TERMINOS_VERSION}</strong>
        </p>

        <h2 className="font-display text-2xl text-navy">Qué cubre esto</h2>
        <p>
          Estas condiciones regulan el uso de este sitio web, operado por
          Logibienes S.A.S., sociedad comercial colombiana con domicilio en
          Medellín, Antioquia. Al navegarlo o enviarnos un formulario, aceptas
          lo que sigue.
        </p>

        <h2 className="font-display text-2xl text-navy">
          La información publicada es orientativa
        </h2>
        <p>
          El contenido de este sitio —descripciones de servicios, preguntas
          frecuentes y guías— tiene fines informativos. No constituye una oferta
          comercial vinculante, ni asesoría jurídica, tributaria o financiera
          para tu caso particular.
        </p>
        <p>
          Las condiciones concretas de cualquier servicio (alcance, honorarios y
          plazos) se pactan por escrito antes de iniciarlo. Si algo de este
          sitio contradice lo que diga ese acuerdo escrito, prevalece el
          acuerdo.
        </p>

        <h2 className="font-display text-2xl text-navy">
          Formularios y comunicaciones
        </h2>
        <p>
          Enviar un formulario no crea una relación contractual ni reserva
          ningún inmueble. Es una solicitud de contacto: significa que te
          escribiremos, no que hayamos aceptado un encargo.
        </p>
        <p>
          Nos comprometemos a usar los datos que nos dejas solo para atender esa
          solicitud, en los términos del{" "}
          <Link
            href="/aviso-de-privacidad"
            className="text-electric underline underline-offset-4"
          >
            aviso de privacidad
          </Link>
          . Tú te comprometes a que los datos que envías sean veraces y a no
          usar los formularios para enviar contenido ilícito o de terceros sin
          su autorización.
        </p>

        <h2 className="font-display text-2xl text-navy">
          Propiedad intelectual
        </h2>
        <p>
          Los textos, el logotipo, la identidad visual y los demás contenidos de
          este sitio pertenecen a Logibienes S.A.S. o se usan con autorización.
          Puedes citarlos indicando la fuente y enlazando a la página original;
          no puedes reproducirlos de forma sistemática ni usarlos comercialmente
          sin permiso escrito.
        </p>

        <h2 className="font-display text-2xl text-navy">Enlaces externos</h2>
        <p>
          Si desde aquí enlazamos a sitios de terceros, lo hacemos por
          conveniencia. No controlamos su contenido ni respondemos por él.
        </p>

        <h2 className="font-display text-2xl text-navy">
          Disponibilidad del sitio
        </h2>
        <p>
          Procuramos que el sitio esté disponible y actualizado, pero no
          garantizamos que funcione sin interrupciones. Podemos modificar o
          retirar contenidos cuando sea necesario, y actualizar estas
          condiciones: la versión vigente es siempre la publicada en esta
          página, con la fecha que aparece arriba.
        </p>

        <h2 className="font-display text-2xl text-navy">Ley aplicable</h2>
        <p>
          Estas condiciones se rigen por la ley colombiana. Cualquier
          controversia se someterá a los jueces competentes de la República de
          Colombia.
        </p>
      </div>
    </main>
  );
}

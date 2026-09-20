import { CtaBand } from "@/components/sections/cta-band";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { PageHeader } from "@/components/sections/page-header";
import { FAQ } from "@/content/faq";
import { buildBreadcrumbJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Preguntas frecuentes",
  description:
    "Qué documentos necesitas para vender, qué revisar antes de comprar, cómo funciona la administración de un inmueble arrendado y para qué sirve un avalúo. Respuestas directas, sin letra menuda.",
  path: "/preguntas-frecuentes",
});

const breadcrumb = buildBreadcrumbJsonLd([
  { name: "Preguntas frecuentes", path: "/preguntas-frecuentes" },
]);

/**
 * `FAQPage` (T041): una entidad `Question`/`acceptedAnswer` por cada entrada
 * de `content/faq.ts`. Se genera del mismo arreglo que pinta la página, así
 * que el dato estructurado y el visible no pueden divergir.
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((p) => ({
    "@type": "Question",
    name: p.pregunta,
    acceptedAnswer: { "@type": "Answer", text: p.respuesta },
  })),
};

export default function PreguntasFrecuentes() {
  return (
    <main id="contenido" className="shell section-y max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }}
      />

      <div data-content>
        <PageHeader eyebrow="Respuestas" titulo="Preguntas frecuentes">
          Lo que más nos preguntan, respondido de frente. Si lo tuyo no está
          aquí, escríbenos y te respondemos igual.
        </PageHeader>

        <div className="mt-14">
          <FaqAccordion />
        </div>

        <CtaBand titulo="¿Te quedó una duda?">
          Cuéntanosla y te respondemos por el medio que prefieras.
        </CtaBand>
      </div>
    </main>
  );
}

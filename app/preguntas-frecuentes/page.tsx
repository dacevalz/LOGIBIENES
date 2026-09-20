import { ContactCta } from "@/components/contact-cta";
import { FaqAccordion } from "@/components/sections/faq-accordion";
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
    <main id="contenido" className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }}
      />

      <div data-content>
        <h1 className="font-display text-4xl text-navy sm:text-5xl">
          Preguntas frecuentes
        </h1>
        <p className="mt-4 text-lg text-carbon/80">
          Lo que más nos preguntan, respondido de frente. Si lo tuyo no está
          aquí, escríbenos y te respondemos igual.
        </p>

        <div className="mt-12">
          <FaqAccordion />
        </div>

        <div className="mt-16 rounded-xl bg-navy p-8 text-white">
          <h2 className="font-display text-2xl">¿Te quedó una duda?</h2>
          <p className="mt-3 text-white/85">
            Cuéntanosla y te respondemos por el medio que prefieras.
          </p>
          <div className="mt-6">
            <ContactCta />
          </div>
        </div>
      </div>
    </main>
  );
}

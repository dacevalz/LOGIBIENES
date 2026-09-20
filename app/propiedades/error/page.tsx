import Link from "next/link";
import { ContactCta } from "@/components/contact-cta";
import { buildMetadata } from "@/lib/seo";

/**
 * Destino fijo del camino sin JS cuando la validación falla, el formulario
 * expiró, o el envío no salió. Usa `contact-cta.tsx`, nunca un texto fijo que
 * dé por hecho que existe WhatsApp (AS-01).
 */
export const metadata = buildMetadata({
  title: "No pudimos enviar tu búsqueda",
  description: "Hubo un problema al enviar el formulario de búsqueda.",
  path: "/propiedades/error",
  noindex: true,
});

export default function PropiedadesError() {
  return (
    <main id="contenido" className="shell section-y max-w-2xl">
      <div data-content>
        <h1 className="font-display text-4xl text-navy">
          No pudimos enviar tu búsqueda
        </h1>
        <p className="mt-4 text-lg text-carbon/80">
          Puede que falte un dato, o que el formulario llevara demasiado tiempo
          abierto. Vuelve a intentarlo, o cuéntanos qué buscas por este otro
          canal:
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ContactCta />
          <Link
            href="/propiedades"
            className="font-medium text-electric underline underline-offset-4"
          >
            Volver al formulario
          </Link>
        </div>
      </div>
    </main>
  );
}

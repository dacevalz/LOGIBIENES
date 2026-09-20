import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

/**
 * Destino del envío exitoso del formulario de búsqueda en el camino SIN
 * JavaScript (FR-016), y también del descarte silencioso — indistinguibles.
 */
export const metadata = buildMetadata({
  title: "Recibimos tu búsqueda",
  description: "Confirmación de envío del formulario de búsqueda.",
  path: "/propiedades/gracias",
  noindex: true,
});

export default function PropiedadesGracias() {
  return (
    <main id="contenido" className="mx-auto max-w-2xl px-4 py-24">
      <div data-content>
        <h1 className="font-display text-4xl text-navy">
          Recibimos tu búsqueda
        </h1>
        <p className="mt-4 text-lg text-carbon/80">
          Te contactamos por el medio que nos dejaste cuando tengamos algo que
          encaje con lo que buscas.
        </p>
        <p className="mt-8">
          <Link
            href="/"
            className="font-medium text-electric underline underline-offset-4"
          >
            Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  );
}

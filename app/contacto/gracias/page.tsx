import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

/**
 * Destino del envío exitoso en el camino SIN JavaScript (FR-016), y también
 * del descarte silencioso — indistinguibles a propósito.
 */
export const metadata = buildMetadata({
  title: "Recibimos tu mensaje",
  description: "Confirmación de envío del formulario de contacto.",
  path: "/contacto/gracias",
  noindex: true,
});

export default function ContactoGracias() {
  return (
    <main id="contenido" className="shell section-y max-w-2xl">
      <div data-content>
        <h1 className="font-display text-4xl text-navy">
          Recibimos tu mensaje
        </h1>
        <p className="mt-4 text-lg text-carbon/80">
          Te contactamos por el medio que nos dejaste. Gracias por escribirnos.
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

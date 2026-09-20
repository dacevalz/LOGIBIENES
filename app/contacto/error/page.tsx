import Link from "next/link";
import { ContactCta } from "@/components/contact-cta";
import { buildMetadata } from "@/lib/seo";

/**
 * Destino fijo del camino sin JS cuando la validación falla de verdad, el
 * formulario expiró, o el envío no salió.
 *
 * Usa `contact-cta.tsx`, nunca un texto fijo que dé por hecho que hay WhatsApp:
 * mientras AS-01 esté pendiente ese canal no existe, y prometerlo aquí — justo
 * cuando a la persona ya le falló un envío — sería la peor versión de un dato
 * inventado.
 */
export const metadata = buildMetadata({
  title: "No pudimos enviar tu mensaje",
  description: "Hubo un problema al enviar el formulario de contacto.",
  path: "/contacto/error",
  noindex: true,
});

export default function ContactoError() {
  return (
    <main id="contenido" className="mx-auto max-w-2xl px-4 py-24">
      <div data-content>
        <h1 className="font-display text-4xl text-navy">
          No pudimos enviar tu mensaje
        </h1>
        <p className="mt-4 text-lg text-carbon/80">
          Puede que falte un dato, o que el formulario llevara demasiado tiempo
          abierto. Vuelve a intentarlo, o escríbenos directamente por este otro
          canal:
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ContactCta />
          <Link
            href="/contacto"
            className="font-medium text-electric underline underline-offset-4"
          >
            Volver al formulario
          </Link>
        </div>
      </div>
    </main>
  );
}

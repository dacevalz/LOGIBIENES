import { AVISO_PRIVACIDAD_VERSION } from "@/content/legal";
import { buildBreadcrumbJsonLd, buildMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Aviso de privacidad",
  description:
    "Cómo Logibienes trata los datos personales que recibe por sus formularios, bajo la Ley 1581 de 2012 de protección de datos personales de Colombia.",
  path: "/aviso-de-privacidad",
});

const breadcrumb = buildBreadcrumbJsonLd([
  { name: "Aviso de privacidad", path: "/aviso-de-privacidad" },
]);

/**
 * Vive en Foundational, no en Polish: el checkbox de consentimiento de
 * `lead-form.tsx` enlaza aquí desde la primera historia de usuario, así que no
 * puede quedar como 404 en el MVP.
 *
 * El texto es genérico a propósito. No nombra dirección, teléfono ni correo
 * porque esos datos todavía no existen (AS-01) y publicarlos inventados en un
 * documento legal es peor que omitirlos. Recomendado que lo revise un abogado
 * antes de producción, igual que la nota final de los estatutos.
 *
 * La única ubicación que sí se nombra — "Medellín, Antioquia" — viene de
 * `spec.md` §Assumptions (dato confirmado por el cliente), no de los
 * estatutos, cuyo Artículo 4 quedó sin diligenciar.
 */
export default function AvisoDePrivacidad() {
  return (
    <main id="contenido" className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />

      <div data-content className="space-y-6">
        <h1 className="font-display text-4xl text-navy">Aviso de privacidad</h1>
        <p className="text-sm text-carbon/70">
          Versión vigente: <strong>{AVISO_PRIVACIDAD_VERSION}</strong>
        </p>

        <h2 className="font-display text-2xl text-navy">
          Quién responde por tus datos
        </h2>
        <p>
          Logibienes S.A.S., sociedad comercial colombiana con domicilio en
          Medellín, Antioquia, es la responsable del tratamiento de los datos
          personales que recibe a través de este sitio web.
        </p>

        <h2 className="font-display text-2xl text-navy">Qué datos recogemos</h2>
        <p>
          Únicamente los que escribes en nuestros formularios: tu nombre, un
          medio de contacto (correo electrónico o número de celular) y el
          contenido de tu solicitud — el mensaje que nos dejas o los criterios
          del inmueble que buscas. No recogemos datos sensibles ni datos de
          menores de edad, y no te pedimos información financiera.
        </p>

        <h2 className="font-display text-2xl text-navy">Para qué los usamos</h2>
        <p>
          Para una sola cosa: contactarte y atender tu solicitud comercial. No
          los vendemos, no los cedemos a terceros con fines publicitarios y no
          te inscribimos en comunicaciones masivas sin que lo pidas.
        </p>

        <h2 className="font-display text-2xl text-navy">Tus derechos</h2>
        <p>
          La Ley 1581 de 2012 y sus decretos reglamentarios te dan derecho a
          conocer, actualizar y rectificar tus datos; a solicitar prueba de la
          autorización que diste; a ser informado sobre el uso que se les ha
          dado; a presentar quejas ante la Superintendencia de Industria y
          Comercio; y a revocar la autorización o solicitar la supresión de tus
          datos cuando no exista un deber legal o contractual que lo impida.
        </p>
        <p>
          Para ejercer cualquiera de estos derechos, escríbenos por los canales
          de contacto publicados en este sitio indicando tu nombre, el dato que
          quieres consultar o corregir, y qué necesitas que hagamos. Te
          respondemos dentro de los términos que fija la ley.
        </p>

        <h2 className="font-display text-2xl text-navy">
          Cómo guardamos la autorización
        </h2>
        <p>
          Cuando marcas la casilla de autorización y envías el formulario, el
          registro de esa autorización — con tu nombre, tu medio de contacto, la
          versión de este aviso que estaba vigente y la fecha — queda en la
          notificación que llega a nuestro correo. Esa notificación es la
          constancia de tu consentimiento.
        </p>

        <h2 className="font-display text-2xl text-navy">
          Cambios a este aviso
        </h2>
        <p>
          Si cambiamos este aviso, cambia también su versión, que aparece al
          principio de esta página. La versión que se registra junto con tu
          autorización es la que estaba vigente el día que la diste.
        </p>
      </div>
    </main>
  );
}

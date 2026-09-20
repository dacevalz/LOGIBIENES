/**
 * Fuente única de la versión vigente del aviso de privacidad (FR-015).
 *
 * El servidor sobrescribe con este valor el `avisoVersion` de todo lead antes
 * de notificarlo — el que envía el cliente nunca se usa como evidencia por sí
 * solo (ver `contracts/api-leads.md` §"Consentimiento Habeas Data").
 *
 * Al publicar una redacción nueva del aviso, subir esta fecha en el mismo
 * commit que el texto de `app/aviso-de-privacidad/page.tsx`: es lo que permite
 * saber qué versión aceptó cada persona.
 */
export const AVISO_PRIVACIDAD_VERSION = "2026-09-20";

/**
 * Versión vigente de los términos y condiciones.
 *
 * Deliberadamente SEPARADA de `AVISO_PRIVACIDAD_VERSION`, aunque hoy
 * coincidan: son dos documentos con ciclos de cambio independientes. Una
 * versión anterior reutilizaba aquí la constante del aviso, y eso hacía dos
 * afirmaciones falsas según por dónde se mirara — revisar el aviso movía la
 * fecha de los términos sin que su texto hubiera cambiado, y revisar los
 * términos dejaba la fecha quieta aunque sí hubieran cambiado. La fecha de
 * vigencia de un documento legal es una afirmación de hecho, no decoración.
 *
 * Subirla en el mismo commit que el texto de
 * `app/terminos-y-condiciones/page.tsx`, y solo entonces.
 */
export const TERMINOS_VERSION = "2026-09-20";

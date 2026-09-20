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

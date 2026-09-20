/**
 * Resolución del canal de contacto real (FR-003 / AS-01).
 *
 * Vive fuera de `components/contact-cta.tsx` por la misma razón que
 * `content/faq-ids.ts` salió de su componente: es lógica pura sobre
 * configuración, no UI, y el runner de unitarios no puede importar un `.tsx`
 * con el `jsx: "preserve"` de este tsconfig. Tenerla aquí es lo que permite
 * que la guarda anti-placeholder la verifique de verdad.
 */

/** Prefijo centinela de `.env.example`. Mientras el valor lo conserve, AS-01
 *  sigue pendiente y no hay WhatsApp real que ofrecer. */
export const CENTINELA_PLACEHOLDER = "REEMPLAZAR_";

/** Número en formato wa.me, o `null` si todavía es placeholder o inválido. */
export function whatsappNumero(): string | null {
  const bruto = process.env.WHATSAPP_NUMBER?.trim();
  if (!bruto || bruto.startsWith(CENTINELA_PLACEHOLDER)) return null;

  const soloDigitos = bruto.replace(/\D/g, "");
  return soloDigitos.length >= 10 ? soloDigitos : null;
}

/** Enlace de WhatsApp ya armado, o `null` si no hay número real. */
export function enlaceWhatsapp(mensaje: string): string | null {
  const numero = whatsappNumero();
  return numero
    ? `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
    : null;
}

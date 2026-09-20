import Link from "next/link";
import { buttonClasses, type ButtonVariant } from "@/components/ui/button";

/**
 * Prefijo centinela de `.env.example`. Mientras el valor lo conserve, AS-01
 * sigue pendiente y no hay WhatsApp real que ofrecer.
 */
const CENTINELA = "REEMPLAZAR_";

/**
 * Número de WhatsApp en formato wa.me, o `null` si todavía es placeholder.
 * Exportado para que la guarda de T021 use exactamente esta misma lógica.
 */
export function whatsappNumero(): string | null {
  const bruto = process.env.WHATSAPP_NUMBER?.trim();
  if (!bruto || bruto.startsWith(CENTINELA)) return null;
  const soloDigitos = bruto.replace(/\D/g, "");
  return soloDigitos.length >= 10 ? soloDigitos : null;
}

const MENSAJE_PREFIJADO =
  "Hola, vengo del sitio web y quiero información sobre sus servicios.";

/**
 * Componente ÚNICO de contacto (FR-003). Lo usan el header, el footer y las
 * páginas /error — nunca se duplica ni se reemplaza por un texto fijo que dé
 * por hecho que WhatsApp ya existe (Constitución III / AS-01).
 */
export function ContactCta({
  variant = "primary",
  className = "",
}: {
  variant?: ButtonVariant;
  className?: string;
}) {
  const numero = whatsappNumero();
  const clases = `${buttonClasses(variant)} ${className}`;

  if (numero) {
    return (
      <a
        href={`https://wa.me/${numero}?text=${encodeURIComponent(MENSAJE_PREFIJADO)}`}
        className={clases}
        rel="noopener noreferrer"
        target="_blank"
      >
        Escríbenos por WhatsApp
        <span className="sr-only">(se abre en una pestaña nueva)</span>
      </a>
    );
  }

  return (
    <Link href="/contacto" className={clases}>
      Escríbenos
    </Link>
  );
}

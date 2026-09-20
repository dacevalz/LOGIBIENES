import Link from "next/link";
import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { enlaceWhatsapp } from "@/lib/contacto";

const MENSAJE_PREFIJADO =
  "Hola, vengo del sitio web y quiero información sobre sus servicios.";

/**
 * Componente ÚNICO de contacto (FR-003). Lo usan el header, el footer, la
 * banda de CTA y las páginas /error — nunca se duplica ni se reemplaza por un
 * texto fijo que dé por hecho que WhatsApp ya existe (Constitución III / AS-01).
 *
 * La resolución del número vive en `lib/contacto.ts`: es lógica pura y así la
 * guarda anti-placeholder de T021 puede verificarla sin importar este `.tsx`.
 */
export function ContactCta({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const enlace = enlaceWhatsapp(MENSAJE_PREFIJADO);
  const clases = `${buttonClasses(variant, size)} ${className}`;

  if (enlace) {
    return (
      <a
        href={enlace}
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

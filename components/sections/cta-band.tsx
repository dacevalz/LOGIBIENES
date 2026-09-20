import type { ReactNode } from "react";
import { ContactCta } from "@/components/contact-cta";

/**
 * Banda de cierre con llamado a la acción (cierra Q-03).
 *
 * Existía copiada casi igual en `/servicios`, en cada `/servicios/{slug}` y en
 * `/preguntas-frecuentes`. Tres copias del mismo bloque ya no es repetición
 * incidental, es divergencia esperando a ocurrir: basta que alguien ajuste el
 * contraste o el espaciado en una para que las otras queden distintas.
 *
 * Usa siempre `contact-cta.tsx`, que resuelve WhatsApp real o su respaldo
 * según AS-01 — nunca un texto que dé por hecho que ese canal existe.
 */
export function CtaBand({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-16 rounded-xl bg-navy p-8 text-white">
      <h2 className="font-display text-2xl">{titulo}</h2>
      <p className="mt-3 text-white/85">{children}</p>
      <div className="mt-6">
        <ContactCta />
      </div>
    </section>
  );
}

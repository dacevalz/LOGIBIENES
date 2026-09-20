import Link from "next/link";
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
 *
 * El halo eléctrico y la retícula son decorativos y van bajo `aria-hidden`. El
 * texto se queda en su propia columna (`max-w-2xl`), así que aunque el halo lo
 * alcance en una pantalla ancha sigue siendo blanco sobre navy: muy por encima
 * de 4.5:1.
 */
export function CtaBand({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="relative isolate mt-20 overflow-hidden rounded-band bg-navy px-7 py-12 text-white sm:px-12 sm:py-14">
      <div
        aria-hidden="true"
        className="grid-texture absolute inset-0 -z-10 opacity-70"
      />
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-28 -z-10 size-72 rounded-full bg-electric/25 blur-3xl"
      />

      <div className="max-w-2xl">
        <h2 className="font-display text-2xl leading-tight tracking-[-0.01em] sm:text-3xl">
          {titulo}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-white/85">{children}</p>

        {/*
          El CTA principal es WhatsApp cuando hay número real (AS-01). La
          segunda vía NO es decorativa: sin ella esta banda ofrece un solo
          canal, y quien no use WhatsApp —o esté en un escritorio sin la
          aplicación— se queda sin forma de escribir. `contact-cta.tsx` no
          puede resolverlo solo: por contrato devuelve UN destino.
        */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <ContactCta />
          <Link
            href="/contacto"
            className="group inline-flex min-h-11 items-center gap-2 text-white/85 underline underline-offset-4 transition-colors duration-200 hover:text-white"
          >
            o déjanos tus datos
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-brand group-hover:translate-x-1 motion-reduce:transform-none"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

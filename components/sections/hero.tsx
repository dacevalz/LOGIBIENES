import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { ContactCta } from "@/components/contact-cta";

/**
 * Hero del Home (T026).
 *
 * Es un server component a propósito: el titular, la propuesta de valor y los
 * CTA existen en el HTML servido y NO llevan wrapper de motion. El scroll
 * reveal vive en las secciones de abajo (ver `<Reveal>`), nunca aquí — un
 * estado inicial oculto sobre el contenido que debe verse sin scroll es
 * exactamente lo que prohíbe la Constitución I.
 *
 * El video es decorativo: `aria-hidden` lo saca del árbol de accesibilidad, lo
 * que además evita que axe-core le aplique `video-caption` (T052). Bajo
 * `prefers-reduced-motion: reduce` el video se oculta y aparece el poster, con
 * las variantes `motion-reduce:` de Tailwind — CSS puro, sin depender de JS.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-navy">
      <video
        className="absolute inset-0 -z-10 size-full object-cover motion-reduce:hidden"
        poster="/video/hero-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/video/hero.webm" type="video/webm" />
      </video>

      {/* Fallback de movimiento reducido: el mismo fotograma, quieto. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/video/hero-poster.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden size-full object-cover motion-reduce:block"
      />

      {/* Scrim: sin él, el texto blanco no alcanza 4.5:1 sobre un video que
          cambia de luminancia cuadro a cuadro. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy/75" />

      <div data-content className="mx-auto w-full max-w-6xl px-4 py-20">
        <p className="font-display text-lg tracking-wide text-white/90">
          Inmobiliaria simple y digital
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-white sm:text-6xl">
          Un solo lugar para comprar, vender, arrendar o invertir en bienes
          raíces
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-white/90">
          Fácil, rápido, digital. Sin vueltas, sin papeleo que no te explicaron,
          y con alguien que responde.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <ContactCta />
          <Link
            href="/servicios"
            className={`${buttonClasses("secondary")} border-white text-white hover:bg-white hover:text-navy`}
          >
            Ver servicios
          </Link>
        </div>
      </div>
    </section>
  );
}

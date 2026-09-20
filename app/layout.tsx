import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactCta } from "@/components/contact-cta";
import { NavLink } from "@/components/nav-link";
import { SERVICIOS } from "@/content/servicios";
import { jsonLdScript, SITE_NAME, SITE_URL } from "@/lib/seo";
import { anton, inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Logibienes",
    template: "%s | Logibienes",
  },
  description:
    "Inmobiliaria colombiana con domicilio en Medellín. Un solo lugar para comprar, vender, arrendar o invertir en bienes raíces.",
};

/**
 * `Organization`/`RealEstateAgent` (contracts/machine-readable.md).
 *
 * `telephone`, `email` y `sameAs` se OMITEN por completo mientras AS-01 esté
 * pendiente — no se rellenan con placeholder. Un dato inventado en JSON-LD
 * pesa más que uno visual: un consumidor de máquina lo trata como verdad.
 *
 * `addressLocality: "Medellín"` NO sale de los estatutos: su Artículo 4
 * (Domicilio) quedó sin diligenciar. Sale de `spec.md` §Assumptions, donde
 * está registrado como dato confirmado por el cliente. No es una inferencia.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE_NAME,
  legalName: "Logibienes S.A.S.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo/navy-b.png`,
  description:
    "Inmobiliaria colombiana: compra y venta, arrendamientos, administración de inmuebles, proyectos y construcción, y asesoría y avalúos.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Medellín",
    addressRegion: "Antioquia",
    addressCountry: "CO",
  },
};

const NAV = [
  { href: "/servicios", label: "Servicios" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
];

const LEGAL = [
  { href: "/aviso-de-privacidad", label: "Aviso de privacidad" },
  { href: "/terminos-y-condiciones", label: "Términos y condiciones" },
];

/** Flecha del footer: se desplaza al pasar el cursor, sin mover el texto. */
function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-start gap-2 text-sm text-white/75 transition-colors duration-200 hover:text-white"
    >
      <span
        aria-hidden="true"
        className="mt-px text-electric transition-transform duration-300 ease-brand group-hover:translate-x-0.5 motion-reduce:transform-none"
      >
        ›
      </span>
      {children}
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`${anton.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd) }}
        />

        {/* Primer elemento enfocable de la página: salta la navegación. */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>

        {/*
          Sticky + translúcido: la navegación y el CTA quedan a un clic desde
          cualquier punto de scroll, no solo arriba del todo. El alto sale de
          `--header-h` porque el hero calcula su altura contra ese mismo valor.
        */}
        <header className="sticky top-0 z-50 border-b border-navy/10 bg-frost/80 backdrop-blur-xl">
          <div className="shell flex h-[var(--header-h)] max-w-6xl items-center gap-4">
            <Link
              href="/"
              className="shrink-0 rounded-lg transition-opacity duration-200 hover:opacity-75"
            >
              <Image
                src="/logo/navy-b.png"
                alt="Logibienes — inicio"
                width={160}
                height={40}
                priority
                style={{ height: "auto", width: "150px" }}
              />
            </Link>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {/*
                A partir de lg: la barra completa. Por debajo no cabe — cuatro
                etiquetas (una de ellas "Preguntas frecuentes") más el logo y el
                CTA se envolvían en dos filas y rompían el alto del header.
              */}
              <nav aria-label="Principal" className="hidden lg:block">
                <ul className="flex items-center gap-1">
                  {NAV.map((item) => (
                    <li key={item.href}>
                      <NavLink href={item.href}>{item.label}</NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <ContactCta size="sm" className="hidden sm:inline-flex" />

              {/*
                Menú móvil sobre <details> nativo, por la misma razón que el
                acordeón de la FAQ: abre y cierra sin una línea de JavaScript,
                expone su estado a los lectores de pantalla por sí solo y deja
                los cuatro enlaces en el HTML servido aunque esté cerrado.
              */}
              <details className="group/menu relative lg:hidden">
                <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg border border-navy/15 text-navy transition-colors duration-200 hover:bg-navy hover:text-white">
                  <span className="sr-only">Menú de navegación</span>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  >
                    <path
                      d="M4 7h16"
                      className="origin-center transition-transform duration-200 ease-brand group-open/menu:translate-y-[5px] group-open/menu:rotate-45"
                    />
                    <path
                      d="M4 12h16"
                      className="transition-opacity duration-150 group-open/menu:opacity-0"
                    />
                    <path
                      d="M4 17h16"
                      className="origin-center transition-transform duration-200 ease-brand group-open/menu:-translate-y-[5px] group-open/menu:-rotate-45"
                    />
                  </svg>
                </summary>

                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(18rem,calc(100vw-2rem))] rounded-card border border-navy/10 bg-white p-2 shadow-lift">
                  <nav aria-label="Navegación móvil">
                    <ul>
                      {NAV.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="flex min-h-11 items-center rounded-lg px-3 text-navy transition-colors duration-150 hover:bg-frost"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <div className="mt-2 border-t border-navy/10 p-2 sm:hidden">
                    <ContactCta size="sm" className="w-full" />
                  </div>
                </div>
              </details>
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="relative isolate overflow-hidden bg-navy text-white">
          <div
            aria-hidden="true"
            className="grid-texture absolute inset-0 -z-10 opacity-70"
          />

          <div className="shell max-w-6xl py-16 sm:py-20">
            <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
              <div className="max-w-sm">
                <Image
                  src="/logo/white.png"
                  alt=""
                  width={160}
                  height={40}
                  style={{ height: "auto", width: "160px" }}
                />
                {/* Deliberadamente NO repite el titular ni el eslogan del
                    hero: duplicar una frase de marca en todas las páginas la
                    vuelve ruido, y además hacía ambiguo cualquier
                    `getByText` sobre ella. */}
                <p className="mt-5 text-sm leading-relaxed text-white/75">
                  Compra, venta, arrendamiento, administración, proyectos y
                  avalúos. El ciclo completo de un inmueble, en un solo lugar.
                </p>
                <div className="mt-6">
                  <ContactCta variant="inverse" size="sm" />
                </div>
              </div>

              <nav aria-label="Servicios">
                <h2 className="font-display text-sm uppercase tracking-[0.18em] text-white/90">
                  Servicios
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {SERVICIOS.map((servicio) => (
                    <li key={servicio.slug}>
                      <FooterLink href={`/servicios/${servicio.slug}`}>
                        {servicio.nombre}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Secciones">
                <h2 className="font-display text-sm uppercase tracking-[0.18em] text-white/90">
                  Secciones
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {NAV.map((item) => (
                    <li key={item.href}>
                      <FooterLink href={item.href}>{item.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Legal">
                <h2 className="font-display text-sm uppercase tracking-[0.18em] text-white/90">
                  Legal
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {LEGAL.map((item) => (
                    <li key={item.href}>
                      <FooterLink href={item.href}>{item.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-8 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
              <p>Logibienes S.A.S. — Medellín, Antioquia, Colombia.</p>
              <p>Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

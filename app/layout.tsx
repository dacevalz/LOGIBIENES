import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactCta } from "@/components/contact-cta";
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

        <header className="border-b border-carbon/10 bg-frost">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4">
            <Link href="/" className="shrink-0">
              <Image
                src="/logo/navy-b.png"
                alt="Logibienes — inicio"
                width={160}
                height={40}
                priority
                style={{ height: "auto", width: "160px" }}
              />
            </Link>

            <nav aria-label="Principal" className="flex-1">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-navy hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <ContactCta className="shrink-0" />
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="bg-navy text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
            <div>
              <Image
                src="/logo/white.png"
                alt=""
                width={160}
                height={40}
                style={{ height: "auto", width: "160px" }}
              />
              <p className="mt-4 text-sm text-white/80">
                Logibienes S.A.S. — Medellín, Antioquia, Colombia.
              </p>
              <div className="mt-4">
                <ContactCta variant="primary" />
              </div>
            </div>

            <nav aria-label="Servicios">
              <h2 className="font-display text-lg">Servicios</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {SERVICIOS.map((servicio) => (
                  <li key={servicio.slug}>
                    <Link
                      href={`/servicios/${servicio.slug}`}
                      className="text-white/85 hover:underline"
                    >
                      {servicio.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Legal">
              <h2 className="font-display text-lg">Legal</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    href="/aviso-de-privacidad"
                    className="text-white/85 hover:underline"
                  >
                    Aviso de privacidad
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terminos-y-condiciones"
                    className="text-white/85 hover:underline"
                  >
                    Términos y condiciones
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}

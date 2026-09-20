"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Enlace de navegación que sabe si es la sección actual.
 *
 * Es cliente solo por `usePathname`. Sin JavaScript degrada a un `<a>` normal:
 * se pierde el resaltado, no el enlace — el contenido y la navegación siguen
 * completos (Constitución I).
 *
 * El subrayado se anima con `scaleX` sobre un `::after`, no con
 * `text-decoration`: así entra y sale suave y no mueve el texto un píxel.
 */
export function NavLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const activo = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      data-activo={activo ? "" : undefined}
      className={
        "group relative inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-navy/75 " +
        "transition-colors duration-200 hover:text-navy data-[activo]:font-medium data-[activo]:text-navy " +
        "after:pointer-events-none after:absolute after:inset-x-3 after:bottom-2.5 after:h-0.5 " +
        "after:origin-left after:scale-x-0 after:rounded-full after:bg-electric " +
        "after:transition-transform after:duration-300 after:ease-brand " +
        "hover:after:scale-x-100 data-[activo]:after:scale-x-100 " +
        className
      }
    >
      {children}
    </Link>
  );
}

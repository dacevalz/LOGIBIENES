import type { Metadata } from "next";
import { anton, inter } from "./fonts";
import "./globals.css";

// Placeholder de Setup (T002). El layout real — skip-link, header/footer con
// contact-cta y JSON-LD Organization — se implementa en T016 (Foundational).
export const metadata: Metadata = {
  title: "Logibienes",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`${anton.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}

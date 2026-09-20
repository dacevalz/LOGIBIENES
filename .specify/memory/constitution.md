# Logibienes Web Constitution

## Core Principles

### I. Contenido primero, JS después (Accesible por defecto)
Todo contenido público (texto, servicios, FAQ, datos de contacto) MUST existir en el HTML servido, sin depender de la ejecución de JavaScript ni de una interacción del usuario para revelarse. Esto es lo que hace el sitio operable tanto por personas con tecnología de asistencia como por agentes de IA (crawlers y agentes de navegación) — no son dos requisitos distintos, es el mismo.

### II. Simplicidad (YAGNI)
No se construye backend, base de datos, CMS externo ni autenticación mientras una solución más simple (formulario a WhatsApp/email, contenido en Markdown en el repo) resuelva el mismo requisito. Complejidad nueva se justifica contra un requisito real de `spec.md`, nunca contra una necesidad especulativa.

### III. Cero datos inventados
Ninguna cifra, calificación, testimonio o dato de contacto se presenta como real si no lo es. Un placeholder pendiente de reemplazo se marca explícitamente como tal en el código/contenido y bloquea el paso a producción hasta resolverse (ver supuestos en `.trace/graph/`).

### IV. SEO/AEO no es una fase aparte
Metadata única por página, datos estructurados (JSON-LD), sitemap/robots/llms.txt y contenido citable en formato pregunta-respuesta se construyen junto con cada página, no se agregan al final como capa de optimización.

### V. Identidad de marca consistente
Paleta de color, tipografía (Anton + Inter) y logo aprobados en `.trace/ingestion/logibienes-branding/branding.md` se aplican sin desviación en todas las páginas nuevas.

## Restricciones del proyecto

- Tier TRACE: **T2** (negocio estándar, sin PCI/PII sensible) — ver `.trace/tier.json`.
- Sin base de datos propia en el MVP; sin autenticación de usuarios.
- Todo motion respeta `prefers-reduced-motion`.

## Governance

Esta constitución aplica a todas las fases de `specs/*/plan.md` de este repo. Un plan que se aparte de un principio debe justificarlo explícitamente en su sección "Complexity Tracking" — si no hay justificación registrada, el arquitecto lo trata como gap en la revisión de `logiplan`.

**Version**: 1.0.0 | **Ratified**: 2026-09-19 | **Last Amended**: 2026-09-19

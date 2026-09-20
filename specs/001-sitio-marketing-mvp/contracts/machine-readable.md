# Contrato: archivos legibles por máquina

Cubre FR-010, FR-011, SC-006.

## `/robots.txt`

Política base permisiva, no una allowlist enumerada como única regla (una allowlist sin base permisiva deja fuera, por omisión, a cualquier agente nuevo no anticipado):

```
User-agent: *
Allow: /
Disallow: /api/

# Agentes de navegación/respuesta en vivo — acceso explícito reforzado
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /

Sitemap: https://<dominio>/sitemap.xml
```

`Google-Extended` y `Applebot-Extended` **no se listan aquí** porque no son crawlers que soliciten páginas — son tokens de opt-out de uso para entrenamiento de modelos, y listarlos con `Allow`/`Disallow` no tiene efecto real sobre el acceso (FR-011 es sobre acceso, no sobre entrenamiento). Si en el futuro se decide una política de entrenamiento explícita, se documenta aparte, no en esta tabla de acceso.

## `/sitemap.xml`

Generado por `app/sitemap.ts` — incluye las 13 rutas públicas del feature (home, nosotros, servicios hub + 5 sub-páginas, propiedades, preguntas-frecuentes, contacto, aviso-de-privacidad, términos-y-condiciones). Es la **lista exhaustiva** de páginas indexables — a diferencia de `llms.txt` (ver abajo), que es curado. No incluye `/api/*` ni las páginas `*/gracias` / `*/error` (son destinos de confirmación de formulario, no contenido a indexar — se marcan `noindex` en su metadata).

## `/llms.txt`

Archivo de texto plano en la raíz, **curado a propósito** (orientación rápida, no espejo del sitemap — para el listado exhaustivo está `sitemap.xml`). Contrato de contenido mínimo:

```
# Logibienes

> Inmobiliaria colombiana con domicilio en Medellín. Un solo lugar para comprar, vender, arrendar o invertir en bienes raíces — fácil, rápido, digital.

## Quiénes somos
- Nosotros: /nosotros

## Servicios
- Compra y venta de inmuebles: /servicios/compra-venta
- Arrendamientos e intermediación: /servicios/arrendamientos
- Administración de inmuebles: /servicios/administracion-inmuebles
- Proyectos y construcción: /servicios/proyectos-y-construccion
- Asesoría y avalúos: /servicios/asesoria-y-avaluos

## Páginas clave
- Preguntas frecuentes: /preguntas-frecuentes
- Contacto: /contacto
- Buscar/registrar interés en una propiedad: /propiedades
```

Se actualiza manualmente cuando cambie el copy core de servicios o la propuesta de valor — no se autogenera desde el CMS porque no hay CMS en el MVP.

## JSON-LD (embebido en cada página, no un archivo aparte)

- `layout.tsx`: `Organization`/`RealEstateAgent` con `name`, `url`, `logo`, y `address` limitada a **`addressLocality: "Medellín"`, `addressRegion: "Antioquia"`, `addressCountry: "CO"`**. Los campos `telephone`, `email` y `sameAs` **se omiten por completo** (no se rellenan con placeholder) hasta que existan datos reales — ver `research.md` §9 y `AS-01`. Publicar un placeholder en datos estructurados viola la Constitución III con más peso que uno visual, porque un consumidor de máquina lo trata como fuente de verdad.
- `/preguntas-frecuentes`: `FAQPage` con una entidad `Question`/`acceptedAnswer` por cada `PreguntaFrecuente` de `content/faq.ts`.
- Cada `/servicios/{slug}` (las 5 líneas, incluyendo `asesoria-y-avaluos`): `Service` referenciando la `Organization` como `provider`.
- Páginas internas: `BreadcrumbList`.

Todo JSON-LD MUST validar sin errores en Rich Results Test antes de cerrar la fase correspondiente en `tasks.md`. La ausencia deliberada de `telephone`/`email`/`sameAs` mientras `AS-01` esté pendiente **no** es un error de validación — Rich Results Test no exige esos campos para `Organization`/`RealEstateAgent`.

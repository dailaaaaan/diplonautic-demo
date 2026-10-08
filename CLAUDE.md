# Diplonautic — demo de web corporativa

Contexto del proyecto para trabajar con Claude Code. Describe qué se construye, con qué y bajo qué normas.

## Qué es

Prueba técnica para Diplonautic S.L. (Barcelona), empresa de instalación, reparación y mantenimiento de sistemas náuticos. Es una demo funcional, no un producto terminado.

## Requisitos del enunciado

- **Web pública**: página de inicio (empresa y servicios) y página de contacto (formulario solo visual).
- **Login de empleados**: inicio y cierre de sesión, con dos roles: empleado y administrador.
- **Foro interno**: listado de hilos (título, autor, fecha), crear hilo y responder. Solo usuarios autenticados pueden leer y escribir.
- **Datos de prueba** incluidos en la demo.
- **Git**: commits claros y al menos un Pull Request con descripción que fusione una rama de funcionalidad.

## Decisiones de alcance

- Los empleados los da de alta el administrador. No hay registro público.
- El administrador puede crear y desactivar empleados y moderar el foro.
- Los hilos tienen categoría: Duda, Aviso o Incidencia.
- Sin catálogo de productos ni tienda.

El razonamiento de cada decisión está en `docs/DECISIONS.md`.

## Stack

- Next.js (App Router) con TypeScript
- Tailwind CSS
- Prisma con SQLite en local
- Sesiones con cookie httpOnly y contraseñas cifradas con bcrypt
- Pruebas unitarias con Vitest
- Despliegue opcional: Vercel con Turso

## Arquitectura

El código se organiza en capas. Cada capa solo llama a la que tiene debajo:

1. **Presentación** (`app/`, `components/`): páginas y componentes. Solo pintan.
2. **Controladores** (`app/actions/`): leen el formulario, comprueban la sesión, llaman a un servicio y redirigen. Sin reglas de negocio.
3. **Servicios** (`server/services/`): las reglas de negocio. No conocen Next.js ni Prisma.
4. **Repositorios** (`server/repositories/`): el único sitio que usa Prisma.

La validación de datos vive en `server/validation/`, como funciones puras.

Normas:

- Ninguna página, componente o acción importa Prisma: piden los datos a un servicio.
- Toda regla de negocio nueva va en un servicio y lleva su prueba en `tests/unit/`.
- `npm test` debe pasar antes de cada commit.

## Idioma

- Textos de la web: inglés, como la web actual de la empresa.
- Documentación, comentarios, commits y PR: español.
- Nombres de variables, funciones, archivos y carpetas: inglés.

## Diseño

Paleta:

| Color | Uso |
|---|---|
| `#355070` | Principal: cabecera, botones, enlaces |
| `#3d5a80` | Secundario: hover, bloques destacados |
| `#0e2a47` | Azul profundo: fondo de la portada y de la cabecera |
| `#293241` | Texto y pie de página |
| `#98c1d9` | Bordes, iconos, etiquetas |
| `#e0fbfc` | Fondos suaves de sección |
| `#ee6c4d` | Acento, solo para la acción principal de cada página |

Dirección visual:

- Portada con fotografía a todo el ancho teñida de azul, titular alineado a la izquierda.
- Carta náutica como textura sutil (curvas de profundidad, coordenadas), no como concepto entero.
- Servicios en lista numerada con fotografía, no en tarjetas con icono.
- Esquinas rectas, bordes finos, sin degradados llamativos ni emojis.
- El naranja con texto blanco pequeño no tiene contraste suficiente: usarlo con texto oscuro o grande.
- Imágenes de bancos libres de derechos; no se reutilizan las de la web real de la empresa.

## Código

- Código simple y explícito, fácil de explicar línea a línea. Evitar abstracciones innecesarias.
- Comprobar la sesión y el rol en el servidor en cada página y acción protegida, no solo ocultar enlaces.
- Validar en el servidor todos los datos que llegan de formularios.

## Git

- GitHub Flow: `main` siempre funciona; cada cambio va en su rama (`feature/...` o `refactor/...`) y se fusiona con un Pull Request.
- Commits pequeños con formato Conventional Commits y descripción en español, por ejemplo `feat: añade el formulario de creación de hilos`.
- Tipos usados: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `ci`, `chore`.
- Cada PR describe qué cambia, por qué y cómo probarlo.

## Plan de ramas

1. `feature/public-site` — estructura, inicio y contacto
2. `feature/auth` — modelo de usuario, login, logout, roles y rutas protegidas
3. `feature/admin-users` — panel de alta y desactivación de empleados
4. `feature/forum` — listado, creación de hilos y respuestas
5. `feature/seed-docs` — datos de prueba y documentación final
6. `feature/responsive` — ajuste a móvil y tablet
7. `feature/polish` — animaciones, cabecera, página 404 y avisos del foro
8. `refactor/layered-architecture` — arquitectura por capas, pruebas unitarias e integración continua

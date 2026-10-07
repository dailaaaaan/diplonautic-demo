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
- Despliegue opcional al final: Vercel con Turso

## Idioma

- Textos de la web, documentación, comentarios, commits y PR: español.
- Nombres de variables, funciones, archivos y carpetas: inglés.

## Diseño

Paleta:

| Color | Uso |
|---|---|
| `#355070` | Principal: cabecera, botones, enlaces |
| `#3d5a80` | Secundario: hover, bloques destacados |
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

Tipografía (Google Fonts, cargadas con `next/font`):

| Uso | Fuente | Detalle |
|---|---|---|
| Titulares | Archivo | Peso 600–700, ancho expandido (`font-stretch: 125%`), interlineado 1.1 |
| Texto | IBM Plex Sans | Peso 400, y 500 para énfasis; interlineado 1.6 |
| Etiquetas y datos | IBM Plex Mono | Mayúsculas, 13px, espaciado entre letras 0.08em. Para coordenadas, fechas, categorías y numeración |

Tamaños de texto (escritorio / móvil):

| Elemento | Escritorio | Móvil |
|---|---|---|
| Titular de portada (h1) | 64px | 36px |
| Título de sección (h2) | 40px | 28px |
| Subtítulo (h3) | 24px | 20px |
| Texto | 17px | 16px |
| Texto secundario | 15px | 14px |
| Etiquetas | 13px | 12px |

Medidas:

- Ancho máximo del contenido: 1200px, con margen lateral de 24px (16px en móvil).
- Ancho máximo de los párrafos: 65 caracteres, para que se lean con comodidad.
- Espaciado en múltiplos de 8px. Separación vertical entre secciones: 96px (56px en móvil).
- Cabecera de 72px de alto, fija al hacer scroll.
- Botones y campos de formulario de 48px de alto, con 24px de relleno horizontal.
- Radio de las esquinas: 2px. Bordes de 1px en `#98c1d9`.
- Sin sombras, salvo una muy leve en la cabecera fija.

Comportamiento:

- Puntos de corte de Tailwind: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px. Se diseña primero para móvil.
- Transiciones de 150ms solo en color y fondo. Sin animaciones de entrada al hacer scroll.
- Todo elemento interactivo tiene estado `hover` y un `focus` visible (contorno de 2px en `#ee6c4d`).
- Contraste mínimo AA: 4.5:1 en texto normal y 3:1 en texto grande.
- Imágenes con `next/image`, con texto alternativo y tamaño definido para evitar saltos al cargar.

## Código

- Código simple y explícito, fácil de explicar línea a línea. Evitar abstracciones innecesarias.
- Comprobar la sesión y el rol en el servidor en cada página y acción protegida, no solo ocultar enlaces.
- Validar en el servidor todos los datos que llegan de formularios.

## Git

- GitHub Flow: `main` siempre funciona; cada funcionalidad va en su rama `feature/...` y se fusiona con un Pull Request.
- Commits pequeños con formato Conventional Commits y descripción en español, por ejemplo `feat: añade el formulario de creación de hilos`.
- Tipos usados: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`.
- Cada PR describe qué cambia, por qué y cómo probarlo.

## Plan de ramas

1. `feature/public-site` — estructura, inicio y contacto
2. `feature/auth` — modelo de usuario, login, logout, roles y rutas protegidas
3. `feature/admin-users` — panel de alta y desactivación de empleados
4. `feature/forum` — listado, creación de hilos y respuestas
5. `feature/seed-docs` — datos de prueba y documentación final
6. `feature/responsive` — ajuste a móvil y tablet
7. `feature/deploy` — despliegue en Vercel con Turso (opcional)

# Diplonautic — demo de web corporativa

Demo funcional de una web corporativa con área privada para empleados, desarrollada como prueba técnica para Diplonautic S.L.

> Proyecto en desarrollo. Este documento se irá completando con cada funcionalidad.

## Qué incluye

- **Web pública**: página de inicio con la presentación de la empresa y sus servicios, y página de contacto.
- **Área de empleados**: inicio y cierre de sesión con dos roles, empleado y administrador.
- **Foro interno**: hilos con categoría (duda, aviso o incidencia) y respuestas, visible solo para usuarios autenticados.
- **Panel de administración**: alta y desactivación de empleados.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | Next.js con TypeScript |
| Estilos | Tailwind CSS |
| Base de datos | SQLite con Prisma |
| Autenticación | Sesiones con cookie y contraseñas cifradas |

## Puesta en marcha

Las instrucciones de instalación y los usuarios de prueba se añadirán cuando el proyecto base esté creado.

## Decisiones

Las decisiones de tecnología, diseño y flujo de trabajo están explicadas en [docs/DECISIONS.md](docs/DECISIONS.md).

## Flujo de trabajo con Git

Se sigue GitHub Flow: la rama `main` contiene siempre una versión que funciona y cada funcionalidad se desarrolla en su propia rama, que se fusiona mediante un Pull Request con descripción.

## Uso de IA

El proyecto se ha desarrollado con Claude Code como herramienta de apoyo, tal como pide el enunciado. El archivo [CLAUDE.md](CLAUDE.md) recoge el contexto y las normas que se le dan a la herramienta. Esta sección se ampliará al final con el detalle de cómo se ha usado.

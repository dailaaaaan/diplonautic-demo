# Diplonautic — demo de web corporativa

Demo funcional de una web corporativa con área privada para empleados, desarrollada como prueba técnica para Diplonautic S.L., empresa de instalación, reparación y mantenimiento de sistemas náuticos en Barcelona.

Es una demo, no la web oficial de la empresa.

## Qué incluye

- **Web pública**: página de inicio con la presentación de la empresa y sus servicios, y página de contacto con un formulario solo visual.
- **Acceso de empleados**: inicio y cierre de sesión con dos roles, empleado y administrador.
- **Foro interno**: hilos con categoría (duda, aviso o incidencia), respuestas y filtro por categoría. Solo lo ven los usuarios autenticados.
- **Panel de administración**: alta de empleados, activación y desactivación de cuentas, y moderación del foro.
- **Datos de prueba**: tres usuarios y cinco hilos de ejemplo.

## Tecnologías

| Capa              | Tecnología                                                               |
| Framework         | Next.js 16 (App Router) con TypeScript                                   |
| Estilos           | Tailwind CSS 4                                                           |
| Base de datos     | SQLite con Prisma 7                                                      |
| Autenticación     | Sesiones propias con cookie `httpOnly` y contraseñas cifradas con bcrypt |

## Puesta en marcha

Requisitos: Node.js 20 o superior.

```bash
npm install
cp .env.example .env    # en Windows: copy .env.example .env
npm run db:setup        # crea la base de datos y los datos de prueba
npm run dev
```

La web queda disponible en http://localhost:3000.

`npm run db:setup` genera el cliente de Prisma, aplica las migraciones y carga los datos de prueba. Se puede ejecutar más de una vez sin duplicar datos.

### Usuarios de prueba

| Rol                  | Email                         | Contraseña      |
| Administrador        | `admin@diplonautic.com`       | `Admin-2026`    |
| Empleado             | `marc.soler@diplonautic.com`  | `Employee-2026` |
| Empleado desactivado | `jordi.vidal@diplonautic.com` | `Employee-2026` |

La cuenta desactivada sirve para comprobar que no puede iniciar sesión.

## Recorrido de la demo

1. **Web pública**: la página de inicio y `/contact` se ven sin iniciar sesión.
2. **Acceso protegido**: abrir `/forum` sin sesión redirige a `/login`.
3. **Empleado**: entrar como Marc Soler, filtrar los hilos por categoría, abrir uno, responder y crear un hilo nuevo.
4. **Límite del rol**: como empleado, abrir `/admin/users` devuelve al foro.
5. **Administrador**: entrar como administrador, crear un empleado en "Users", desactivarlo y comprobar que ya no puede entrar.
6. **Moderación**: como administrador, borrar una respuesta o un hilo.

## Estructura del proyecto

```
app/
  page.tsx              Página de inicio
  contact/              Página de contacto
  login/                Inicio de sesión
  (private)/            Zona privada: comprueba la sesión en su layout
    forum/              Listado, hilo y formulario de hilo nuevo
    admin/users/        Panel de gestión de usuarios
  actions/              Acciones de servidor: auth, users y forum
components/             Cabecera, pie y secciones de la página de inicio
lib/
  db.ts                 Conexión con la base de datos
  session.ts            Sesiones y comprobación de rol
  forum.ts              Categorías y formato de fecha
prisma/
  schema.prisma         Tablas: User, Session, Thread y Reply
  migrations/           Historial de cambios de la base de datos
  seed.ts               Datos de prueba
docs/DECISIONS.md       Decisiones tomadas y su motivo
```

## Seguridad

- Las contraseñas se guardan cifradas con bcrypt, nunca en claro.
- La sesión viaja en una cookie `httpOnly`; en la base de datos se guarda el hash del token, no el token.
- La sesión y el rol se comprueban en el servidor en cada página privada y en cada acción. Ocultar un enlace no se considera protección.
- Todos los datos de los formularios se validan en el servidor.
- El login responde igual si falla el email o la contraseña, para no revelar qué cuentas existen.
- Al desactivar una cuenta se cierran sus sesiones abiertas.

## Decisiones

Las decisiones de tecnología, alcance y diseño están explicadas, con su motivo, en [docs/DECISIONS.md](docs/DECISIONS.md).

## Flujo de trabajo con Git

Se sigue GitHub Flow: la rama `main` contiene siempre una versión que funciona y cada funcionalidad se desarrolla en su propia rama, que se fusiona mediante un Pull Request con descripción.

| Pull Request | Rama                  | Contenido                                    |
| #1           | `feature/public-site` | Base de diseño, página de inicio y contacto  |
| #2           | `feature/auth`        | Base de datos, login, sesiones y roles       |
| #3           | `feature/admin-users` | Alta y desactivación de empleados            |
| #4           | `feature/forum`       | Hilos, respuestas y moderación               |
| #5           | `feature/seed-docs`   | Documentación final e icono                  |

Los commits siguen el formato Conventional Commits, con la descripción en español.

## Uso de IA

El proyecto se ha desarrollado con Claude Code como herramienta de apoyo, tal como pide el enunciado. Así se ha usado:

- **Contexto escrito antes de programar.** El archivo [CLAUDE.md](CLAUDE.md) recoge los requisitos, el stack, las normas de código y de Git, y la dirección de diseño. La herramienta lo lee al empezar cada sesión, de modo que trabaja siempre dentro del mismo marco.
- **Una funcionalidad cada vez.** El trabajo se dividió en ramas y se encargó bloque a bloque. La IA escribió la mayor parte del código; cada bloque se revisó en el navegador y se entendió antes de darlo por bueno.
- **El repositorio se maneja a mano.** Los commits, los Pull Request y las fusiones no los hace la herramienta. Así cada cambio pasa por una revisión antes de entrar en el historial.
- **Verificación de cada cambio.** Además del linter, la comprobación de tipos y la compilación, el login, la gestión de usuarios y el foro se probaron de extremo a extremo, incluidos los intentos de saltarse los permisos: enviar formularios sin sesión, con un rol insuficiente o con datos falsificados.
- **Documentación de la versión exacta.** Antes de usar una API de Next.js se consultó la documentación incluida en la versión instalada, porque Next.js 16 cambia cosas respecto a versiones anteriores.
- **Decisiones corregidas sobre la marcha.** No todo lo que propuso la herramienta se aceptó: se cambió el idioma de la web a inglés al ver la web actual de la empresa, se sustituyó el azul de la portada y se recortó el detalle de diseño del archivo de contexto entre otros muchos cabios tanto de diseño como el limite hasta donde podía llegar la IA
- **Comprobacion de Seguridad en la web.** La IA realza varios intentos de vulneraciones de la pagina para comprobar su seguridad, se hae un breve informe por el cual debe ser revisado y aprobado por Dylan.

No se han usado agentes en paralelo, skills ni conexiones con servicios externos: el proyecto es pequeño y cada funcionalidad depende de la anterior, así que no había trabajo que repartir.

## Créditos de las fotografías

Las imágenes proceden de [Unsplash](https://unsplash.com) y se usan bajo su licencia. No se reutilizan las de la web real de la empresa.

- Yate de la portada: [Héctor Mavare](https://unsplash.com/photos/ICAZMF1NSno)
- Puerto deportivo de la sección de servicios: [Val Vesa](https://unsplash.com/photos/0Ljx7Us7Y9Y)
- Yate atracado de la sección de empresa: [Francisco Gomes](https://unsplash.com/photos/nSmCeE_0ioU)
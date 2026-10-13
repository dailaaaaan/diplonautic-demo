# Documentación técnica

Referencia del código de la demo de Diplonautic: cómo está organizado, qué hace cada archivo, cómo se relacionan y dónde hay que tocar para cambiar cada cosa.

- Las decisiones y su motivo están en [DECISIONS.md](DECISIONS.md).
- La puesta en marcha y los usuarios de prueba están en el [README](../README.md).

## Índice

1. [Stack](#1-stack)
2. [Arquitectura](#2-arquitectura)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Rutas](#4-rutas)
5. [Referencia de archivos](#5-referencia-de-archivos)
6. [Modelo de datos](#6-modelo-de-datos)
7. [Flujos principales](#7-flujos-principales)
8. [Autenticación y autorización](#8-autenticación-y-autorización)
9. [Validación](#9-validación)
10. [Seguridad](#10-seguridad)
11. [Pruebas e integración continua](#11-pruebas-e-integración-continua)
12. [Estilos](#12-estilos)
13. [Configuración y comandos](#13-configuración-y-comandos)
14. [Guía de cambios](#14-guía-de-cambios)
15. [Cómo añadir una funcionalidad](#15-cómo-añadir-una-funcionalidad)
16. [Limitaciones conocidas](#16-limitaciones-conocidas)

## 1. Stack

| Capa | Tecnología | Versión | Uso |
|---|---|---|---|
| Entorno | Node.js | 22 o superior | Ejecuta el servidor, las herramientas y las pruebas |
| Lenguaje | TypeScript | 5 | Todo el código, con comprobación estricta de tipos |
| Framework | Next.js (App Router) | 16.4 | Rutas, renderizado en servidor y acciones de servidor |
| Interfaz | React | 19.3 | Componentes |
| Estilos | Tailwind CSS | 4 | Clases de utilidad y variables de diseño |
| Base de datos | SQLite | — | Un archivo local, `dev.db` |
| ORM | Prisma | 7.10 | Esquema, migraciones y cliente tipado |
| Adaptador | `@prisma/adapter-libsql` | 7.10 | Conexión de Prisma con SQLite; compatible con Turso |
| Contraseñas | bcryptjs | 3 | Hash con sal de las contraseñas |
| Pruebas | Vitest | 5 | Pruebas unitarias |
| Calidad | ESLint | 9 | Análisis estático |
| CI | GitHub Actions | — | Linter, pruebas y compilación en cada Pull Request |

Tamaño del código, sin contar dependencias ni archivos generados:

| Carpeta | Archivos | Líneas | Contenido |
|---|---|---|---|
| `app/` | 18 | 1.225 | Páginas, formularios y controladores |
| `components/` | 11 | 465 | Componentes reutilizables |
| `server/` | 9 | 415 | Servicios, repositorios y validación |
| `lib/` | 5 | 143 | Conexión, sesión y utilidades |
| `prisma/` | 2 | 214 | Esquema y datos de prueba |
| `tests/` | 7 | 723 | Pruebas unitarias |

## 2. Arquitectura

El código se organiza en capas. Cada capa solo llama a la que tiene debajo.

```
┌──────────────────────────────────────────────────────────────────┐
│  PRESENTACIÓN        app/**/page.tsx, app/**/*Form.tsx,          │
│                      components/                                 │
│  Pinta la interfaz y recoge formularios.                         │
└──────────────────────────────┬───────────────────────────────────┘
                               │  envía un formulario
┌──────────────────────────────▼───────────────────────────────────┐
│  CONTROLADORES       app/actions/                                │
│  Comprueban la sesión, leen el formulario, llaman a un servicio  │
│  y deciden la respuesta (redirigir, error o refrescar).          │
└──────────────────────────────┬───────────────────────────────────┘
                               │  llama con datos ya extraídos
┌──────────────────────────────▼───────────────────────────────────┐
│  SERVICIOS           server/services/     ◄── server/validation/ │
│  Reglas de negocio. Devuelven { ok: true } o { ok: false, error }│
│  No conocen Next.js ni Prisma.                                   │
└──────────────────────────────┬───────────────────────────────────┘
                               │  pide o guarda datos
┌──────────────────────────────▼───────────────────────────────────┐
│  REPOSITORIOS        server/repositories/                        │
│  Acceso a datos. Único lugar que importa Prisma.                 │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                        SQLite (dev.db)
```

### Reglas de dependencia

| Regla | Cómo se comprueba |
|---|---|
| Ninguna página, componente ni acción importa Prisma | Buscar `prisma.` en `app/` y `components/`: no hay resultados |
| Los servicios no importan nada de Next.js ni de React | `server/` no contiene `next/` ni `react` en sus importaciones |
| Solo los repositorios consultan la base de datos | `prisma.` aparece únicamente en `server/repositories/` y en `prisma/seed.ts` |
| La validación son funciones puras | `server/validation/` no importa repositorios ni servicios |

### Frontera entre frontend y backend

- **Frontend**: `app/` (salvo `app/actions/`) y `components/`.
- **Puente**: `app/actions/` y `lib/session.ts`, que son el único código que conoce a la vez Next.js y los servicios.
- **Backend**: `server/` y `lib/db.ts`.

Los dos se despliegan juntos, como una sola aplicación de Next.js. El backend no depende del framework, por lo que podría exponerse como una API sin modificar las reglas.

### Componentes de servidor y de cliente

Por defecto, los componentes se ejecutan solo en el servidor y no envían JavaScript al navegador. Solo siete llevan `"use client"`, porque necesitan estado o datos del navegador:

| Componente | Por qué es de cliente |
|---|---|
| `app/login/LoginForm.tsx` | `useActionState`: muestra el error y el estado de envío |
| `app/(private)/admin/users/CreateUserForm.tsx` | `useActionState` |
| `app/(private)/forum/new/NewThreadForm.tsx` | `useActionState` |
| `app/(private)/forum/[id]/ReplyForm.tsx` | `useActionState` |
| `components/Header.tsx` | `useState` y `useEffect` para la posición del scroll; `usePathname` para el enlace activo |
| `components/MobileMenu.tsx` | `useState`: recuerda si el menú está abierto |
| `components/PrivateNav.tsx` | `usePathname`: marca el enlace de la página actual |

## 3. Estructura de carpetas

```
diplonautic/
├── app/                          PRESENTACIÓN Y CONTROLADORES
│   ├── layout.tsx                Layout raíz: fuentes, metadatos, cabecera y pie
│   ├── page.tsx                  Página de inicio
│   ├── not-found.tsx             Página 404
│   ├── globals.css               Variables de diseño, estilos base y animaciones
│   ├── icon.svg                  Icono de la pestaña
│   ├── contact/page.tsx          Página de contacto
│   ├── login/
│   │   ├── page.tsx              Página de inicio de sesión
│   │   └── LoginForm.tsx         Formulario de inicio de sesión
│   ├── (private)/                Grupo de rutas: zona privada
│   │   ├── layout.tsx            Comprueba la sesión; barra con usuario y salida
│   │   ├── forum/
│   │   │   ├── page.tsx          Listado de hilos con filtro
│   │   │   ├── new/              Página y formulario de hilo nuevo
│   │   │   └── [id]/             Página de un hilo y formulario de respuesta
│   │   └── admin/users/          Panel de usuarios y formulario de alta
│   └── actions/                  Controladores (acciones de servidor)
│       ├── auth.ts
│       ├── users.ts
│       └── forum.ts
├── components/                   Componentes reutilizables
├── server/                       BACKEND
│   ├── services/                 Reglas de negocio
│   ├── repositories/             Acceso a datos
│   └── validation/               Validación de entradas
├── lib/                          Conexión, sesión y utilidades compartidas
├── prisma/
│   ├── schema.prisma             Definición de las tablas
│   ├── migrations/               Historial de cambios del esquema, en SQL
│   └── seed.ts                   Datos de prueba
├── tests/unit/                   Pruebas, con la misma estructura que server/
├── public/images/                Fotografías
├── docs/                         Documentación y capturas
└── .github/workflows/ci.yml      Integración continua
```

## 4. Rutas

En el App Router, cada carpeta con un `page.tsx` es una ruta. Los paréntesis de `(private)` agrupan páginas bajo un mismo layout sin añadir nada a la URL.

| URL | Archivo | Acceso | Renderizado |
|---|---|---|---|
| `/` | `app/page.tsx` | Público | Estático |
| `/contact` | `app/contact/page.tsx` | Público | Estático |
| `/login` | `app/login/page.tsx` | Público; con sesión redirige a `/forum` | Dinámico |
| `/forum` | `app/(private)/forum/page.tsx` | Usuario autenticado | Dinámico |
| `/forum?category=NOTICE` | La misma página, con filtro | Usuario autenticado | Dinámico |
| `/forum/new` | `app/(private)/forum/new/page.tsx` | Usuario autenticado | Dinámico |
| `/forum/[id]` | `app/(private)/forum/[id]/page.tsx` | Usuario autenticado | Dinámico |
| `/admin/users` | `app/(private)/admin/users/page.tsx` | Solo administrador | Dinámico |
| Cualquier otra | `app/not-found.tsx` | Público | Estático |

- **Estático**: la página se genera una vez, al compilar.
- **Dinámico**: se genera en cada petición, porque lee la cookie de sesión y la base de datos.

## 5. Referencia de archivos

### 5.1 Páginas y layouts

| Archivo | Componente | Responsabilidad |
|---|---|---|
| `app/layout.tsx` | `RootLayout` | Carga las tres fuentes con `next/font`, define `metadata` y envuelve cada página con `Header` y `Footer`. |
| `app/page.tsx` | `Home` | Portada con fotografía y las secciones `Services`, `About` y `ContactBanner`. Contiene el array `heroFacts`. |
| `app/contact/page.tsx` | `ContactPage` | Datos del taller y formulario visual. Contiene el array `serviceOptions`. El formulario no tiene `action` y no envía datos. |
| `app/login/page.tsx` | `LoginPage` | Redirige a `/forum` si ya hay sesión; si no, renderiza `LoginForm`. |
| `app/not-found.tsx` | `NotFound` | Página 404. Se muestra para rutas inexistentes y cuando una página llama a `notFound()`. |
| `app/(private)/layout.tsx` | `PrivateLayout` | Llama a `requireUser`. Renderiza `PrivateNav`, el nombre y el rol del usuario y el formulario de cierre de sesión. |
| `app/(private)/forum/page.tsx` | `ForumPage` | Lee el filtro de `searchParams`, pide los hilos al servicio y los lista. |
| `app/(private)/forum/new/page.tsx` | `NewThreadPage` | Renderiza `NewThreadForm`. |
| `app/(private)/forum/[id]/page.tsx` | `ThreadPage` | Pide el hilo al servicio; si no existe, `notFound()`. Muestra respuestas, `ReplyForm` y, al administrador, los botones de borrado. |
| `app/(private)/admin/users/page.tsx` | `AdminUsersPage` | Llama a `requireAdmin`, lista las cuentas y renderiza `CreateUserForm`. |

### 5.2 Controladores: `app/actions/`

Todos llevan `"use server"`. Ninguno contiene reglas de negocio.

| Archivo | Función | Comprueba | Llama a | Respuesta |
|---|---|---|---|---|
| `auth.ts` | `login` | — | `checkCredentials`, `createSession` | Error en el formulario, o redirección a `/forum` |
| `auth.ts` | `logout` | — | `deleteSession` | Redirección a `/login` |
| `users.ts` | `createUser` | `requireAdmin` | `usersService.createEmployee` | Error o mensaje de éxito; `revalidatePath("/admin/users")` |
| `users.ts` | `setUserActive` | `requireAdmin` | `usersService.setUserActive` | `revalidatePath("/admin/users")` |
| `forum.ts` | `createThread` | `requireUser` | `forumService.createThread` | Error, o redirección a `/forum/[id]?created=1` |
| `forum.ts` | `createReply` | `requireUser` | `forumService.createReply` | Error o mensaje de éxito; refresca el hilo y el listado |
| `forum.ts` | `deleteThread` | `requireAdmin` | `forumService.deleteThread` | Redirección a `/forum?deleted=1` |
| `forum.ts` | `deleteReply` | `requireAdmin` | `forumService.deleteReply` | Refresca el hilo y el listado |

### 5.3 Servicios: `server/services/`

| Archivo | Función | Regla que aplica |
|---|---|---|
| `auth.ts` | `checkCredentials(email, password)` | Normaliza el email y valida. Rechaza con el mismo mensaje si el email no existe, si la contraseña no coincide o si la cuenta está desactivada. Devuelve el `userId`. |
| `sessions.ts` | `hashToken(token)` | SHA-256 del token, en hexadecimal. |
| `sessions.ts` | `startSession(userId)` | Genera un token de 32 bytes aleatorios, guarda su hash con caducidad a `SESSION_DAYS` (7) días y devuelve el token. |
| `sessions.ts` | `getUserFromToken(token)` | Devuelve el usuario si la sesión existe, no ha caducado y la cuenta está activa. Nunca incluye el hash de la contraseña. |
| `sessions.ts` | `endSession(token)` | Borra la sesión. |
| `users.ts` | `listUsers()` | Lista las cuentas para el panel. |
| `users.ts` | `createEmployee(input)` | Valida, rechaza un email ya registrado, cifra la contraseña con bcrypt (coste 10) y crea la cuenta. |
| `users.ts` | `setUserActive(adminId, userId, active)` | Impide que un administrador cambie su propia cuenta. Al desactivar, cierra las sesiones abiertas de esa cuenta. |
| `forum.ts` | `parseCategoryFilter(value)` | Convierte el texto de la URL en una categoría válida o `null`. |
| `forum.ts` | `listThreads(category)` | Lista los hilos, opcionalmente filtrados. |
| `forum.ts` | `getThread(id)` | Devuelve el hilo con sus respuestas, o `null`. |
| `forum.ts` | `createThread(actor, input)` | Valida y crea el hilo con el autor de la sesión. |
| `forum.ts` | `createReply(actor, threadId, body)` | Valida, comprueba que el hilo existe y guarda la respuesta. |
| `forum.ts` | `deleteThread(actor, id)` | Solo si `actor.role` es `ADMIN`. |
| `forum.ts` | `deleteReply(actor, id)` | Solo si `actor.role` es `ADMIN`. Devuelve el `threadId` afectado. |

Las operaciones que pueden fallar devuelven un resultado discriminado, no lanzan excepciones:

```ts
type Result = { ok: true; /* datos */ } | { ok: false; error: string };
```

### 5.4 Repositorios: `server/repositories/`

| Archivo | Función | Consulta |
|---|---|---|
| `users.ts` | `findUserByEmail(email)` | `user.findUnique` |
| `users.ts` | `listUsers()` | `user.findMany`, con `select` de las columnas visibles |
| `users.ts` | `createEmployee(data)` | `user.create`, con `role: "EMPLOYEE"` |
| `users.ts` | `setUserActive(id, active)` | `user.update` |
| `sessions.ts` | `createSession(data)` | `session.create` |
| `sessions.ts` | `findSessionWithUser(id)` | `session.findUnique`, con `include: { user }` |
| `sessions.ts` | `deleteSession(id)` | `session.deleteMany` |
| `sessions.ts` | `deleteSessionsOfUser(userId)` | `session.deleteMany` |
| `forum.ts` | `listThreads(category)` | `thread.findMany`, con autor y número de respuestas (`_count`) |
| `forum.ts` | `findThreadWithReplies(id)` | `thread.findUnique`, con autor y respuestas ordenadas |
| `forum.ts` | `findThread(id)` | `thread.findUnique` |
| `forum.ts` | `createThread(data)` | `thread.create` |
| `forum.ts` | `deleteThread(id)` | `thread.deleteMany` |
| `forum.ts` | `createReply(data)` | `reply.create` |
| `forum.ts` | `findReply(id)` | `reply.findUnique` |
| `forum.ts` | `deleteReply(id)` | `reply.delete` |

### 5.5 Utilidades: `lib/`

| Archivo | Exporta | Responsabilidad |
|---|---|---|
| `db.ts` | `prisma` | Instancia única de `PrismaClient` con el adaptador libSQL. En desarrollo se guarda en `globalThis` para no abrir una conexión nueva en cada recarga. |
| `session.ts` | `createSession`, `getCurrentUser`, `requireUser`, `requireAdmin`, `deleteSession` | Une la sesión con Next.js: lee y escribe la cookie y redirige. Las reglas están en `server/services/sessions.ts`. |
| `forum.ts` | `categories`, `isCategory`, `categoryLabel`, `formatDate` | Las tres categorías, en un solo sitio, y el formato de fecha. |
| `services.ts` | `services` | Los seis servicios de la empresa que muestra la página de inicio. |
| `initials.ts` | `getInitials` | Iniciales de un nombre, para `Avatar`. |

### 5.6 Componentes: `components/`

| Archivo | Tipo | Uso |
|---|---|---|
| `Header.tsx` | Cliente | Cabecera fija. Transparente sobre la portada y con fondo al bajar. Contiene `navLinks`. |
| `MobileMenu.tsx` | Cliente | Menú desplegable por debajo de 768 px. |
| `Footer.tsx` | Servidor | Pie con dirección, horario y contacto. |
| `Services.tsx` | Servidor | Lista numerada de servicios, a partir de `lib/services.ts`. |
| `About.tsx` | Servidor | Sección de empresa. Contiene el array `steps`. |
| `ContactBanner.tsx` | Servidor | Llamada a contacto. |
| `ChartLines.tsx` | Servidor | Curvas de carta náutica en SVG, como textura de fondo. |
| `PrivateNav.tsx` | Cliente | Enlaces de la zona privada. Oculta «Users» a quien no es administrador. |
| `CategoryBadge.tsx` | Servidor | Etiqueta de categoría de un hilo. |
| `Avatar.tsx` | Servidor | Cuadro con las iniciales del autor. |
| `Notice.tsx` | Servidor | Mensaje de confirmación, con `role="status"`. |

## 6. Modelo de datos

Definido en `prisma/schema.prisma`. Cada `model` es una tabla.

```
User  1 ──── N  Session     una cuenta tiene varias sesiones abiertas
User  1 ──── N  Thread      un usuario es autor de varios hilos
User  1 ──── N  Reply       un usuario es autor de varias respuestas
Thread 1 ─── N  Reply       un hilo tiene varias respuestas
```

| Relación | Al borrar el padre |
|---|---|
| `User` → `Session` | Se borran sus sesiones (`onDelete: Cascade`) |
| `Thread` → `Reply` | Se borran sus respuestas (`onDelete: Cascade`) |
| `User` → `Thread`, `User` → `Reply` | No se permite: las cuentas se desactivan, no se borran, para conservar la autoría |

### User

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | `Int` | Clave primaria, autoincremental |
| `email` | `String` | Único |
| `name` | `String` | |
| `passwordHash` | `String` | Hash de bcrypt; la contraseña nunca se guarda en claro |
| `role` | `Role` | `EMPLOYEE` por defecto, o `ADMIN` |
| `active` | `Boolean` | `true` por defecto. Una cuenta desactivada conserva sus datos pero no puede entrar |
| `createdAt` | `DateTime` | Fecha de alta |

### Session

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | `String` | Clave primaria. Es el hash SHA-256 del token de la cookie |
| `userId` | `Int` | Clave foránea a `User`. `onDelete: Cascade` |
| `expiresAt` | `DateTime` | Caducidad |
| `createdAt` | `DateTime` | |

### Thread

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | `Int` | Clave primaria, autoincremental |
| `title` | `String` | |
| `body` | `String` | |
| `category` | `Category` | `QUESTION`, `NOTICE` o `INCIDENT` |
| `authorId` | `Int` | Clave foránea a `User` |
| `createdAt` | `DateTime` | |

### Reply

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | `Int` | Clave primaria, autoincremental |
| `body` | `String` | |
| `threadId` | `Int` | Clave foránea a `Thread`. `onDelete: Cascade` |
| `authorId` | `Int` | Clave foránea a `User` |
| `createdAt` | `DateTime` | |

### Migraciones

| Migración | Contenido |
|---|---|
| `20261007150304_init` | Tablas `User` y `Session`; índice único sobre `User.email` |
| `20261007155550_forum` | Tablas `Thread` y `Reply` |

Las migraciones son SQL generado por Prisma a partir del esquema. Se aplican con `prisma migrate deploy`, que forma parte de `npm run db:setup`.

### Datos de prueba

`prisma/seed.ts` crea tres usuarios (un administrador, un empleado y un empleado desactivado) y cinco hilos con sus respuestas. Usa `upsert` para los usuarios, de modo que puede ejecutarse varias veces sin duplicarlos. Los hilos solo se crean si el foro está vacío.

## 7. Flujos principales

### 7.1 Inicio de sesión

| Paso | Archivo | Qué ocurre |
|---|---|---|
| 1 | `app/login/LoginForm.tsx` | El usuario envía el formulario, conectado a la acción `login` con `useActionState`. |
| 2 | `app/actions/auth.ts` → `login` | Lee email y contraseña y llama a `checkCredentials`. |
| 3 | `server/services/auth.ts` → `checkCredentials` | Busca el usuario y compara la contraseña con `bcrypt.compare`. |
| 4 | `server/repositories/users.ts` → `findUserByEmail` | Consulta la tabla `User`. |
| 5 | `lib/session.ts` → `createSession` | Pide un token al servicio de sesiones y lo escribe en la cookie. |
| 6 | `server/services/sessions.ts` → `startSession` | Genera el token y guarda su hash mediante el repositorio. |
| 7 | `app/actions/auth.ts` | `redirect("/forum")`. |

### 7.2 Alta de un empleado

| Paso | Archivo | Qué ocurre |
|---|---|---|
| 1 | `app/(private)/admin/users/page.tsx` | `requireAdmin`. Renderiza `CreateUserForm`. |
| 2 | `CreateUserForm.tsx` | El formulario invoca la acción `createUser`. |
| 3 | `app/actions/users.ts` → `createUser` | `requireAdmin` de nuevo. Lee el formulario y llama al servicio. |
| 4 | `server/services/users.ts` → `createEmployee` | Valida, comprueba que el email no exista y cifra la contraseña. |
| 5 | `server/validation/users.ts` → `validateNewUser` | Comprueba nombre, email y contraseña. |
| 6 | `server/repositories/users.ts` → `createEmployee` | Inserta la fila, con el rol `EMPLOYEE`. |
| 7 | `app/actions/users.ts` | `revalidatePath("/admin/users")` y mensaje de éxito. |

### 7.3 Comprobación de acceso en cada petición

| Paso | Archivo | Qué ocurre |
|---|---|---|
| 1 | La página o la acción | Llama a `requireUser()` o a `requireAdmin()` antes de hacer nada. |
| 2 | `lib/session.ts` → `getCurrentUser` | Lee el token de la cookie. Está envuelta en `cache` de React para no repetir la consulta dentro de una misma petición. |
| 3 | `server/services/sessions.ts` → `getUserFromToken` | Busca la sesión por el hash del token y comprueba caducidad y cuenta activa. |
| 4 | `lib/session.ts` | Sin usuario, `redirect("/login")`. Con rol insuficiente, `redirect("/forum")`. |

### 7.4 Publicación de un hilo

| Paso | Archivo | Qué ocurre |
|---|---|---|
| 1 | `app/(private)/forum/new/NewThreadForm.tsx` | El formulario invoca la acción `createThread`. |
| 2 | `app/actions/forum.ts` → `createThread` | `requireUser`. Pasa al servicio el usuario de la sesión y los datos. |
| 3 | `server/services/forum.ts` → `createThread` | Valida con `validateThread` y asigna como autor al usuario de la sesión. |
| 4 | `server/repositories/forum.ts` → `createThread` | Inserta la fila. |
| 5 | `app/actions/forum.ts` | Redirige a `/forum/[id]?created=1`, y la página muestra el aviso. |

## 8. Autenticación y autorización

La autenticación es propia, con sesiones guardadas en la base de datos.

### Cookie de sesión

| Atributo | Valor | Efecto |
|---|---|---|
| Nombre | `session` | |
| Contenido | Token de 32 bytes aleatorios, en hexadecimal | Generado con `crypto.randomBytes` |
| `httpOnly` | `true` | JavaScript no puede leerla |
| `secure` | `true` en producción | Solo viaja por HTTPS |
| `sameSite` | `lax` | No se envía en peticiones POST desde otros sitios |
| `path` | `/` | Válida en toda la web |
| `expires` | 7 días | Coincide con la caducidad guardada en la base de datos |

### Qué se guarda en cada sitio

| Dato | Navegador | Base de datos |
|---|---|---|
| Contraseña | Nunca | Hash de bcrypt, coste 10 |
| Token de sesión | En claro, en la cookie `httpOnly` | Solo su hash SHA-256, como `Session.id` |

Si alguien obtuviera una copia de la base de datos, no podría ni recuperar contraseñas ni reutilizar sesiones.

### Niveles de acceso

| Función | Exige | Si no se cumple |
|---|---|---|
| `getCurrentUser()` | Nada; devuelve el usuario o `null` | — |
| `requireUser()` | Sesión válida y cuenta activa | Redirige a `/login` |
| `requireAdmin()` | Lo anterior y rol `ADMIN` | Redirige a `/forum` |

La comprobación se hace en dos niveles: en la página y, de nuevo, en cada acción de servidor. Una acción es un punto de entrada propio y puede invocarse sin pasar por la página, por lo que ocultar un enlace o un botón no se considera protección.

### Invalidación de sesiones

- Al cerrar sesión se borra la fila de `Session` y la cookie.
- Al desactivar una cuenta se borran todas sus sesiones.
- Aunque no se borraran, `getUserFromToken` rechaza cualquier sesión de una cuenta inactiva.

## 9. Validación

Toda la validación se ejecuta en el servidor, en `server/validation/`. Los atributos HTML de los formularios (`required`, `minLength`, `maxLength`) son solo una ayuda para el usuario.

| Dato | Regla | Constante | Archivo |
|---|---|---|---|
| Nombre | No vacío y de hasta 80 caracteres | `MAX_NAME_LENGTH` | `validation/users.ts` |
| Email | Formato `algo@dominio.ext`, sin espacios | — | `validation/users.ts` |
| Email | Se guarda sin espacios y en minúsculas | `normalizeEmail` | `validation/users.ts` |
| Email | No puede estar ya registrado | — | `services/users.ts` |
| Contraseña | 8 caracteres o más | `MIN_PASSWORD_LENGTH` | `validation/users.ts` |
| Título del hilo | Entre 3 y 120 caracteres | `MIN_TITLE_LENGTH`, `MAX_TITLE_LENGTH` | `validation/forum.ts` |
| Categoría | Una de las tres definidas | `isCategory` | `lib/forum.ts` |
| Mensaje y respuesta | No vacíos y de hasta 5.000 caracteres | `MAX_BODY_LENGTH` | `validation/forum.ts` |
| Identificadores | Deben ser números enteros | — | Servicios |

Las funciones de validación devuelven el primer mensaje de error, o `null` si los datos son válidos.

## 10. Seguridad

| Riesgo | Medida | Dónde |
|---|---|---|
| Robo de contraseñas | Hash con bcrypt; la consulta del panel no selecciona esa columna | `services/users.ts`, `repositories/users.ts` |
| Robo de sesión mediante un script (XSS) | Cookie `httpOnly`; React escapa el contenido escrito por los usuarios | `lib/session.ts` |
| Reutilización de sesiones tras una fuga de datos | Se guarda el hash del token | `services/sessions.ts` |
| Acceso sin permiso | Sesión y rol comprobados en el servidor, en páginas y acciones | `lib/session.ts` |
| Escalada de privilegios | La regla «solo el administrador borra» está también en el servicio | `services/forum.ts` |
| Suplantación del autor | El autor se toma de la sesión, no del formulario | `services/forum.ts` |
| Datos falsificados | Validación en el servidor | `server/validation/` |
| Inyección SQL | Prisma parametriza todas las consultas | `server/repositories/` |
| Peticiones desde otros sitios (CSRF) | `sameSite: lax`; Next.js verifica el origen en las acciones de servidor | `lib/session.ts` |
| Enumeración de cuentas | El login responde igual ante cualquier fallo | `services/auth.ts` |
| Secretos en el repositorio | `.env` y `*.db` están en `.gitignore` | `.gitignore` |

## 11. Pruebas e integración continua

```bash
npm test          # ejecuta las pruebas una vez
npm run test:watch   # las repite al guardar
```

Hay 111 pruebas unitarias, escritas con Vitest, en `tests/unit/`. La carpeta refleja la estructura de `server/`.

| Archivo | Pruebas | Qué comprueba |
|---|---|---|
| `validation/users.test.ts` | 23 | Normalización y formato del email, límites del nombre y de la contraseña, orden de los errores |
| `validation/forum.test.ts` | 21 | Límites del título y del mensaje, categorías válidas y falsificadas |
| `services/forum.test.ts` | 19 | Autor tomado de la sesión, hilo inexistente, borrado solo para administradores |
| `lib/forum.test.ts` | 16 | Categorías, formato de fecha e iniciales |
| `services/sessions.test.ts` | 13 | Hash del token, caducidad, sesión inexistente o caducada, cuenta inactiva |
| `services/users.test.ts` | 11 | Contraseña cifrada, email duplicado, cierre de sesiones, un administrador no se desactiva a sí mismo |
| `services/auth.test.ts` | 8 | Credenciales correctas e incorrectas, cuenta desactivada, mismo mensaje en todos los fallos |

### Cómo se prueban los servicios

Los servicios se prueban sin base de datos. El repositorio se sustituye por uno simulado con `vi.mock`, y cada prueba decide qué devuelve:

```ts
vi.mock("@/server/repositories/users", () => ({
  findUserByEmail: vi.fn(),
}));

it("rechaza una cuenta desactivada aunque la contraseña sea correcta", async () => {
  findUserByEmail.mockResolvedValue(await buildUser({ active: false }));

  const result = await checkCredentials("marc.soler@diplonautic.com", PASSWORD);

  expect(result).toEqual({ ok: false, error: "Invalid email or password." });
});
```

Esto es posible porque las reglas están separadas del acceso a datos.

### Integración continua

`.github/workflows/ci.yml` se ejecuta en cada Pull Request y en cada cambio en `main`, sobre Ubuntu y Node.js 22:

| Paso | Comando |
|---|---|
| Instalar dependencias | `npm ci` |
| Preparar el entorno | `cp .env.example .env` |
| Generar el cliente de Prisma | `npx prisma generate` |
| Linter | `npm run lint` |
| Pruebas | `npm test` |
| Compilación | `npm run build` |

## 12. Estilos

Los estilos usan Tailwind CSS 4. Las variables de diseño se declaran una sola vez, en el bloque `@theme` de `app/globals.css`, y cada una genera sus clases.

### Colores

| Variable | Valor | Clases | Uso |
|---|---|---|---|
| `--color-primary` | `#355070` | `bg-primary`, `text-primary`… | Botones y enlaces |
| `--color-secondary` | `#3d5a80` | `bg-secondary`… | Estados `hover` |
| `--color-deep` | `#0e2a47` | `bg-deep`… | Fondo de la portada y la cabecera |
| `--color-ink` | `#293241` | `text-ink`… | Texto y pie |
| `--color-line` | `#98c1d9` | `border-line`… | Bordes y etiquetas |
| `--color-mist` | `#e0fbfc` | `bg-mist`… | Fondos suaves |
| `--color-accent` | `#ee6c4d` | `bg-accent`… | Acción principal de cada página |

### Tipografía

Las fuentes se cargan con `next/font` en `app/layout.tsx`, que las descarga al compilar y las sirve desde el propio dominio.

| Variable | Fuente | Clase | Uso |
|---|---|---|---|
| `--font-display` | Archivo | `font-display` | Titulares |
| `--font-sans` | IBM Plex Sans | `font-sans` | Texto |
| `--font-mono` | IBM Plex Mono | `font-mono` | Etiquetas, fechas y datos |

### Animaciones

| Variable | Clase | Uso |
|---|---|---|
| `--animate-fade-up` | `animate-fade-up` | Entrada escalonada de la portada |
| `--animate-slow-zoom` | `animate-slow-zoom` | Acercamiento lento de la fotografía |

Son CSS, sin librerías. Una regla `prefers-reduced-motion` las desactiva para quien lo tiene configurado en su sistema.

### Puntos de corte

Se diseña primero para móvil. `md:` aplica desde 768 px y `lg:` desde 1.024 px.

## 13. Configuración y comandos

### Variables de entorno

| Variable | Valor por defecto | Uso |
|---|---|---|
| `DATABASE_URL` | `file:./dev.db` | Ruta de la base de datos SQLite |

Se definen en `.env`, que no se sube al repositorio. `.env.example` sirve de plantilla.

### Archivos de configuración

| Archivo | Configura |
|---|---|
| `next.config.ts` | Next.js. Carga el cargador de Tailwind para Turbopack |
| `prisma7.config.ts` | La herramienta de línea de comandos de Prisma: esquema, migraciones y comando de seed |
| `tsconfig.json` | TypeScript y el alias `@/`, que apunta a la raíz del proyecto |
| `eslint.config.mjs` | ESLint, con las reglas de Next.js. Ignora `generated/` |
| `vitest.config.mts` | Vitest: entorno Node, alias `@/` y ubicación de las pruebas |
| `.github/workflows/ci.yml` | Integración continua |

### Comandos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala las dependencias |
| `npm run db:setup` | Genera el cliente de Prisma, aplica las migraciones y carga los datos de prueba |
| `npm run dev` | Servidor de desarrollo en `http://localhost:3000`, con recarga al guardar |
| `npm run build` | Compilación de producción |
| `npm start` | Sirve la compilación de producción |
| `npm run lint` | Analiza el código con ESLint |
| `npm test` | Ejecuta las pruebas |
| `npx prisma migrate dev --name <nombre>` | Crea y aplica una migración tras cambiar el esquema |
| `npx prisma generate` | Regenera el cliente de Prisma |
| `npx prisma db seed` | Vuelve a cargar los datos de prueba |

### Archivos generados

No se suben al repositorio y se recrean con los comandos anteriores.

| Ruta | Generado por |
|---|---|
| `node_modules/` | `npm install` |
| `generated/prisma/` | `npx prisma generate` |
| `dev.db` | `npx prisma migrate deploy` |
| `.next/` | `npm run dev` y `npm run build` |

## 14. Guía de cambios

Dónde hay que tocar para cada cambio.

### Contenido de la web pública

| Para cambiar | Archivo | Qué tocar |
|---|---|---|
| Los servicios de la empresa | `lib/services.ts` | El array `services` |
| El titular o el texto de la portada | `app/page.tsx` | El `h1` o el párrafo |
| Las cifras de la portada | `app/page.tsx` | El array `heroFacts` |
| Los enlaces del menú | `components/Header.tsx` | El array `navLinks`; se actualizan el menú de escritorio y el de móvil |
| El texto del botón de acceso | `components/Header.tsx` | El objeto `staffLink` |
| La sección de empresa | `components/About.tsx` | El array `steps` |
| Dirección, teléfono, email y horario | `components/Footer.tsx` y `app/contact/page.tsx` | Están en los dos archivos |
| Las opciones del formulario de contacto | `app/contact/page.tsx` | El array `serviceOptions` |
| El título de la pestaña | `app/layout.tsx` | El objeto `metadata` |
| Las fotografías | `public/images/` | Sustituir el archivo y revisar su `alt` |

### Diseño

| Para cambiar | Archivo | Qué tocar |
|---|---|---|
| Un color | `app/globals.css` | La variable `--color-…` en `@theme` |
| Una fuente | `app/layout.tsx` y `app/globals.css` | La importación de `next/font` y la variable `--font-…` |
| La duración de una animación | `app/globals.css` | La variable `--animate-…` |
| Cuándo cambia la cabecera al bajar | `components/Header.tsx` | El umbral de `window.scrollY` |

### Reglas y datos

| Para cambiar | Archivo | Qué tocar |
|---|---|---|
| La longitud mínima de la contraseña | `server/validation/users.ts` | `MIN_PASSWORD_LENGTH`; y `minLength` en `CreateUserForm.tsx` |
| Los límites del título o del mensaje | `server/validation/forum.ts` | `MIN_TITLE_LENGTH`, `MAX_TITLE_LENGTH`, `MAX_BODY_LENGTH` |
| La duración de la sesión | `server/services/sessions.ts` | `SESSION_DAYS` |
| El orden de los hilos | `server/repositories/forum.ts` | `orderBy`, en `listThreads` |
| Los mensajes de error | `server/validation/` y `server/services/` | El texto devuelto |
| Los usuarios de prueba | `prisma/seed.ts` | El array `users`; después, `npx prisma db seed` |
| Quién puede borrar | `server/services/forum.ts` | La comprobación de `actor.role` |

### Cambios que afectan a varias capas

**Añadir una categoría al foro**

1. `prisma/schema.prisma`: añadir el valor al `enum Category`.
2. `npx prisma migrate dev --name add-category` y `npx prisma generate`.
3. `lib/forum.ts`: añadirla al array `categories`.
4. `components/CategoryBadge.tsx`: añadir su estilo. TypeScript da error si falta.
5. `tests/unit/lib/forum.test.ts`: actualizar la prueba que enumera las categorías.
6. Reiniciar el servidor de desarrollo.

El desplegable, el filtro y la validación la recogen sin más cambios, porque leen de `lib/forum.ts`.

**Añadir un campo a una tabla**

1. `prisma/schema.prisma`: añadir el campo al modelo.
2. `npx prisma migrate dev --name add-field` y `npx prisma generate`.
3. Repositorio: incluirlo en la escritura y en el `select` de lectura.
4. Validación y servicio: comprobarlo.
5. Controlador: leerlo del formulario.
6. Formulario y página: añadir el campo y mostrarlo.
7. Pruebas: cubrir la regla nueva.
8. Reiniciar el servidor de desarrollo.

## 15. Cómo añadir una funcionalidad

El orden es de abajo arriba: primero el dato, después la regla y por último la interfaz. Como ejemplo, permitir que el autor edite su propio hilo.

| Paso | Capa | Archivo | Qué se añade |
|---|---|---|---|
| 1 | Repositorio | `server/repositories/forum.ts` | `updateThread(id, data)`, con `thread.update` |
| 2 | Validación | `server/validation/forum.ts` | Se reutiliza `validateThread` |
| 3 | Servicio | `server/services/forum.ts` | `updateThread(actor, id, input)`: valida y comprueba que `actor.id` es el autor o que es administrador |
| 4 | Pruebas | `tests/unit/services/forum.test.ts` | El autor edita; otro empleado no; el administrador sí |
| 5 | Controlador | `app/actions/forum.ts` | `updateThread`: `requireUser`, lee el formulario, llama al servicio y redirige |
| 6 | Presentación | `app/(private)/forum/[id]/edit/` | Página y formulario de edición |

Antes de cada commit deben pasar `npm run lint` y `npm test`.

## 16. Limitaciones conocidas

| Limitación | Cómo se resolvería |
|---|---|
| El formulario de contacto no envía datos | Una acción de servidor con un servicio de correo |
| No hay límite de intentos de inicio de sesión | Un contador por email y dirección IP, con bloqueo temporal |
| No hay recuperación ni cambio de contraseña | Un token de un solo uso enviado por correo, guardado con hash |
| Las sesiones caducadas no se limpian | Una tarea periódica que borre las filas con `expiresAt` pasado |
| El foro no tiene paginación, búsqueda ni edición | `take` y `skip` en el repositorio; un filtro por texto; el flujo de la sección 15 |
| No hay pruebas de integración ni de extremo a extremo | Vitest contra una base de datos SQLite temporal; Playwright para el recorrido en el navegador |
| Los datos de contacto están en dos archivos | Extraerlos a un único módulo en `lib/` |
| SQLite no admite escrituras concurrentes a gran escala | Pasar a PostgreSQL: cambian el `provider` del esquema, el adaptador de `lib/db.ts` y las migraciones; servicios, controladores y páginas no se tocan |

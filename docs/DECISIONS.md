# Decisiones del proyecto

Registro de las decisiones tomadas y su motivo. El enunciado deja varias a elección del candidato y pide justificarlas.

## 1. Alta de empleados por un administrador

**Decisión:** no hay registro público. Las cuentas las crea un administrador desde su panel.

**Motivo:** el foro es interno. Un registro abierto permitiría que cualquier visitante creara una cuenta y leyera avisos e incidencias de la empresa. En una empresa real, las cuentas las gestiona quien administra al personal. Además, esta opción da contenido real al rol de administrador.

## 2. Next.js con TypeScript

**Decisión:** un único proyecto de Next.js para la parte pública y la privada.

**Motivo:** permite tener la interfaz y la lógica de servidor en el mismo repositorio, sin mantener dos aplicaciones. Las páginas públicas se generan en el servidor, lo que favorece la velocidad de carga y el posicionamiento. TypeScript detecta errores antes de ejecutar el código.

## 3. SQLite con Prisma

**Decisión:** base de datos SQLite en un archivo local, gestionada con Prisma.

**Motivo:** quien evalúe la prueba puede clonar el repositorio y arrancarlo sin instalar ni configurar un servidor de base de datos. Prisma define el esquema en un solo archivo legible y permite cambiar a otra base de datos, como PostgreSQL, sin reescribir las consultas.

## 4. Sesiones con cookie en lugar de una librería de autenticación

**Decisión:** autenticación propia con sesiones guardadas en base de datos, cookie `httpOnly` y contraseñas cifradas con bcrypt.

**Motivo:** el requisito es sencillo (email y contraseña, dos roles). Una implementación corta es más fácil de entender y explicar que una librería completa. La cookie `httpOnly` no es accesible desde JavaScript, lo que la protege frente a robos mediante scripts, y guardar la sesión en el servidor permite invalidarla al desactivar a un empleado.

## 5. Categorías en los hilos del foro

**Decisión:** cada hilo se clasifica como duda, aviso o incidencia.

**Motivo:** el enunciado describe el foro como un espacio para "compartir dudas, avisos e incidencias técnicas". Reflejarlo como categorías ayuda a los empleados a encontrar lo que buscan con un coste de desarrollo bajo.

## 6. GitHub Flow

**Decisión:** una rama `main` estable y una rama por funcionalidad, fusionada mediante Pull Request.

**Motivo:** es el flujo más simple que cumple lo que pide la prueba. Cada Pull Request agrupa un cambio completo y deja documentado qué se hizo y por qué. Un flujo con más ramas permanentes no aporta nada en un proyecto individual de dos días.

## 7. Commits en español con formato Conventional Commits

**Decisión:** mensajes como `feat: añade el listado de hilos`, con un tipo al inicio y la descripción en español.

**Motivo:** el tipo (`feat`, `fix`, `docs`...) permite entender el historial de un vistazo, y el español es el idioma del equipo que va a revisarlo.

## 8. Web en español

**Decisión:** los textos de la web están en español.

**Motivo:** la empresa y sus clientes principales están en Barcelona. Los nombres del código se mantienen en inglés por convención.

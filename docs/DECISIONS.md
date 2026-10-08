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

## 8. Web en inglés

**Decisión:** los textos de la web están en inglés. La documentación, los comentarios, los commits y los Pull Request siguen en español.

**Motivo:** la web actual de la empresa está en inglés y el sector náutico trabaja con armadores y tripulaciones de muchos países, así que la demo mantiene el idioma que la empresa ya usa de cara al público. La documentación se queda en español porque es el idioma del equipo que va a revisarla.

## 9. Renderizado clásico, sin Cache Components

**Decisión:** se desactiva la opción `cacheComponents` que la plantilla de Next.js 16 trae activada.

**Motivo:** con esa opción, cualquier página que lea la sesión o la base de datos tiene que envolverse en límites de `Suspense` y decidir qué se cachea. Es una optimización pensada para aplicaciones grandes. En esta demo las páginas públicas siguen siendo estáticas y las privadas se generan en cada petición, que es justo lo que se necesita, y el código queda más corto y fácil de explicar.

## 10. Sesiones guardadas como hash

**Decisión:** la cookie lleva un token aleatorio y en la base de datos se guarda su hash SHA-256, no el token.

**Motivo:** si alguien llegara a leer la tabla de sesiones, no podría usar su contenido para suplantar a un usuario. Es el mismo principio que se aplica a las contraseñas, que se guardan cifradas con bcrypt.

## 11. Adaptador libSQL para SQLite

**Decisión:** Prisma se conecta a SQLite mediante el adaptador `@prisma/adapter-libsql`.

**Motivo:** Prisma 7 exige un adaptador para cada base de datos. Este funciona con un archivo local sin compilar nada al instalar, y es el mismo que usa Turso, de modo que desplegar la demo solo requeriría cambiar la URL de conexión.

## 12. Movimiento con CSS, sin librerías

**Decisión:** las animaciones (entrada de la portada, acercamiento lento de la fotografía y efectos al pasar el ratón) se hacen con CSS, definidas en `app/globals.css`. Se desactivan para quien tiene activada la opción "reducir movimiento" en su sistema.

**Motivo:** una librería de animación añadiría una dependencia y código difícil de explicar para efectos que CSS resuelve en pocas líneas. El movimiento se limita a la portada y a las interacciones: no hay animaciones al hacer scroll en cada sección, que es el recurso más repetido en las webs de plantilla.

## 13. La cabecera es un componente de cliente

**Decisión:** `components/Header.tsx` pasa a ejecutarse también en el navegador.

**Motivo:** necesita dos datos que solo existen ahí: la posición del scroll, para ser transparente sobre la fotografía de la portada y tomar fondo al bajar, y la ruta actual, para marcar el enlace de la página en la que se está. No lee la sesión, así que las páginas públicas siguen siendo estáticas.

## 14. Arquitectura por capas

**Decisión:** el código se separa en presentación (`app/`, `components/`), controladores (`app/actions/`), servicios (`server/services/`) y repositorios (`server/repositories/`). Cada capa solo llama a la que tiene debajo, y solo los repositorios usan Prisma.

**Motivo:** en la primera versión las acciones de servidor mezclaban la lectura del formulario, la validación, las reglas de negocio y las consultas, y las páginas consultaban la base de datos directamente. Con las capas, el frontend y el backend quedan separados, las reglas se pueden probar sin base de datos y cambiar de base de datos solo afectaría a los repositorios.

Se valoró la arquitectura hexagonal, que invierte las dependencias mediante interfaces para que las reglas no conozcan la infraestructura. Para cuatro tablas habría triplicado el número de archivos sin resolver ningún problema real del proyecto. Las capas son el paso previo: si la aplicación creciera, bastaría con añadir interfaces sobre los repositorios que ya existen.

Tampoco se separa en dos aplicaciones (una API y un frontend aparte): obligaría a reescribir el proyecto y a perder la ventaja de tener interfaz y servidor en un solo repositorio. Con el backend aislado en `server/`, extraerlo a una API sería posible sin tocar las reglas.

## 15. Pruebas unitarias con Vitest

**Decisión:** las reglas de negocio y la validación tienen pruebas unitarias en `tests/unit/`, ejecutadas con Vitest. GitHub Actions las ejecuta, junto con el linter y la compilación, en cada Pull Request.

**Motivo:** las pruebas dejan constancia de que las reglas se cumplen (una cuenta desactivada no entra, solo el administrador borra, la contraseña se guarda cifrada) y avisan si un cambio futuro las rompe. Los servicios se prueban con los repositorios simulados, de modo que cada prueba es rápida y comprueba una sola regla. Se eligió Vitest porque entiende TypeScript sin configuración adicional.

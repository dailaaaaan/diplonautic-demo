// Configuración de la herramienta de línea de comandos de Prisma.
// "dotenv/config" carga las variables del archivo .env.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Comando que ejecuta "prisma db seed" para crear los datos de prueba.
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});

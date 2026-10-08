// Configuración de Vitest, la herramienta que ejecuta las pruebas.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // El mismo alias "@/..." que usa el resto del proyecto.
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    // Las pruebas son de lógica de servidor: no necesitan un navegador.
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});

// Pruebas del servicio de autenticación (server/services/auth.ts).
// El repositorio de usuarios se sustituye por uno simulado, así las pruebas
// no necesitan base de datos y comprueban solo las reglas.
import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as usersRepository from "@/server/repositories/users";
import { checkCredentials } from "@/server/services/auth";

vi.mock("@/server/repositories/users", () => ({
  findUserByEmail: vi.fn(),
}));

const findUserByEmail = vi.mocked(usersRepository.findUserByEmail);

const PASSWORD = "Employee-2026";

// Devuelve un usuario como lo devolvería la base de datos.
async function buildUser(overrides: { active?: boolean } = {}) {
  return {
    id: 2,
    email: "marc.soler@diplonautic.com",
    name: "Marc Soler",
    // Coste 4 para que las pruebas sean rápidas.
    passwordHash: await bcrypt.hash(PASSWORD, 4),
    role: "EMPLOYEE" as const,
    active: overrides.active ?? true,
    createdAt: new Date(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("checkCredentials", () => {
  it("acepta el email y la contraseña correctos", async () => {
    findUserByEmail.mockResolvedValue(await buildUser());

    const result = await checkCredentials(
      "marc.soler@diplonautic.com",
      PASSWORD,
    );

    expect(result).toEqual({ ok: true, userId: 2 });
  });

  it("busca el email sin espacios y en minúsculas", async () => {
    findUserByEmail.mockResolvedValue(await buildUser());

    await checkCredentials("  Marc.Soler@Diplonautic.com ", PASSWORD);

    expect(findUserByEmail).toHaveBeenCalledWith("marc.soler@diplonautic.com");
  });

  it("rechaza una contraseña errónea", async () => {
    findUserByEmail.mockResolvedValue(await buildUser());

    const result = await checkCredentials(
      "marc.soler@diplonautic.com",
      "otra-contraseña",
    );

    expect(result).toEqual({ ok: false, error: "Invalid email or password." });
  });

  it("rechaza un email que no existe", async () => {
    findUserByEmail.mockResolvedValue(null);

    const result = await checkCredentials("nadie@diplonautic.com", PASSWORD);

    expect(result).toEqual({ ok: false, error: "Invalid email or password." });
  });

  it("rechaza una cuenta desactivada aunque la contraseña sea correcta", async () => {
    findUserByEmail.mockResolvedValue(await buildUser({ active: false }));

    const result = await checkCredentials(
      "marc.soler@diplonautic.com",
      PASSWORD,
    );

    expect(result).toEqual({ ok: false, error: "Invalid email or password." });
  });

  it("da el mismo mensaje si falla el email o la contraseña", async () => {
    findUserByEmail.mockResolvedValue(null);
    const unknownEmail = await checkCredentials("nadie@x.com", PASSWORD);

    findUserByEmail.mockResolvedValue(await buildUser());
    const wrongPassword = await checkCredentials(
      "marc.soler@diplonautic.com",
      "mal",
    );

    expect(unknownEmail).toEqual(wrongPassword);
  });

  it("no consulta la base de datos si falta la contraseña", async () => {
    const result = await checkCredentials("marc.soler@diplonautic.com", "");

    expect(result.ok).toBe(false);
    expect(findUserByEmail).not.toHaveBeenCalled();
  });

  it("no consulta la base de datos si falta el email", async () => {
    const result = await checkCredentials("   ", PASSWORD);

    expect(result.ok).toBe(false);
    expect(findUserByEmail).not.toHaveBeenCalled();
  });
});

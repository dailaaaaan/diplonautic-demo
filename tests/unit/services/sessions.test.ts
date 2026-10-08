// Pruebas del servicio de sesiones (server/services/sessions.ts), con el
// repositorio simulado.
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as sessionsRepository from "@/server/repositories/sessions";
import {
  endSession,
  getUserFromToken,
  hashToken,
  SESSION_DAYS,
  startSession,
} from "@/server/services/sessions";

vi.mock("@/server/repositories/sessions", () => ({
  createSession: vi.fn(),
  findSessionWithUser: vi.fn(),
  deleteSession: vi.fn(),
}));

const repository = vi.mocked(sessionsRepository);

const DAY_IN_MS = 24 * 60 * 60 * 1000;

// Devuelve una sesión como la devolvería la base de datos.
function buildSession(overrides: { expiresAt?: Date; active?: boolean } = {}) {
  return {
    id: "hash",
    userId: 2,
    createdAt: new Date(),
    expiresAt: overrides.expiresAt ?? new Date(Date.now() + DAY_IN_MS),
    user: {
      id: 2,
      email: "marc.soler@diplonautic.com",
      name: "Marc Soler",
      passwordHash: "hash-secreto",
      role: "EMPLOYEE" as const,
      active: overrides.active ?? true,
      createdAt: new Date(),
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("hashToken", () => {
  it("devuelve siempre el mismo hash para el mismo token", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
  });

  it("devuelve hashes distintos para tokens distintos", () => {
    expect(hashToken("abc")).not.toBe(hashToken("abd"));
  });

  it("no devuelve el token en claro", () => {
    expect(hashToken("abc")).not.toContain("abc");
    // SHA-256 en hexadecimal: 64 caracteres.
    expect(hashToken("abc")).toHaveLength(64);
  });
});

describe("startSession", () => {
  it("guarda el hash del token, no el token", async () => {
    const { token } = await startSession(2);

    const saved = repository.createSession.mock.calls[0][0];
    expect(saved.id).toBe(hashToken(token));
    expect(saved.id).not.toBe(token);
    expect(saved.userId).toBe(2);
  });

  it("genera un token distinto en cada sesión", async () => {
    const first = await startSession(2);
    const second = await startSession(2);

    expect(first.token).not.toBe(second.token);
  });

  it("fija la caducidad a los días configurados", async () => {
    const before = Date.now();
    const { expiresAt } = await startSession(2);

    const days = (expiresAt.getTime() - before) / DAY_IN_MS;
    expect(days).toBeCloseTo(SESSION_DAYS, 2);
  });
});

describe("getUserFromToken", () => {
  it("devuelve el usuario de una sesión válida", async () => {
    repository.findSessionWithUser.mockResolvedValue(buildSession());

    const user = await getUserFromToken("token");

    expect(user).toEqual({
      id: 2,
      name: "Marc Soler",
      email: "marc.soler@diplonautic.com",
      role: "EMPLOYEE",
    });
  });

  it("no devuelve nunca el hash de la contraseña", async () => {
    repository.findSessionWithUser.mockResolvedValue(buildSession());

    const user = await getUserFromToken("token");

    expect(user).not.toHaveProperty("passwordHash");
  });

  it("busca la sesión por el hash del token", async () => {
    repository.findSessionWithUser.mockResolvedValue(buildSession());

    await getUserFromToken("token");

    expect(repository.findSessionWithUser).toHaveBeenCalledWith(
      hashToken("token"),
    );
  });

  it("devuelve null si la sesión no existe", async () => {
    repository.findSessionWithUser.mockResolvedValue(null);

    expect(await getUserFromToken("token")).toBeNull();
  });

  it("devuelve null si la sesión ha caducado", async () => {
    repository.findSessionWithUser.mockResolvedValue(
      buildSession({ expiresAt: new Date(Date.now() - 1000) }),
    );

    expect(await getUserFromToken("token")).toBeNull();
  });

  it("devuelve null si el usuario está desactivado", async () => {
    repository.findSessionWithUser.mockResolvedValue(
      buildSession({ active: false }),
    );

    expect(await getUserFromToken("token")).toBeNull();
  });
});

describe("endSession", () => {
  it("borra la sesión por el hash del token", async () => {
    await endSession("token");

    expect(repository.deleteSession).toHaveBeenCalledWith(hashToken("token"));
  });
});

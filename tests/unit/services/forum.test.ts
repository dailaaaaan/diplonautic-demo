// Pruebas del servicio del foro (server/services/forum.ts), con el
// repositorio simulado.
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as forumRepository from "@/server/repositories/forum";
import {
  createReply,
  createThread,
  deleteReply,
  deleteThread,
  getThread,
  parseCategoryFilter,
  type Actor,
} from "@/server/services/forum";

vi.mock("@/server/repositories/forum", () => ({
  listThreads: vi.fn(),
  findThreadWithReplies: vi.fn(),
  findThread: vi.fn(),
  createThread: vi.fn(),
  deleteThread: vi.fn(),
  createReply: vi.fn(),
  findReply: vi.fn(),
  deleteReply: vi.fn(),
}));

const repository = vi.mocked(forumRepository);

const employee: Actor = { id: 2, role: "EMPLOYEE" };
const admin: Actor = { id: 1, role: "ADMIN" };

const validThread = {
  title: "Watermaker losing pressure",
  category: "INCIDENT",
  body: "It drops after twenty minutes.",
};

const storedThread = {
  id: 7,
  title: validThread.title,
  body: validThread.body,
  category: "INCIDENT" as const,
  authorId: 2,
  createdAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("parseCategoryFilter", () => {
  it("devuelve la categoría si es válida", () => {
    expect(parseCategoryFilter("NOTICE")).toBe("NOTICE");
  });

  it("devuelve null si no hay filtro", () => {
    expect(parseCategoryFilter(undefined)).toBeNull();
  });

  it("ignora un valor que no es una categoría", () => {
    expect(parseCategoryFilter("HACK")).toBeNull();
  });
});

describe("getThread", () => {
  it("devuelve el hilo que da el repositorio", async () => {
    repository.findThreadWithReplies.mockResolvedValue({
      ...storedThread,
      author: { name: "Marc Soler" },
      replies: [],
    });

    const thread = await getThread(7);

    expect(thread?.id).toBe(7);
  });

  it("devuelve null sin consultar si el id no es un número", async () => {
    const thread = await getThread(Number("abc"));

    expect(thread).toBeNull();
    expect(repository.findThreadWithReplies).not.toHaveBeenCalled();
  });
});

describe("createThread", () => {
  it("crea el hilo con el autor de la sesión", async () => {
    repository.createThread.mockResolvedValue(storedThread);

    const result = await createThread(employee, validThread);

    expect(result).toEqual({ ok: true, threadId: 7 });
    expect(repository.createThread).toHaveBeenCalledWith(
      expect.objectContaining({ authorId: employee.id }),
    );
  });

  it("guarda el título y el mensaje sin espacios en los extremos", async () => {
    repository.createThread.mockResolvedValue(storedThread);

    await createThread(employee, {
      ...validThread,
      title: "  Watermaker losing pressure  ",
      body: "  It drops.  ",
    });

    expect(repository.createThread).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Watermaker losing pressure",
        body: "It drops.",
      }),
    );
  });

  it("rechaza una categoría falsificada sin guardar nada", async () => {
    const result = await createThread(employee, {
      ...validThread,
      category: "HACK",
    });

    expect(result).toEqual({ ok: false, error: "Choose a category." });
    expect(repository.createThread).not.toHaveBeenCalled();
  });

  it("rechaza un mensaje formado solo por espacios", async () => {
    const result = await createThread(employee, { ...validThread, body: "  " });

    expect(result.ok).toBe(false);
    expect(repository.createThread).not.toHaveBeenCalled();
  });
});

describe("createReply", () => {
  it("guarda la respuesta en el hilo, con el autor de la sesión", async () => {
    repository.findThread.mockResolvedValue(storedThread);

    const result = await createReply(employee, 7, "Check the feed pump.");

    expect(result).toEqual({ ok: true });
    expect(repository.createReply).toHaveBeenCalledWith({
      body: "Check the feed pump.",
      threadId: 7,
      authorId: employee.id,
    });
  });

  it("rechaza una respuesta vacía", async () => {
    const result = await createReply(employee, 7, "   ");

    expect(result.ok).toBe(false);
    expect(repository.createReply).not.toHaveBeenCalled();
  });

  it("rechaza responder a un hilo que no existe", async () => {
    repository.findThread.mockResolvedValue(null);

    const result = await createReply(employee, 999, "Hello");

    expect(result).toEqual({
      ok: false,
      error: "This thread no longer exists.",
    });
    expect(repository.createReply).not.toHaveBeenCalled();
  });

  it("rechaza un identificador de hilo que no es un número", async () => {
    const result = await createReply(employee, Number("abc"), "Hello");

    expect(result.ok).toBe(false);
    expect(repository.findThread).not.toHaveBeenCalled();
  });
});

describe("deleteThread", () => {
  it("permite borrar a un administrador", async () => {
    const result = await deleteThread(admin, 7);

    expect(result).toEqual({ ok: true });
    expect(repository.deleteThread).toHaveBeenCalledWith(7);
  });

  it("impide borrar a un empleado", async () => {
    const result = await deleteThread(employee, 7);

    expect(result.ok).toBe(false);
    expect(repository.deleteThread).not.toHaveBeenCalled();
  });

  it("rechaza un identificador que no es un número", async () => {
    const result = await deleteThread(admin, Number("abc"));

    expect(result.ok).toBe(false);
    expect(repository.deleteThread).not.toHaveBeenCalled();
  });
});

describe("deleteReply", () => {
  const storedReply = {
    id: 3,
    body: "Check the feed pump.",
    threadId: 7,
    authorId: 1,
    createdAt: new Date(),
  };

  it("permite borrar a un administrador y devuelve el hilo afectado", async () => {
    repository.findReply.mockResolvedValue(storedReply);

    const result = await deleteReply(admin, 3);

    expect(result).toEqual({ ok: true, threadId: 7 });
    expect(repository.deleteReply).toHaveBeenCalledWith(3);
  });

  it("impide borrar a un empleado", async () => {
    const result = await deleteReply(employee, 3);

    expect(result.ok).toBe(false);
    expect(repository.findReply).not.toHaveBeenCalled();
    expect(repository.deleteReply).not.toHaveBeenCalled();
  });

  it("no falla si la respuesta ya no existe", async () => {
    repository.findReply.mockResolvedValue(null);

    const result = await deleteReply(admin, 999);

    expect(result.ok).toBe(false);
    expect(repository.deleteReply).not.toHaveBeenCalled();
  });
});

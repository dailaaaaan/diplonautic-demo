// Pruebas de la validación del foro (server/validation/forum.ts).
import { describe, expect, it } from "vitest";
import {
  MAX_BODY_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_TITLE_LENGTH,
  validateReply,
  validateThread,
} from "@/server/validation/forum";

const validThread = {
  title: "Watermaker losing pressure",
  category: "INCIDENT",
  body: "It drops after twenty minutes.",
};

describe("validateThread", () => {
  it("acepta un hilo correcto", () => {
    expect(validateThread(validThread)).toBeNull();
  });

  it.each(["QUESTION", "NOTICE", "INCIDENT"])(
    "acepta la categoría %s",
    (category) => {
      expect(validateThread({ ...validThread, category })).toBeNull();
    },
  );

  it.each(["", "HACK", "question", "notice ", "DROP TABLE"])(
    "rechaza la categoría '%s'",
    (category) => {
      expect(validateThread({ ...validThread, category })).toMatch(/category/);
    },
  );

  it("acepta un título con la longitud mínima", () => {
    const title = "a".repeat(MIN_TITLE_LENGTH);
    expect(validateThread({ ...validThread, title })).toBeNull();
  });

  it("rechaza un título demasiado corto", () => {
    const title = "a".repeat(MIN_TITLE_LENGTH - 1);
    expect(validateThread({ ...validThread, title })).toMatch(/title/);
  });

  it("acepta un título con la longitud máxima", () => {
    const title = "a".repeat(MAX_TITLE_LENGTH);
    expect(validateThread({ ...validThread, title })).toBeNull();
  });

  it("rechaza un título que supera la longitud máxima", () => {
    const title = "a".repeat(MAX_TITLE_LENGTH + 1);
    expect(validateThread({ ...validThread, title })).toMatch(/title/);
  });

  it("rechaza un mensaje vacío", () => {
    expect(validateThread({ ...validThread, body: "" })).toMatch(/message/);
  });

  it("acepta un mensaje con la longitud máxima", () => {
    const body = "a".repeat(MAX_BODY_LENGTH);
    expect(validateThread({ ...validThread, body })).toBeNull();
  });

  it("rechaza un mensaje que supera la longitud máxima", () => {
    const body = "a".repeat(MAX_BODY_LENGTH + 1);
    expect(validateThread({ ...validThread, body })).toMatch(/message/);
  });

  it("no rechaza un mensaje por contener HTML: se escapa al mostrarlo", () => {
    const body = '<script>alert("x")</script>';
    expect(validateThread({ ...validThread, body })).toBeNull();
  });
});

describe("validateReply", () => {
  it("acepta una respuesta correcta", () => {
    expect(validateReply("Check the feed pump first.")).toBeNull();
  });

  it("rechaza una respuesta vacía", () => {
    expect(validateReply("")).toMatch(/reply/);
  });

  it("acepta una respuesta con la longitud máxima", () => {
    expect(validateReply("a".repeat(MAX_BODY_LENGTH))).toBeNull();
  });

  it("rechaza una respuesta que supera la longitud máxima", () => {
    expect(validateReply("a".repeat(MAX_BODY_LENGTH + 1))).toMatch(/reply/);
  });
});

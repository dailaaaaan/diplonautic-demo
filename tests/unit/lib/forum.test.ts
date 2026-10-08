// Pruebas de las utilidades del foro (lib/forum.ts) y de las iniciales.
import { describe, expect, it } from "vitest";
import { categories, categoryLabel, formatDate, isCategory } from "@/lib/forum";
import { getInitials } from "@/lib/initials";

describe("categories", () => {
  it("define las tres categorías del enunciado", () => {
    expect(categories.map((category) => category.value)).toEqual([
      "QUESTION",
      "NOTICE",
      "INCIDENT",
    ]);
  });
});

describe("isCategory", () => {
  it.each(["QUESTION", "NOTICE", "INCIDENT"])("reconoce %s", (value) => {
    expect(isCategory(value)).toBe(true);
  });

  it.each(["", "question", "HACK", "NOTICE "])("rechaza '%s'", (value) => {
    expect(isCategory(value)).toBe(false);
  });
});

describe("categoryLabel", () => {
  it("devuelve el texto que se muestra para cada categoría", () => {
    expect(categoryLabel("QUESTION")).toBe("Question");
    expect(categoryLabel("NOTICE")).toBe("Notice");
    expect(categoryLabel("INCIDENT")).toBe("Incident");
  });
});

describe("formatDate", () => {
  it("muestra día, mes abreviado, año y hora", () => {
    const text = formatDate(new Date(2026, 9, 3, 9, 57));
    expect(text).toContain("03 Oct 2026");
    expect(text).toContain("09:57");
  });
});

describe("getInitials", () => {
  it("devuelve las iniciales de nombre y apellido", () => {
    expect(getInitials("Marc Soler")).toBe("MS");
  });

  it("usa como máximo las dos primeras palabras", () => {
    expect(getInitials("Dylan Andreu Fiallos Sánchez")).toBe("DA");
  });

  it("funciona con un nombre de una sola palabra", () => {
    expect(getInitials("Laura")).toBe("L");
  });

  it("pasa las iniciales a mayúsculas", () => {
    expect(getInitials("marc soler")).toBe("MS");
  });

  it("ignora los espacios repetidos", () => {
    expect(getInitials("  Marc   Soler  ")).toBe("MS");
  });

  it("devuelve una cadena vacía si no hay nombre", () => {
    expect(getInitials("")).toBe("");
  });
});

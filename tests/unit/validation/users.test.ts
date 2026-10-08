// Pruebas de la validación de usuarios (server/validation/users.ts).
import { describe, expect, it } from "vitest";
import {
  isValidEmail,
  MAX_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  validateLogin,
  validateNewUser,
} from "@/server/validation/users";

const validUser = {
  name: "Marc Soler",
  email: "marc.soler@diplonautic.com",
  password: "Employee-2026",
};

describe("normalizeEmail", () => {
  it("quita los espacios de los extremos", () => {
    expect(normalizeEmail("  marc@diplonautic.com  ")).toBe(
      "marc@diplonautic.com",
    );
  });

  it("pasa el email a minúsculas", () => {
    expect(normalizeEmail("Marc.Soler@Diplonautic.COM")).toBe(
      "marc.soler@diplonautic.com",
    );
  });
});

describe("isValidEmail", () => {
  it.each([
    "marc@diplonautic.com",
    "marc.soler@diplonautic.com",
    "admin+test@example.co.uk",
  ])("acepta %s", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each([
    "",
    "marc",
    "marc@",
    "@diplonautic.com",
    "marc@diplonautic",
    "marc soler@diplonautic.com",
    "marc@@diplonautic.com",
  ])("rechaza '%s'", (email) => {
    expect(isValidEmail(email)).toBe(false);
  });
});

describe("validateNewUser", () => {
  it("acepta datos correctos", () => {
    expect(validateNewUser(validUser)).toBeNull();
  });

  it("rechaza un nombre vacío", () => {
    expect(validateNewUser({ ...validUser, name: "" })).toMatch(/name/);
  });

  it("acepta un nombre con la longitud máxima", () => {
    const name = "a".repeat(MAX_NAME_LENGTH);
    expect(validateNewUser({ ...validUser, name })).toBeNull();
  });

  it("rechaza un nombre que supera la longitud máxima", () => {
    const name = "a".repeat(MAX_NAME_LENGTH + 1);
    expect(validateNewUser({ ...validUser, name })).toMatch(/name/);
  });

  it("rechaza un email con formato incorrecto", () => {
    expect(validateNewUser({ ...validUser, email: "no-es-email" })).toMatch(
      /valid email/,
    );
  });

  it("acepta una contraseña con la longitud mínima", () => {
    const password = "a".repeat(MIN_PASSWORD_LENGTH);
    expect(validateNewUser({ ...validUser, password })).toBeNull();
  });

  it("rechaza una contraseña demasiado corta", () => {
    const password = "a".repeat(MIN_PASSWORD_LENGTH - 1);
    expect(validateNewUser({ ...validUser, password })).toMatch(/password/);
  });

  it("informa primero del error del nombre si hay varios", () => {
    const result = validateNewUser({ name: "", email: "mal", password: "" });
    expect(result).toMatch(/name/);
  });
});

describe("validateLogin", () => {
  it("acepta email y contraseña informados", () => {
    expect(
      validateLogin({ email: "marc@diplonautic.com", password: "secreto" }),
    ).toBeNull();
  });

  it("rechaza un email vacío", () => {
    expect(validateLogin({ email: "", password: "secreto" })).not.toBeNull();
  });

  it("rechaza una contraseña vacía", () => {
    expect(
      validateLogin({ email: "marc@diplonautic.com", password: "" }),
    ).not.toBeNull();
  });
});

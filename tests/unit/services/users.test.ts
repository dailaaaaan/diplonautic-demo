// Pruebas del servicio de usuarios (server/services/users.ts), con los
// repositorios simulados.
import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as sessionsRepository from "@/server/repositories/sessions";
import * as usersRepository from "@/server/repositories/users";
import { createEmployee, setUserActive } from "@/server/services/users";

vi.mock("@/server/repositories/users", () => ({
  findUserByEmail: vi.fn(),
  createEmployee: vi.fn(),
  setUserActive: vi.fn(),
  listUsers: vi.fn(),
}));

vi.mock("@/server/repositories/sessions", () => ({
  deleteSessionsOfUser: vi.fn(),
}));

const findUserByEmail = vi.mocked(usersRepository.findUserByEmail);
const createEmployeeInDb = vi.mocked(usersRepository.createEmployee);
const setUserActiveInDb = vi.mocked(usersRepository.setUserActive);
const deleteSessionsOfUser = vi.mocked(sessionsRepository.deleteSessionsOfUser);

const validInput = {
  name: "Anna Puig",
  email: "anna.puig@diplonautic.com",
  password: "Password-1",
};

beforeEach(() => {
  vi.clearAllMocks();
  findUserByEmail.mockResolvedValue(null);
});

describe("createEmployee", () => {
  it("crea la cuenta cuando los datos son válidos", async () => {
    const result = await createEmployee(validInput);

    expect(result).toEqual({ ok: true, name: "Anna Puig" });
    expect(createEmployeeInDb).toHaveBeenCalledTimes(1);
  });

  it("guarda el nombre sin espacios y el email en minúsculas", async () => {
    await createEmployee({
      ...validInput,
      name: "  Anna Puig ",
      email: " Anna.Puig@Diplonautic.com ",
    });

    expect(createEmployeeInDb).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Anna Puig",
        email: "anna.puig@diplonautic.com",
      }),
    );
  });

  it("guarda la contraseña cifrada, nunca en claro", async () => {
    await createEmployee(validInput);

    const saved = createEmployeeInDb.mock.calls[0][0];
    expect(saved.passwordHash).not.toBe(validInput.password);
    expect(await bcrypt.compare(validInput.password, saved.passwordHash)).toBe(
      true,
    );
  });

  it("rechaza un email que ya tiene cuenta", async () => {
    findUserByEmail.mockResolvedValue({
      id: 2,
      email: validInput.email,
      name: "Otra persona",
      passwordHash: "hash",
      role: "EMPLOYEE",
      active: true,
      createdAt: new Date(),
    });

    const result = await createEmployee(validInput);

    expect(result).toEqual({
      ok: false,
      error: "There is already an account with that email.",
    });
    expect(createEmployeeInDb).not.toHaveBeenCalled();
  });

  it("rechaza datos no válidos sin tocar la base de datos", async () => {
    const result = await createEmployee({ ...validInput, password: "corta" });

    expect(result.ok).toBe(false);
    expect(findUserByEmail).not.toHaveBeenCalled();
    expect(createEmployeeInDb).not.toHaveBeenCalled();
  });

  it("rechaza un nombre formado solo por espacios", async () => {
    const result = await createEmployee({ ...validInput, name: "   " });

    expect(result.ok).toBe(false);
    expect(createEmployeeInDb).not.toHaveBeenCalled();
  });
});

describe("setUserActive", () => {
  const ADMIN_ID = 1;
  const EMPLOYEE_ID = 2;

  it("desactiva la cuenta de otro usuario", async () => {
    const result = await setUserActive(ADMIN_ID, EMPLOYEE_ID, false);

    expect(result).toEqual({ ok: true });
    expect(setUserActiveInDb).toHaveBeenCalledWith(EMPLOYEE_ID, false);
  });

  it("cierra las sesiones abiertas al desactivar una cuenta", async () => {
    await setUserActive(ADMIN_ID, EMPLOYEE_ID, false);

    expect(deleteSessionsOfUser).toHaveBeenCalledWith(EMPLOYEE_ID);
  });

  it("no borra sesiones al activar una cuenta", async () => {
    await setUserActive(ADMIN_ID, EMPLOYEE_ID, true);

    expect(setUserActiveInDb).toHaveBeenCalledWith(EMPLOYEE_ID, true);
    expect(deleteSessionsOfUser).not.toHaveBeenCalled();
  });

  it("impide que un administrador se desactive a sí mismo", async () => {
    const result = await setUserActive(ADMIN_ID, ADMIN_ID, false);

    expect(result.ok).toBe(false);
    expect(setUserActiveInDb).not.toHaveBeenCalled();
    expect(deleteSessionsOfUser).not.toHaveBeenCalled();
  });

  it("rechaza un identificador que no es un número", async () => {
    const result = await setUserActive(ADMIN_ID, Number("abc"), false);

    expect(result.ok).toBe(false);
    expect(setUserActiveInDb).not.toHaveBeenCalled();
  });
});

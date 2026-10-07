"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";

const labelClass =
  "block font-mono text-xs uppercase tracking-[0.08em] text-primary";
const fieldClass =
  "mt-2 block h-12 w-full rounded-[2px] border border-line bg-white px-4 text-ink";

const initialState: LoginState = {};

export default function LoginForm() {
  // useActionState conecta el formulario con la acción del servidor:
  // "state" es lo que devuelve la acción y "pending" indica si está en curso.
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          defaultValue={state.email}
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldClass}
        />
      </div>

      {state.error && (
        <p role="alert" className="border-l-2 border-accent pl-3 text-[15px]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-[2px] bg-accent px-6 font-medium text-ink transition-colors duration-150 hover:bg-primary hover:text-white disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

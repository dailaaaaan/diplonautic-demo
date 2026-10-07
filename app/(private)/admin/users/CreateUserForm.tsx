"use client";

import { useActionState } from "react";
import { createUser, type CreateUserState } from "@/app/actions/users";

const labelClass =
  "block font-mono text-xs uppercase tracking-[0.08em] text-primary";
const fieldClass =
  "mt-2 block h-12 w-full rounded-[2px] border border-line bg-white px-4 text-ink";

const initialState: CreateUserState = {};

export default function CreateUserForm() {
  const [state, formAction, pending] = useActionState(createUser, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="name" className={labelClass}>
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={state.name}
          required
          maxLength={80}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state.email}
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Initial password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={fieldClass}
        />
        <p className="mt-2 text-sm text-ink/70">At least 8 characters.</p>
      </div>

      {state.error && (
        <p role="alert" className="border-l-2 border-accent pl-3 text-[15px]">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="border-l-2 border-primary pl-3 text-[15px]">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-[2px] bg-accent px-6 font-medium text-ink transition-colors duration-150 hover:bg-primary hover:text-white disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create employee"}
      </button>
    </form>
  );
}

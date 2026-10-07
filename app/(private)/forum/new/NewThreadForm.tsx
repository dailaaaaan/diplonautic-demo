"use client";

import { useActionState } from "react";
import { createThread, type ThreadFormState } from "@/app/actions/forum";
import { categories } from "@/lib/forum";

const labelClass =
  "block font-mono text-xs uppercase tracking-[0.08em] text-primary";
const fieldClass =
  "mt-2 block w-full rounded-[2px] border border-line bg-white px-4 text-ink";

const initialState: ThreadFormState = {};

export default function NewThreadForm() {
  const [state, formAction, pending] = useActionState(
    createThread,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={state.title}
          required
          minLength={3}
          maxLength={120}
          className={`${fieldClass} h-12`}
        />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={state.category ?? "QUESTION"}
          className={`${fieldClass} h-12`}
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="body" className={labelClass}>
          Message
        </label>
        <textarea
          id="body"
          name="body"
          rows={8}
          defaultValue={state.body}
          required
          maxLength={5000}
          className={`${fieldClass} py-3`}
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
        className="h-12 rounded-[2px] bg-accent px-6 font-medium text-ink transition-colors duration-150 hover:bg-primary hover:text-white disabled:opacity-60"
      >
        {pending ? "Publishing…" : "Publish thread"}
      </button>
    </form>
  );
}

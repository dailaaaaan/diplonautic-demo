"use client";

import { useActionState } from "react";
import { createReply, type ReplyFormState } from "@/app/actions/forum";

const initialState: ReplyFormState = {};

export default function ReplyForm({ threadId }: { threadId: number }) {
  const [state, formAction, pending] = useActionState(
    createReply,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="threadId" value={threadId} />

      <div>
        <label
          htmlFor="body"
          className="block font-mono text-xs uppercase tracking-[0.08em] text-primary"
        >
          Your reply
        </label>
        <textarea
          id="body"
          name="body"
          rows={5}
          defaultValue={state.body}
          required
          maxLength={5000}
          className="mt-2 block w-full rounded-[2px] border border-line bg-white px-4 py-3 text-ink"
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
        {pending ? "Sending…" : "Post reply"}
      </button>
    </form>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import NewThreadForm from "./NewThreadForm";

export const metadata: Metadata = {
  title: "New thread — Diplonautic",
};

export default async function NewThreadPage() {
  await requireUser();

  return (
    <main className="flex-1 px-4 py-14 md:px-6 md:py-20 lg:px-16">
      <Link
        href="/forum"
        className="font-mono text-xs uppercase tracking-[0.08em] text-primary transition-colors duration-150 hover:text-secondary"
      >
        ← Back to threads
      </Link>
      <h1 className="mt-4 text-4xl md:text-5xl">New thread</h1>

      <div className="mt-10 max-w-[720px] border border-line bg-mist p-6 md:p-10">
        <NewThreadForm />
      </div>
    </main>
  );
}

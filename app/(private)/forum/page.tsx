import type { Metadata } from "next";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Forum — Diplonautic",
};

export default async function ForumPage() {
  const user = await requireUser();

  return (
    <main className="flex-1 px-4 py-14 md:px-6 md:py-20 lg:px-16">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-primary">
        Internal forum
      </p>
      <h1 className="mt-4 text-4xl md:text-5xl">Welcome, {user.name}</h1>
      <p className="mt-6 max-w-[65ch] text-base md:text-[17px]">
        Threads for questions, notices and incidents will appear here.
      </p>
    </main>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Staff login — Diplonautic",
};

export default async function LoginPage() {
  // Quien ya tiene sesión no necesita ver el formulario.
  const user = await getCurrentUser();
  if (user) {
    redirect("/forum");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-mist px-4 py-14 md:py-24">
      <div className="w-full max-w-[440px] border border-line bg-white p-6 md:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-primary">
          Staff area
        </p>
        <h1 className="mt-4 text-[28px] md:text-[32px]">Sign in</h1>
        <p className="mt-3 text-[15px]">
          Accounts are created by an administrator. There is no public
          sign-up.
        </p>

        <LoginForm />
      </div>
    </main>
  );
}

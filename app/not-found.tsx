import type { Metadata } from "next";
import Link from "next/link";
import ChartLines from "@/components/ChartLines";

export const metadata: Metadata = {
  title: "Page not found — Diplonautic",
};

// Página 404 propia. Next.js la muestra cuando una ruta no existe o cuando
// una página llama a notFound(), por ejemplo al abrir un hilo borrado.
export default function NotFound() {
  return (
    <main className="relative flex flex-1 items-center overflow-hidden bg-deep px-4 py-24 text-white md:px-6 lg:px-16">
      <ChartLines className="text-line opacity-20" />

      <div className="relative">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-line md:text-[13px]">
          Error 404 · Position unknown
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">
          This page is not on the chart
        </h1>
        <p className="mt-6 max-w-[65ch] text-base text-mist md:text-[17px]">
          The address may be wrong, or the page may have been moved or
          deleted.
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex h-12 items-center justify-center rounded-[2px] bg-accent px-6 font-medium text-ink transition-colors duration-150 hover:bg-white"
        >
          Back to the home page
          <span
            aria-hidden="true"
            className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </main>
  );
}

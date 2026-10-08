import Link from "next/link";
import ChartLines from "@/components/ChartLines";

export default function ContactBanner() {
  return (
    <section className="relative overflow-hidden bg-primary text-white">
      <ChartLines className="text-line opacity-20" />

      <div className="relative px-4 py-14 md:px-6 md:py-24 lg:px-16">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-line md:text-[13px]">
          Next step
        </p>
        <h2 className="mt-4 max-w-3xl text-[28px] md:text-[40px]">
          Tell us what is failing on board
        </h2>
        <p className="mt-6 max-w-[65ch] text-base text-mist md:text-[17px]">
          Describe the vessel and the problem and we will come back to you
          with a plan and a quote.
        </p>
        <Link
          href="/contact"
          className="group mt-10 inline-flex h-12 items-center justify-center rounded-[2px] bg-accent px-6 font-medium text-ink transition-colors duration-150 hover:bg-white"
        >
          Request a quote
          <span
            aria-hidden="true"
            className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}

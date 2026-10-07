import Link from "next/link";

export default function ContactBanner() {
  return (
    <section className="relative overflow-hidden bg-primary text-white">
      {/* Curvas de profundidad de carta náutica, solo como textura de fondo. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full text-line opacity-20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M-50 330 C 200 250, 380 380, 620 300 S 1020 210, 1250 290" />
        <path d="M-50 270 C 220 180, 400 320, 640 235 S 1000 140, 1250 220" />
        <path d="M-50 205 C 240 110, 420 255, 660 170 S 990 70, 1250 150" />
        <path d="M-50 140 C 260 45, 440 190, 680 105 S 980 5, 1250 80" />
        <path d="M-50 75 C 280 -20, 460 125, 700 40 S 970 -60, 1250 10" />
      </svg>

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
          className="mt-10 inline-flex h-12 items-center justify-center rounded-[2px] bg-accent px-6 font-medium text-ink transition-colors duration-150 hover:bg-white"
        >
          Request a quote
        </Link>
      </div>
    </section>
  );
}

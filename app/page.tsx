import Image from "next/image";
import Link from "next/link";
import heroYacht from "@/public/images/hero-yacht.jpg";

const heroFacts = [
  { value: "30+", label: "Years of experience" },
  { value: "6", label: "Onboard systems" },
  { value: "BCN", label: "Based in Barcelona" },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-deep text-white">
        {/* En móvil la foto va debajo del texto; en escritorio ocupa la derecha. */}
        <div className="relative z-10 px-4 py-16 md:px-6 lg:flex lg:min-h-[720px] lg:flex-col lg:justify-center lg:px-16 lg:py-24">
          <div className="lg:max-w-[560px]">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-line md:text-[13px]">
              41°25′N 2°13′E · Sant Adrià de Besòs, Barcelona
            </p>
            <h1 className="mt-6 text-4xl md:text-6xl">
              Marine systems, installed and kept running
            </h1>
            <p className="mt-6 max-w-[65ch] text-base text-mist md:text-[17px]">
              Installation, repair and maintenance of the equipment that makes
              life on board possible: climate control, power and fresh water.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="flex h-12 items-center justify-center rounded-[2px] bg-accent px-6 font-medium text-ink transition-colors duration-150 hover:bg-white"
              >
                Request a quote
              </Link>
              <Link
                href="#services"
                className="flex h-12 items-center justify-center rounded-[2px] border border-line px-6 font-medium text-white transition-colors duration-150 hover:bg-secondary"
              >
                Our services
              </Link>
            </div>
            <ul className="mt-14 grid grid-cols-3 gap-4 border-t border-line/40 pt-6">
              {heroFacts.map((fact) => (
                <li key={fact.label}>
                  <p className="font-display text-2xl font-semibold md:text-3xl">
                    {fact.value}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-line md:text-xs">
                    {fact.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative aspect-[4/3] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[68%]">
          <Image
            src={heroYacht}
            alt="Modern motor yacht anchored in clear blue water, seen from above"
            fill
            preload
            placeholder="blur"
            sizes="(min-width: 1024px) 68vw, 100vw"
            className="object-cover"
          />
          {/* Funde la foto con el fondo azul para que el texto se lea. */}
          <div className="absolute inset-0 hidden bg-linear-to-r from-deep via-deep/55 to-transparent lg:block" />
        </div>
      </section>
    </main>
  );
}

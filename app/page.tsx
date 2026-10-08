import Image from "next/image";
import Link from "next/link";
import About from "@/components/About";
import ContactBanner from "@/components/ContactBanner";
import Services from "@/components/Services";
import heroYacht from "@/public/images/hero-yacht.jpg";

const heroFacts = [
  { value: "30+", label: "Years of experience" },
  { value: "6", label: "Onboard systems" },
  { value: "BCN", label: "Based in Barcelona" },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* El margen negativo sube la portada 72px, justo el alto de la
          cabecera, para que la foto se vea detrás de ella. */}
      <section className="relative -mt-[72px] overflow-hidden bg-deep text-white">
        {/* En móvil la foto va debajo del texto; en escritorio ocupa la derecha.
            Cada bloque entra con animate-fade-up y un retraso algo mayor. */}
        <div className="relative z-10 px-4 pb-16 pt-[136px] md:px-6 lg:flex lg:min-h-[min(100svh,972px)] lg:flex-col lg:justify-center lg:px-16 lg:pb-24 lg:pt-[168px]">
          <div className="lg:max-w-[560px]">
            <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.08em] text-line md:text-[13px]">
              41°25′N 2°13′E · Sant Adrià de Besòs, Barcelona
            </p>
            <h1 className="mt-6 animate-fade-up text-4xl [animation-delay:100ms] md:text-6xl">
              Marine systems, installed and kept running
            </h1>
            <p className="mt-6 max-w-[65ch] animate-fade-up text-base text-mist [animation-delay:200ms] md:text-[17px]">
              Installation, repair and maintenance of the equipment that makes
              life on board possible: climate control, power and fresh water.
            </p>
            <div className="mt-10 flex animate-fade-up flex-col gap-4 [animation-delay:300ms] sm:flex-row">
              <Link
                href="/contact"
                className="group flex h-12 items-center justify-center rounded-[2px] bg-accent px-6 font-medium text-ink transition-colors duration-150 hover:bg-white"
              >
                Request a quote
                {/* La flecha se desplaza al pasar el ratón por el botón. */}
                <span
                  aria-hidden="true"
                  className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <Link
                href="#services"
                className="group flex h-12 items-center justify-center rounded-[2px] border border-line px-6 font-medium text-white transition-colors duration-150 hover:bg-secondary"
              >
                Our services
                <span
                  aria-hidden="true"
                  className="ml-2 transition-transform duration-200 group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </Link>
            </div>
            <ul className="mt-14 grid animate-fade-up grid-cols-3 gap-4 border-t border-line/40 pt-6 [animation-delay:400ms]">
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

        <div className="relative aspect-[4/3] overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[68%]">
          <Image
            src={heroYacht}
            alt="Modern motor yacht anchored in clear blue water, seen from above"
            fill
            preload
            placeholder="blur"
            sizes="(min-width: 1024px) 68vw, 100vw"
            className="animate-slow-zoom object-cover"
          />
          {/* Funde la foto con el fondo azul para que el texto se lea. */}
          <div className="absolute inset-0 hidden bg-linear-to-r from-deep via-deep/55 to-transparent lg:block" />
          {/* Oscurece la franja superior para que la cabecera transparente
              se lea sobre la foto. */}
          <div className="absolute inset-x-0 top-0 hidden h-32 bg-linear-to-b from-deep/70 to-transparent lg:block" />
        </div>
      </section>

      <Services />
      <About />
      <ContactBanner />
    </main>
  );
}

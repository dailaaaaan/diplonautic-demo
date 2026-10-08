import Image from "next/image";
import ChartLines from "@/components/ChartLines";
import { services } from "@/lib/services";
import marinaAerial from "@/public/images/marina-aerial.jpg";

export default function Services() {
  return (
    <section
      id="services"
      className="relative scroll-mt-[72px] overflow-hidden px-4 py-14 md:px-6 md:py-24 lg:px-16"
    >
      {/* Textura de carta náutica, muy tenue, detrás del título. */}
      <div className="absolute inset-x-0 top-0 h-72">
        <ChartLines className="text-line opacity-25" />
      </div>

      <div className="relative">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-primary md:text-[13px]">
          What we do
        </p>
        <h2 className="mt-4 max-w-3xl text-[28px] md:text-[40px]">
          Six systems, one team on board
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div className="relative aspect-[4/3] lg:sticky lg:top-[104px] lg:aspect-[4/5] lg:self-start">
            <Image
              src={marinaAerial}
              alt="Aerial view of a marina with rows of moored yachts"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="rounded-[2px] object-cover"
            />
          </div>

          <ol className="border-t border-line">
            {services.map((service, index) => (
              // "group" permite que los hijos reaccionen al pasar el ratón
              // por la fila: el número cambia de color y el texto se desplaza.
              <li
                key={service.name}
                className="group grid grid-cols-[48px_1fr] gap-4 border-b border-line py-6 transition-colors duration-200 hover:bg-mist md:grid-cols-[72px_1fr] md:py-8"
              >
                <span className="pt-1 font-mono text-[13px] text-primary transition-all duration-200 group-hover:translate-x-2 group-hover:text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="transition-transform duration-200 group-hover:translate-x-2">
                  <h3 className="text-xl md:text-2xl">{service.name}</h3>
                  <p className="mt-2 max-w-[65ch] text-[15px] md:text-[17px]">
                    {service.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

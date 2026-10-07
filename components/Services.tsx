import Image from "next/image";
import marinaAerial from "@/public/images/marina-aerial.jpg";

const services = [
  {
    name: "Air conditioning",
    description:
      "Design, installation and servicing of chilled-water and direct-expansion systems for cabins and saloons.",
  },
  {
    name: "Refrigeration",
    description:
      "Fridges, freezers and cold rooms sized for the galley, with leak detection and gas recharging.",
  },
  {
    name: "Generators",
    description:
      "Supply, commissioning and scheduled maintenance of marine generator sets.",
  },
  {
    name: "Watermakers",
    description:
      "Reverse-osmosis units installed and serviced, including membrane replacement and winterising.",
  },
  {
    name: "Electrical systems",
    description:
      "Switchboards, batteries, chargers, inverters and fault finding on AC and DC circuits.",
  },
  {
    name: "Bow thrusters",
    description:
      "Installation and repair of electric and hydraulic thrusters for safer manoeuvring in port.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-[72px] px-4 py-14 md:px-6 md:py-24 lg:px-16"
    >
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
            <li
              key={service.name}
              className="grid grid-cols-[48px_1fr] gap-4 border-b border-line py-6 md:grid-cols-[72px_1fr] md:py-8"
            >
              <span className="pt-1 font-mono text-[13px] text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl md:text-2xl">{service.name}</h3>
                <p className="mt-2 max-w-[65ch] text-[15px] md:text-[17px]">
                  {service.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

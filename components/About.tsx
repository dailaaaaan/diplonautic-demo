import Image from "next/image";
import yachtDock from "@/public/images/yacht-dock.jpg";

const steps = [
  {
    name: "Installation",
    description:
      "We plan each system around the vessel: space, power budget and how the crew will use it.",
  },
  {
    name: "Repair",
    description:
      "We diagnose on board, source the parts and get the equipment working again.",
  },
  {
    name: "Maintenance",
    description:
      "Scheduled servicing before and after the season, so faults are found in port and not at sea.",
  },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-[72px] bg-mist">
      <div className="grid lg:grid-cols-2">
        <div className="px-4 py-14 md:px-6 md:py-24 lg:px-16">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-primary md:text-[13px]">
            About us
          </p>
          <h2 className="mt-4 text-[28px] md:text-[40px]">
            More than 30 years working on yachts in Barcelona
          </h2>
          <p className="mt-6 max-w-[65ch] text-base md:text-[17px]">
            Diplonautic installs, repairs and maintains the technical equipment
            of leisure vessels from its workshop in Sant Adrià de Besòs, a few
            minutes from the city&apos;s marinas.
          </p>

          <ul className="mt-10 border-t border-line">
            {steps.map((step) => (
              <li key={step.name} className="border-b border-line py-5">
                <h3 className="text-xl">{step.name}</h3>
                <p className="mt-2 max-w-[65ch] text-[15px]">
                  {step.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-[4/3] lg:aspect-auto">
          <Image
            src={yachtDock}
            alt="Large white yacht moored alongside a dock"
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { getServices } from "@/lib/data/queries";
import SectionHeading from "@/components/sections/SectionHeading";
import EmptyState from "@/components/sections/EmptyState";
import Reveal from "@/components/motion/Reveal";
import SpotlightCard from "@/components/motion/SpotlightCard";

const Services = async () => {
  const services = await getServices();

  return (
    <section id="services" className="section">
      <div className="max-width">
        <SectionHeading
          eyebrow="What I Do"
          title="Services"
          subtitle="A focused set of services spanning product design and security — offered independently or together."
        />

        {services.length === 0 ? (
          <div className="mt-14">
            <EmptyState message="Services will appear here soon." />
          </div>
        ) : (
          <Reveal
            stagger={0.1}
            className="mx-auto mt-16 grid max-w-[1150px] gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {services.map((service, i) => (
              <SpotlightCard
                key={service._id}
                className="card-grad group flex flex-col gap-4 p-6"
              >
                <span className="flex size-13 items-center justify-center rounded-2xl bg-linear-to-br from-primary-100/20 to-primary-200/10 ring-1 ring-inset ring-white/10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  {service.icon ? (
                    <Image src={service.icon} width={26} height={26} alt="" />
                  ) : (
                    <span className="text-lg text-primary-200">✦</span>
                  )}
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium text-primary-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </SpotlightCard>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default Services;

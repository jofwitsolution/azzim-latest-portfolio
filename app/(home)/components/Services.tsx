import Image from "next/image";
import { getServices } from "@/lib/data/queries";
import SectionHeading from "@/components/sections/SectionHeading";
import EmptyState from "@/components/sections/EmptyState";
import Reveal from "@/components/motion/Reveal";

const Services = async () => {
  const services = await getServices();

  return (
    <section id="services" className="padding-y">
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
            className="mx-auto mt-14 grid max-w-[1100px] gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {services.map((service) => (
              <div
                key={service._id}
                className="glass-card group flex flex-col gap-4 p-6 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent transition-colors group-hover:bg-primary-100/15">
                  {service.icon ? (
                    <Image src={service.icon} width={26} height={26} alt="" />
                  ) : (
                    <span className="text-lg text-primary-200">✦</span>
                  )}
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default Services;

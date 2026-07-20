import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import SpotlightCard from "@/components/motion/SpotlightCard";
import SectionHeading from "@/components/sections/SectionHeading";

const process = [
  {
    step: "Understand the problem",
    points: [
      "Review the PRD and business goals",
      "Identify target users and their pain points",
      "Align with stakeholders through clarifying questions",
    ],
  },
  {
    step: "Research & user insights",
    points: [
      "Run interviews or define personas when data is thin",
      "Map user journeys and key flows",
      "Surface usability gaps and opportunities",
    ],
  },
  {
    step: "Information architecture",
    points: [
      "Create sitemaps and user flows",
      "Define navigation structure and hierarchy",
    ],
  },
  {
    step: "Wireframing",
    points: [
      "Build low-fidelity wireframes in Figma",
      "Focus on layout, flow, and core functionality",
      "Share early for feedback and iteration",
    ],
  },
  {
    step: "High-fidelity UI",
    points: [
      "Apply brand, typography, color, and spacing",
      "Design responsive layouts across breakpoints",
      "Bake in accessibility from the start",
    ],
  },
  {
    step: "Prototyping",
    points: [
      "Create interactive flows that simulate real use",
      "Test internally or with users when time allows",
    ],
  },
  {
    step: "Developer handoff",
    points: [
      "Hand off via Figma inspect & dev mode",
      "Document component specs, states, and edge cases",
      "Collaborate through implementation",
    ],
  },
];

const expertiseCards = [
  {
    icon: "/icons/pad.svg",
    title: "UI/UX Design",
    body: "Intuitive, accessible, delightful experiences built on research. User research, wireframing, prototyping, and design systems that scale.",
  },
  {
    icon: "/icons/security.svg",
    title: "Cybersecurity Analysis",
    body: "Finding vulnerabilities and hardening digital assets. Threat modeling, security assessments, and secure user flows that never compromise experience.",
  },
  {
    icon: "/icons/intersection.svg",
    title: "The Intersection",
    body: "Where it shines: secure-by-design experiences that protect users while delighting them — privacy controls that feel intuitive, not obstructive.",
  },
];

const About = () => {
  return (
    <section id="about" className="section">
      <div className="max-width">
        <SectionHeading
          eyebrow="About Me"
          title="Design meets security"
          subtitle="I bridge beautiful design and robust security, bringing a rare perspective to digital products."
        />

        <div className="mx-auto mt-16 grid max-w-[1150px] items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Narrative */}
          <Reveal direction="right" className="space-y-6 lg:sticky lg:top-28">
            <h3 className="text-2xl font-bold text-foreground">
              My dual expertise
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                As both a UI/UX Designer and Cybersecurity Analyst, I bring a rare
                combination to the table. My journey began in design — crafting
                intuitive, engaging experiences that delight customers and drive
                business goals.
              </p>
              <p>
                Over time I grew a passion for cybersecurity, recognizing that the
                best products aren&apos;t only beautiful and functional but also
                secure. That dual lens lets me design with security from the ground
                up, never as an afterthought.
              </p>
              <p>
                Today I help organizations build products that users love to use —
                and attackers find difficult to exploit.
              </p>
            </div>

            <div className="glass mt-4 space-y-5 p-6 md:p-7">
              <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
                My UI/UX process
                <span className="text-sm font-medium text-muted-foreground">
                  (Figma)
                </span>
              </h4>
              <ol className="space-y-4">
                {process.map((phase, i) => (
                  <li key={phase.step} className="flex gap-4">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-100 to-primary-200 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{phase.step}</p>
                      <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                        {phase.points.map((point) => (
                          <li key={point} className="flex gap-2">
                            <span className="mt-2 inline-block size-1 shrink-0 rounded-full bg-primary-200/70" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          {/* Expertise cards */}
          <Reveal stagger={0.12} direction="left" className="space-y-6">
            {expertiseCards.map((card) => (
              <SpotlightCard
                key={card.title}
                className="card-grad group p-7"
              >
                <div className="flex items-center gap-4">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary-100/20 to-primary-200/10 ring-1 ring-inset ring-white/10 transition-transform duration-300 group-hover:scale-110">
                    <Image src={card.icon} width={26} height={26} alt="" />
                  </span>
                  <h3 className="text-xl font-semibold text-foreground">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
              </SpotlightCard>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;

import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/sections/SectionHeading";

const process = [
  {
    step: "1. Understand the Problem",
    points: [
      "Review the PRD and business goals",
      "Identify target users and their pain points",
      "Ask clarifying questions to align with stakeholders",
    ],
  },
  {
    step: "2. Research & User Insights",
    points: [
      "Conduct user interviews or define personas (if data isn't available)",
      "Map user journeys or key flows",
      "Identify usability gaps or opportunities",
    ],
  },
  {
    step: "3. Information Architecture",
    points: [
      "Create sitemaps and user flows",
      "Define navigation structure and page hierarchy",
    ],
  },
  {
    step: "4. Wireframing",
    points: [
      "Build low-fidelity wireframes in Figma",
      "Focus on layout, user flow, and core functionality",
      "Share for early feedback and iteration",
    ],
  },
  {
    step: "5. High-Fidelity UI Design",
    points: [
      "Apply brand guidelines, typography, color, and spacing",
      "Design responsive layouts for multiple screen sizes",
      "Ensure accessibility (contrast, tap targets, etc.)",
    ],
  },
  {
    step: "6. Prototyping",
    points: [
      "Create interactive flows to simulate real user interaction",
      "Test internally or with users (if time allows)",
    ],
  },
  {
    step: "7. Developer Handoff",
    points: [
      "Use Figma's inspect & dev mode for handoff",
      "Provide documentation: component specs, states, edge cases",
      "Collaborate with developers during implementation",
    ],
  },
];

const expertiseCards = [
  {
    icon: "/icons/pad.svg",
    title: "UI/UX Design",
    body: "Creating intuitive, accessible, and delightful user experiences through research-driven design processes. I specialize in user research, wireframing, prototyping, and creating design systems that scale.",
  },
  {
    icon: "/icons/security.svg",
    title: "Cybersecurity Analysis",
    body: "Identifying vulnerabilities and implementing security measures to protect digital assets. My expertise includes threat modeling, security assessments, and designing secure user flows that don't compromise on experience.",
  },
  {
    icon: "/icons/intersection.svg",
    title: "The Intersection",
    body: "Where my work truly shines is at the intersection of these disciplines. I create secure-by-design experiences that protect users while delighting them, ensuring privacy controls are intuitive and security measures don't impede usability.",
  },
];

const About = () => {
  return (
    <section id="about" className="padding-y">
      <div className="max-width">
        <SectionHeading
          eyebrow="About Me"
          title="Design meets security"
          subtitle="I bridge the gap between beautiful design and robust security, bringing a unique perspective to digital products."
        />

        <div className="mx-auto mt-14 grid max-w-[1100px] items-start gap-12 md:mt-20 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="right" className="max-w-[520px] space-y-6">
            <h3 className="text-xl font-bold text-foreground">
              My Dual Expertise
            </h3>
            <p className="text-muted-foreground">
              As both a UI/UX Designer and Cybersecurity Analyst, I bring a rare
              combination of skills to the table. My journey began in design,
              creating intuitive and engaging user experiences that delight
              customers and drive business goals.
            </p>
            <p className="text-muted-foreground">
              Over time, I developed a passion for cybersecurity, recognizing
              that the best digital products are not only beautiful and
              functional but also secure. This dual perspective allows me to
              create designs that consider security from the ground up, rather
              than as an afterthought.
            </p>
            <p className="text-muted-foreground">
              Today, I help organizations build digital products that users love
              to use and attackers find difficult to exploit.
            </p>

            <div className="space-y-4 pt-2">
              <h3 className="text-xl font-bold text-foreground">
                My UI/UX Design Process{" "}
                <span className="text-muted-foreground text-base font-medium">
                  (Tool — Figma)
                </span>
              </h3>
              <div className="space-y-4">
                {process.map((phase) => (
                  <div key={phase.step}>
                    <p className="font-medium text-foreground">{phase.step}</p>
                    <ul className="ml-6 mt-1 list-disc text-sm text-muted-foreground">
                      {phase.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal
            stagger={0.12}
            direction="left"
            className="w-full space-y-6 justify-self-center lg:max-w-[480px]"
          >
            {expertiseCards.map((card) => (
              <div
                key={card.title}
                className="glass-card group p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-accent transition-colors group-hover:bg-primary-100/15">
                    <Image src={card.icon} width={24} height={24} alt="" />
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {card.title}
                  </span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{card.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;

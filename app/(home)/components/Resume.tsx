import { getResumeCards, getExperiences } from "@/lib/data/queries";
import SectionHeading from "@/components/sections/SectionHeading";
import EmptyState from "@/components/sections/EmptyState";
import ResumeCards from "./ResumeCards";
import Timeline from "@/components/Timeline";

const Resume = async () => {
  const [cards, experiences] = await Promise.all([
    getResumeCards(),
    getExperiences(),
  ]);

  return (
    <section id="resume" className="padding-y">
      <div className="max-width">
        <SectionHeading
          eyebrow="Resume"
          title="Experience & Résumé"
          subtitle="Download my resume for a comprehensive view of my experience and skills in both UI/UX design and cybersecurity."
        />

        <div className="mt-14 md:mt-20">
          {cards.length === 0 ? (
            <EmptyState message="Résumé downloads will be available soon." />
          ) : (
            <ResumeCards cards={cards} />
          )}
        </div>

        <div className="mx-auto mt-16 max-w-[1150px]">
          <h3 className="text-center text-xl font-bold text-foreground">
            Experience &amp; Education
          </h3>
          {experiences.length === 0 ? (
            <div className="mt-10">
              <EmptyState message="Timeline entries will appear here soon." />
            </div>
          ) : (
            <Timeline experiences={experiences} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Resume;

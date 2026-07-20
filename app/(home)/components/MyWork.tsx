import { getProjects } from "@/lib/data/queries";
import SectionHeading from "@/components/sections/SectionHeading";
import EmptyState from "@/components/sections/EmptyState";
import MyWorkGrid from "./MyWorkGrid";

const MyWork = async () => {
  const projects = await getProjects();

  return (
    <section id="portfolio" className="bg-muted/30 padding-y">
      <div className="max-width">
        <SectionHeading
          eyebrow="Case Studies"
          title="My Work"
          subtitle="Selected projects across UI/UX design and cybersecurity — the problem, the approach, and the outcome."
        />

        {projects.length === 0 ? (
          <div className="mt-14">
            <EmptyState message="Case studies are on the way. Check back soon." />
          </div>
        ) : (
          <MyWorkGrid projects={projects} />
        )}
      </div>
    </section>
  );
};

export default MyWork;

import React, { Suspense } from "react";
import HomeHero from "./components/HomeHero";
import About from "./components/About";
import Services from "./components/Services";
import MyWork from "./components/MyWork";
import Portfolio from "./components/Portfolio";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import {
  ServicesSectionSkeleton,
  WorkSectionSkeleton,
  GallerySectionSkeleton,
  ResumeSectionSkeleton,
} from "@/components/skeletons/sections";

// Read straight from the DB in Server Components; render per request so
// dashboard edits reflect immediately (revalidatePath also targets "/").
export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <main className="top-padding">
      <HomeHero />
      <About />
      <Suspense fallback={<ServicesSectionSkeleton />}>
        <Services />
      </Suspense>
      <Suspense fallback={<WorkSectionSkeleton />}>
        <MyWork />
      </Suspense>
      <Suspense fallback={<GallerySectionSkeleton />}>
        <Portfolio />
      </Suspense>
      <Suspense fallback={<ResumeSectionSkeleton />}>
        <Resume />
      </Suspense>
      <Contact />
    </main>
  );
};

export default Page;

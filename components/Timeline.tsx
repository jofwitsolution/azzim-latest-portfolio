"use client";

import { useRef } from "react";
import { Briefcase, GraduationCap } from "lucide-react";
import type { Experience } from "@/types/models";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const Timeline = ({ experiences }: { experiences: Experience[] }) => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = root.current;
      if (!container) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-tl-item]", container);
      const line = container.querySelector<HTMLElement>("[data-tl-line]");

      if (prefersReducedMotion()) {
        gsap.set(items, { autoAlpha: 1, x: 0 });
        if (line) gsap.set(line, { scaleY: 1 });
        return;
      }

      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              end: "bottom 70%",
              scrub: true,
            },
          }
        );
      }

      gsap.set(items, { autoAlpha: 0, x: -20 });
      items.forEach((item) => {
        gsap.to(item, {
          autoAlpha: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
        });
      });
    },
    { scope: root, dependencies: [experiences.length] }
  );

  return (
    <div ref={root} className="relative mt-12 pl-8">
      {/* Track + animated progress line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
      <div
        data-tl-line
        className="absolute left-[7px] top-2 bottom-2 w-px bg-linear-to-b from-primary-100 to-primary-200"
      />

      <div className="space-y-10">
        {experiences.map((item) => {
          const isEducation = item.kind === "education";
          const Icon = isEducation ? GraduationCap : Briefcase;
          return (
            <div key={item._id} data-tl-item className="relative">
              {/* Dot */}
              <span
                className="absolute -left-[33px] top-1 flex size-4 items-center justify-center rounded-full ring-4 ring-background"
                style={{ backgroundColor: item.color || "#4F46E5" }}
              />
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon
                    className="size-4"
                    style={{ color: item.color || "#4F46E5" }}
                  />
                  <h4 className="text-base font-semibold text-foreground">
                    {item.job}
                  </h4>
                  <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {isEducation ? "Education" : "Experience"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.date}
                  {item.jobType ? ` · ${item.jobType}` : ""}
                </span>
              </div>
              {item.company && (
                <p
                  className="mb-2 text-sm font-medium"
                  style={{ color: item.color || "#4F46E5" }}
                >
                  {item.company}
                </p>
              )}
              {item.role && (
                <p className="max-w-3xl text-sm text-muted-foreground">
                  {item.role}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;

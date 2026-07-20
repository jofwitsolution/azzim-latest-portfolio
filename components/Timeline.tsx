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
    <div ref={root} className="relative mt-14 pl-10">
      {/* Track + animated progress line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 rounded-full bg-border/70" />
      <div
        data-tl-line
        className="absolute left-[15px] top-2 bottom-2 w-0.5 rounded-full bg-linear-to-b from-primary-100 via-primary-200 to-primary-600"
      />

      <div className="space-y-8">
        {experiences.map((item) => {
          const isEducation = item.kind === "education";
          const Icon = isEducation ? GraduationCap : Briefcase;
          const color = item.color || "#6366f1";
          return (
            <div key={item._id} data-tl-item className="relative">
              {/* Node */}
              <span
                className="absolute -left-[38px] top-3 flex size-8 items-center justify-center rounded-full ring-4 ring-background"
                style={{
                  backgroundColor: `color-mix(in oklab, ${color} 20%, var(--card))`,
                  boxShadow: `0 0 0 1px ${color}`,
                }}
              >
                <Icon className="size-4" style={{ color }} />
              </span>

              <div className="card-grad group p-6">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-semibold text-foreground">
                      {item.job}
                    </h4>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                      style={{
                        backgroundColor: `color-mix(in oklab, ${color} 15%, transparent)`,
                        color,
                      }}
                    >
                      {isEducation ? "Education" : "Experience"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.date}
                    {item.jobType ? ` · ${item.jobType}` : ""}
                  </span>
                </div>
                {item.company && (
                  <p className="mb-2 text-sm font-medium" style={{ color }}>
                    {item.company}
                  </p>
                )}
                {item.role && (
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {item.role}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;

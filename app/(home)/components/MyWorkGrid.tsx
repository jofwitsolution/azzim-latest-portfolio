"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/models";
import { cn } from "@/lib/utils";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const ALL = "All";

const MyWorkGrid = ({ projects }: { projects: Project[] }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(ALL);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.mainCategory && set.add(p.mainCategory));
    return [ALL, ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(
    () =>
      active === ALL
        ? projects
        : projects.filter((p) => p.mainCategory === active),
    [projects, active]
  );

  // Reveal/re-reveal the visible cards whenever the filter changes.
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-work-card]",
        gridRef.current!
      );
      if (cards.length === 0) return;
      if (prefersReducedMotion()) {
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.08,
        }
      );
    },
    { scope: gridRef, dependencies: [active] }
  );

  return (
    <>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === category
                ? "border-primary-100 bg-primary-100 text-light-100"
                : "border-border bg-transparent text-muted-foreground hover:border-primary-100/50 hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div
        ref={gridRef}
        className="mx-auto mt-12 grid max-w-[1100px] gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((project) => (
          <article
            key={project._id}
            data-work-card
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow"
          >
            <div className="relative h-44 w-full overflow-hidden">
              {project.mainCategory && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-sm">
                  {project.mainCategory}
                </span>
              )}
              {project.image ? (
                <Image
                  src={project.image}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  alt={project.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-linear-to-br from-primary-100/20 to-primary-200/20" />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-4 p-5">
              <h3 className="line-clamp-2 text-lg font-bold text-foreground">
                {project.title}
              </h3>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {project.description}
              </p>

              {project.problem && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-primary-200">
                    Problem
                  </h4>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {project.problem}
                  </p>
                </div>
              )}

              {project.results.length > 0 ? (
                <ul className="space-y-1.5">
                  {project.results.slice(0, 3).map((result, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 inline-block size-2 shrink-0 rounded-full bg-green-500" />
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="inline-flex w-max items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-block size-2 rounded-full bg-yellow-400" />
                  Under development
                </span>
              )}

              {project.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.categories.map((category, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto flex items-center gap-4 pt-2">
                {project.source && (
                  <Link
                    href={project.source}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-100 hover:text-primary-120"
                  >
                    View Project <ArrowUpRight className="size-4" />
                  </Link>
                )}
                {project.behance && (
                  <Link
                    href={project.behance}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-100 hover:text-primary-120"
                  >
                    Case Study <ArrowUpRight className="size-4" />
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default MyWorkGrid;

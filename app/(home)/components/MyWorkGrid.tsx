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
        gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 28, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
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
      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300",
              active === category
                ? "border-transparent bg-linear-to-r from-primary-120 to-primary-100 text-white shadow-lg shadow-primary-100/25"
                : "border-border bg-background/40 text-muted-foreground backdrop-blur-sm hover:border-primary-100/50 hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div
        ref={gridRef}
        className="mx-auto mt-12 grid max-w-[1150px] gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((project) => (
          <article
            key={project._id}
            data-work-card
            className="card-grad group flex flex-col overflow-hidden"
          >
            <div className="relative h-48 w-full overflow-hidden">
              {project.mainCategory && (
                <span className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-background/70 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-md">
                  {project.mainCategory}
                </span>
              )}
              {project.image ? (
                <Image
                  src={project.image}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  alt={project.title}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full bg-linear-to-br from-primary-100/25 to-primary-600/20" />
              )}
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent opacity-70"
              />
            </div>

            <div className="flex flex-1 flex-col gap-4 p-6">
              <h3 className="line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary-100">
                {project.title}
              </h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
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
                      <span className="mt-1.5 inline-block size-2 shrink-0 rounded-full bg-emerald-400" />
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="inline-flex w-max items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-block size-2 rounded-full bg-amber-400" />
                  Under development
                </span>
              )}

              {project.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.categories.map((category, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto flex items-center gap-4 border-t border-border/50 pt-4">
                {project.source && (
                  <Link
                    href={project.source}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary-100 transition-colors hover:text-primary-200"
                  >
                    View Project <ArrowUpRight className="size-4" />
                  </Link>
                )}
                {project.behance && (
                  <Link
                    href={project.behance}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary-100 transition-colors hover:text-primary-200"
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

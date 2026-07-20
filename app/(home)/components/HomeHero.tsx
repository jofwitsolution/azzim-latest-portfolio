"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  MousePointer2,
} from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import SplitReveal from "@/components/motion/SplitReveal";
import Magnetic from "@/components/motion/Magnetic";

const HomeHero = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const fades = gsap.utils.toArray<HTMLElement>(
        "[data-fade]",
        root.current!
      );
      if (prefersReducedMotion()) {
        gsap.set(fades, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.set(fades, { autoAlpha: 0, y: 24 });
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
        .to(fades, { autoAlpha: 1, y: 0, stagger: 0.12 }, 0.3)
        .from(
          "[data-hero-media]",
          { autoAlpha: 0, scale: 0.9, duration: 1.1, ease: "power2.out" },
          0.2
        )
        .from(
          "[data-badge]",
          { autoAlpha: 0, scale: 0.6, y: 10, stagger: 0.15, duration: 0.6 },
          0.7
        );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="home" className="relative overflow-hidden">
      {/* Faint blueprint grid behind the hero */}
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-0 -z-10"
      />

      <div className="max-width grid items-center gap-14 py-20 sm:py-24 lg:grid-cols-12 lg:gap-8 lg:py-28">
        {/* Copy */}
        <div className="lg:col-span-7">
          <div data-fade className="mb-6 inline-flex">
            <span className="eyebrow">
              <Sparkles className="size-3.5 text-primary-200" />
              UI/UX Designer · Cybersecurity Analyst
            </span>
          </div>

          <h1 className="display text-5xl leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
            <SplitReveal
              as="span"
              text="I secure the interfaces"
              trigger="load"
              className="block"
              delay={0.15}
            />
            <SplitReveal
              as="span"
              text="people trust."
              trigger="load"
              className="block"
              delay={0.35}
              wordClassName={(w) =>
                w === "trust." ? "text-gradient" : undefined
              }
            />
          </h1>

          <p
            data-fade
            className="mt-7 max-w-[540px] text-lg leading-relaxed text-muted-foreground"
          >
            I&apos;m{" "}
            <span className="font-medium text-foreground">Azzim Aina</span> —
            blending human-centered design with security engineering to build
            products that are as safe as they are beautiful.
          </p>

          <div data-fade className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic strength={0.4}>
              <Link
                href="#portfolio"
                className="btn-glow inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold text-white"
              >
                View my work
                <ArrowUpRight className="size-4" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.3}>
              <Link
                href="#contact"
                className="inline-flex h-12 items-center rounded-full border border-border bg-background/40 px-7 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary-100/60 hover:text-primary-100"
              >
                Get in touch
              </Link>
            </Magnetic>
          </div>

          <div
            data-fade
            className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground"
          >
            <ShieldCheck className="size-4 text-primary-200" />
            Secure-by-design · Research-driven
          </div>
        </div>

        {/* Portrait */}
        <div className="lg:col-span-5">
          <div
            data-hero-media
            className="relative mx-auto w-full max-w-[440px]"
          >
            {/* Tilted gradient backdrop */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 rotate-[3deg] rounded-3xl bg-linear-to-br from-primary-100/40 to-primary-200/40 blur-sm"
            />
            <div className="glow-border relative flex aspect-square w-full items-center justify-center bg-card">
              <div className="rounded-full bg-linear-to-r from-primary-100 to-primary-200 p-1">
                <Image
                  src="/images/azzim.png"
                  width={312}
                  height={312}
                  alt="Azzim Aina"
                  className="rounded-full"
                  priority
                />
              </div>
            </div>

            {/* Floating glass badges */}
            <div
              data-badge
              className="glass animate-float absolute -left-4 top-10 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium sm:-left-8"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary-100/15 text-primary-100">
                ✎
              </span>
              UI/UX Design
            </div>
            <div
              data-badge
              className="glass animate-float absolute -right-3 bottom-16 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium sm:-right-8"
              style={{ animationDelay: "1.5s" }}
            >
              <ShieldCheck className="size-5 text-primary-200" />
              Security
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="flex justify-center pb-10">
        <Link
          href="#about"
          className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <MousePointer2 className="size-4 animate-bounce text-primary-200" />
          Scroll to explore
        </Link>
      </div>
    </section>
  );
};

export default HomeHero;

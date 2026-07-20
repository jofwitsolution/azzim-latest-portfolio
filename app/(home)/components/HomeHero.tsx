"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ShieldCheck, Sparkles } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const HomeHero = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-hero]", root.current!);
      if (prefersReducedMotion()) {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.set(targets, { autoAlpha: 0, y: 28 });
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
        .to(targets, { autoAlpha: 1, y: 0, stagger: 0.12 })
        .from(
          "[data-hero-media]",
          { autoAlpha: 0, scale: 0.94, duration: 1, ease: "power2.out" },
          0.15
        );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="home"
      className="relative overflow-hidden"
    >
      {/* Ambient glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-primary-100/25 blur-[120px]" />
        <div className="absolute -bottom-24 right-1/5 h-72 w-72 rounded-full bg-primary-200/20 blur-[120px]" />
      </div>

      <div className="max-width py-16 sm:py-20 lg:py-28">
        <div className="flex flex-col items-center justify-center gap-y-12 gap-x-16 lg:flex-row xl:gap-x-24">
          <header className="max-w-xl space-y-6">
            <span
              data-hero
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              <Sparkles className="size-3.5 text-primary-200" />
              Available for select projects
            </span>

            <h1
              data-hero
              className="text-4xl font-bold leading-[1.1] sm:text-5xl"
            >
              <span className="block text-foreground">Hi, I&apos;m Azzim Aina</span>
              <span className="gradient-text">UI/UX Designer &</span>
              <span className="block text-foreground">Cybersecurity Analyst</span>
            </h1>

            <p data-hero className="max-w-[480px] text-muted-foreground">
              Creating beautiful digital experiences while ensuring they remain
              secure. The perfect blend of creativity and technical security
              expertise.
            </p>

            <div data-hero className="flex flex-wrap gap-4">
              <Link href="#portfolio">
                <Button className="h-11 min-w-[150px] bg-primary-100 text-light-100 shadow-lg shadow-primary-100/25 transition-transform hover:-translate-y-0.5 hover:bg-primary-120">
                  View My Work
                </Button>
              </Link>
              <Link href="#contact">
                <Button
                  variant="outline"
                  className="h-11 min-w-[150px] border-primary-100/60 bg-transparent text-primary-100 transition-transform hover:-translate-y-0.5 hover:bg-primary-100/10"
                >
                  Contact Me
                </Button>
              </Link>
            </div>

            <div
              data-hero
              className="flex items-center gap-2 pt-2 text-xs text-muted-foreground"
            >
              <ShieldCheck className="size-4 text-primary-200" />
              Secure-by-design · Research-driven
            </div>
          </header>

          <div data-hero-media className="w-full max-w-[480px]">
            <div className="relative w-full">
              <div className="absolute inset-0 rotate-[3deg] rounded-3xl bg-linear-to-br from-primary-100/40 to-primary-200/40 blur-sm" />
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
            </div>
          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="#about"
            className="group flex flex-col items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Learn More</span>
            <ArrowDown className="size-4 animate-bounce text-primary-200" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;

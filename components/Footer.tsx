import { navbarLinks } from "@/lib/data/nav-links";
import { getServices } from "@/lib/data/queries";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import React from "react";

const Footer = async () => {
  // Footer renders in the root layout on every route (including static ones),
  // so guard the DB read — a failure should degrade to no services, never break
  // the page build/render.
  let services: Awaited<ReturnType<typeof getServices>> = [];
  try {
    services = await getServices();
  } catch {
    services = [];
  }

  const socials = [
    {
      href: "https://www.linkedin.com/in/azzim-aina-uxdesigner",
      icon: "/icons/linkedin-light.svg",
      label: "LinkedIn",
    },
    { href: "https://x.com/azzimeme", icon: "/icons/twitter-light.svg", label: "X" },
    {
      href: "https://www.behance.net/azzimaina",
      icon: "/icons/behance.svg",
      label: "Behance",
      invert: true,
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-border bg-muted/20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-primary-100/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-primary-100/10 blur-[100px]"
      />

      <div className="max-width relative py-16">
        {/* CTA */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 border-b border-border/60 pb-12 md:flex-row md:items-center">
          <div>
            <h3 className="display text-2xl text-foreground md:text-3xl">
              Let&apos;s build something{" "}
              <span className="text-gradient">secure & beautiful</span>.
            </h3>
            <p className="mt-2 text-muted-foreground">
              Available for select design and security engagements.
            </p>
          </div>
          <Link
            href="/#contact"
            className="btn-glow inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold text-white"
          >
            Start a conversation
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Image
              src="/icons/site-logo.svg"
              width={120}
              height={22}
              alt="azzim-aina"
              className="dark:brightness-0 dark:invert"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              UI/UX Designer &amp; Cybersecurity Analyst — crafting products that
              are as safe as they are beautiful.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h5 className="mb-4 text-sm font-semibold text-foreground">
                Quick Links
              </h5>
              <div className="flex flex-col gap-2.5">
                {navbarLinks.slice(0, 5).map((item) => (
                  <Link
                    href={item.route}
                    key={item.label}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {services.length > 0 && (
              <div>
                <h5 className="mb-4 text-sm font-semibold text-foreground">
                  Services
                </h5>
                <div className="flex flex-col gap-2.5">
                  {services.map((item) => (
                    <span
                      key={item._id}
                      className="text-sm text-muted-foreground"
                    >
                      {item.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-6 border-t border-border/60 pt-8 md:flex-row">
          <p className="text-xs font-medium text-muted-foreground">
            © {new Date().getFullYear()} Azzim Aina. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex size-10 items-center justify-center rounded-full border border-border bg-background/40 transition-colors hover:border-primary-100/60 hover:bg-primary-100/10"
              >
                <Image
                  src={s.icon}
                  width={18}
                  height={18}
                  alt=""
                  className={s.invert ? "invert-48" : "dark:brightness-0 dark:invert"}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

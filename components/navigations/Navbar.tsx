"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import { ThemeToggle } from "@/components/theme-toggle";
import Magnetic from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

/** Primary sections tracked for the active-link indicator on the home page. */
const primaryLinks = [
  { label: "Home", href: "/#home", section: "home" },
  { label: "About", href: "/#about", section: "about" },
  { label: "Work", href: "/#portfolio", section: "portfolio" },
  { label: "Gallery", href: "/#gallery", section: "gallery" },
  { label: "Résumé", href: "/#resume", section: "resume" },
] as const;

const pageLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Certs", href: "/certifications" },
] as const;

const Navbar = () => {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");

  // Shrink / add glass surface once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track the section in view (home page only) for the active indicator.
  useEffect(() => {
    if (!onHome) return;
    const ids = primaryLinks.map((l) => l.section);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3">
      <nav
        className={cn(
          "flex w-full max-w-[1200px] items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-500 md:px-5",
          scrolled
            ? "border border-white/10 bg-background/70 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        )}
      >
        <Link href="/" scroll={false} className="group flex items-center">
          <Image
            src="/icons/site-logo.png"
            width={111}
            height={20}
            alt="Azzim Aina"
            priority
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-muted/30 p-1 backdrop-blur-md lg:flex">
          {primaryLinks.map((link) => {
            const isActive = onHome && active === link.section;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 -z-10 rounded-full bg-linear-to-r from-primary-100/25 to-primary-200/25 ring-1 ring-inset ring-primary-100/40" />
                )}
                {link.label}
              </Link>
            );
          })}
          {pageLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                pathname.startsWith(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Magnetic className="hidden sm:inline-block" strength={0.4}>
            <Link
              href="/#contact"
              className="btn-glow inline-flex h-9 items-center rounded-full px-5 text-sm font-semibold text-white"
            >
              Let&apos;s talk
            </Link>
          </Magnetic>
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

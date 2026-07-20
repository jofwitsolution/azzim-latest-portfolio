import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Calendar, Award, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getCertifications } from "@/lib/data/queries";
import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import EmptyState from "@/components/sections/EmptyState";

export const metadata: Metadata = {
  title: "Certifications | Azzim Aina",
  description: "The official portfolio of Azzim Aina",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  keywords: ["azzim aina", "azzim", "azzim aina portfolio", "azzim aina resume"],
  openGraph: {
    title: "Azzim Aina | Portfolio",
    description: "The official portfolio of Azzim Aina",
    url: "https://portfolio.azzimaina.com",
    siteName: "Azzim Aina | Portfolio",
  },
};

export const dynamic = "force-dynamic";

const Page = async () => {
  const certifications = await getCertifications();

  return (
    <main className="top-padding">
      <div className="relative overflow-hidden py-20 md:py-24">
        <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 -z-10" />
        <div className="max-width relative flex flex-col gap-5">
          <Reveal>
            <span className="eyebrow">
              <Award className="size-3.5 text-primary-200" />
              Credentials
            </span>
          </Reveal>
          <SplitReveal
            as="h1"
            text="My Professional Certifications"
            trigger="load"
            className="display max-w-3xl text-4xl leading-[1.05] text-foreground md:text-5xl lg:text-6xl"
          />
          <Reveal delay={0.15}>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Showcasing my expertise and commitment to industry standards through
              recognized certifications and credentials.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-width pb-20">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            My Credentials
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            These certifications represent my ongoing commitment to excellence
            and professional development in various technical domains. You can
            access my badges on credly at:{" "}
            <Link
              href="https://www.credly.com/users/azzim-aina"
              target="_blank"
              className="text-primary-100 hover:text-primary-120"
            >
              credly.com/users/azzim-aina
            </Link>
          </p>
        </div>

        {certifications.length === 0 ? (
          <div className="mt-10">
            <EmptyState message="Certifications will be listed here soon." />
          </div>
        ) : (
          <Reveal
            stagger={0.08}
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {certifications.map((certification) => (
              <div
                key={certification._id}
                className="card-grad group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {certification.image ? (
                    <Image
                      src={certification.image}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      alt={certification.title}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-primary-100/25 to-primary-600/20" />
                  )}
                  <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-background/80 px-2.5 py-1 text-[11px] font-medium backdrop-blur-md">
                    {certification.type}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent">
                      <Award className="size-5 text-primary-100" />
                    </span>
                    <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                      {certification.title}
                    </h3>
                  </div>

                  {certification.issuer && (
                    <p className="text-sm text-muted-foreground">
                      Issued by {certification.issuer}
                    </p>
                  )}

                  <div className="mt-auto space-y-2 pt-2">
                    {certification.date && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={14} />
                        <span>Issued: {certification.date}</span>
                      </div>
                    )}
                    {certification.validUntil && (
                      <div className="flex items-center gap-2 text-xs text-green-500">
                        <Calendar size={14} />
                        <span>Valid until {certification.validUntil}</span>
                      </div>
                    )}
                    <div className="border-b border-border" />
                    <div className="flex items-center justify-between">
                      {certification.source && (
                        <Link
                          href={certification.source}
                          target="_blank"
                          className="text-xs font-medium text-primary-100 hover:text-primary-120"
                        >
                          View credential
                        </Link>
                      )}
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <CheckCircle2 className="size-4" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </main>
  );
};

export default Page;

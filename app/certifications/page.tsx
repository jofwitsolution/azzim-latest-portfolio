import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Calendar, Award, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getCertifications } from "@/lib/data/queries";
import Reveal from "@/components/motion/Reveal";
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
      <div className="relative overflow-hidden bg-linear-to-r from-primary-120 to-primary-100 py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-200/40 blur-[100px]"
        />
        <div className="max-width relative flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-light-100 md:text-4xl">
            My Professional Certifications
          </h1>
          <p className="max-w-2xl text-light-100/90">
            Showcasing my expertise and commitment to industry standards through
            recognized certifications and credentials.
          </p>
        </div>
      </div>

      <div className="max-width py-12">
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
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {certification.image ? (
                    <Image
                      src={certification.image}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      alt={certification.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-primary-100/20 to-primary-200/20" />
                  )}
                  <span className="absolute right-3 top-3 rounded-md bg-background/90 px-2 py-1 text-[11px] font-medium backdrop-blur-sm">
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

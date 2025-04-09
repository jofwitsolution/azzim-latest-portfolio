import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { certifications } from "@/lib/data/mock";
import { Calendar } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Certifications | Azzim Aina",
  description: "The official portfolio of Azzim Aina",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  keywords: [
    "azzim aina",
    "azzim",
    "azzim aina portfolio",
    "azzim aina resume",
  ],
  openGraph: {
    title: "Azzim Aina | Portfolio",
    description: "The official portfolio of Azzim Aina",
    url: "https://portfolio.azzimaina.com",
    siteName: "Azzim Aina | Portfolio",
  },
};

const Page = () => {
  return (
    <main className="top-padding">
      <div className="bg-linear-to-r from-[#2563EB] to-[#4338CA] py-10">
        <div className="max-width flex flex-col gap-4">
          <h1 className="font-bold text-light-100 text-[24px] md:text-[30.6px] md:leading-[37px]">
            My Professional Certifications
          </h1>

          <p className="max-w-[768px] mt-1 md:mt-4 text-light-100">
            Showcasing my expertise and commitment to industry standards through
            recognized certifications and credentials.
          </p>
        </div>
      </div>

      <div className="max-width py-10">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-[#1F2937] text-[20.4px] leading-[27px]">
            My Credentials
          </h2>

          <p className="max-w-[768px]">
            These certifications represent my ongoing commitment to excellence
            and professional development in various technical domains. You can
            access my badges on credly at:{" "}
            <Link
              href={"https://www.credly.com/users/azzim-aina"}
              target="_blank"
              className="text-primary-120"
            >
              credly.com/users/azzim-aina
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {certifications.map((certification) => (
            <div
              key={certification.title}
              className="relative w-full rounded-md overflow-hidden shadow-md"
            >
              <Image
                src={certification.image}
                width={432}
                height={192}
                alt="aws"
                className="w-full"
              />
              <span className="absolute z-[10] top-3 right-3 bg-light-100 rounded-md py-1 px-2 text-[11.9px]">
                {certification.type}
              </span>

              <div className="px-2 py-4 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="w-9 h-9 bg-[#DBEAFE] flex items-center justify-center rounded-full">
                    <Image
                      src={"/icons/award.svg"}
                      width={20}
                      height={20}
                      alt="award"
                    />
                  </span>
                  <h3 className="font-semibold text-[13px] sm:text-[15.3px] line-clamp-2">
                    {certification.title}
                  </h3>
                </div>
                <div className="mt-3 space-y-4">
                  <p className="text-[13.6px]">
                    Issued by {certification.issuer}
                  </p>
                  <div className="flex gap-2 items-center">
                    <Calendar className="" size={14} />
                    <span className="text-[11.9px]">
                      Issued: {certification.date}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Calendar className="" size={14} />
                    <span className="text-[11.9px] text-green-400">
                      Valid until {certification.validUntil}
                    </span>
                  </div>
                  <div className="border-b border-[#F3F4F6] w-full" />
                  <div className="flex items-center justify-between">
                    <Link
                      href={certification.source}
                      target="_blank"
                      className="text-primary-120 text-[11.9px]"
                    >
                      View
                    </Link>
                    <span className="flex items-center gap-1 text-green-400 text-[11.9px]">
                      {" "}
                      <Image
                        src={"/icons/active.svg"}
                        width={16}
                        height={16}
                        alt="active"
                      />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;

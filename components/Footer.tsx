import { services } from "@/lib/data/mock";
import { navbarLinks } from "@/lib/data/nav-links";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#111827] padding-y">
      <div className="max-width">
        <div className="flex flex-col md:flex-row gap-10 md:gap-6 justify-between md:items-center">
          <div>
            <Image
              src={"/icons/site-logo.svg"}
              width={111}
              height={20}
              alt="azzim-aina"
            />
            <p className="text-[13.6px] mt-4">
              UI/UX Designer & Cybersecurity Analyst
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <h5 className="mb-4 text-light-100 text-[15.3px] font-semibold">
                Quick Links
              </h5>
              <div className="flex flex-col gap-2">
                {navbarLinks.slice(0, 5).map((item) => (
                  <Link href={item.route} key={item.label}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h5 className="mb-4 text-light-100 text-[15.3px] font-semibold">
                Services
              </h5>
              <div className="flex flex-col gap-2">
                {services.map((item) => (
                  <Link href={item.title} key={item.title}>
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="border-b border-[#1F2937] my-8"></div>
          <div className="flex flex-col md:flex-row max-md:flex-col-reverse gap-6 md:gap-0 justify-between items-center">
            <p className="text-[11.9px] font-semibold">
              © 2024 Azzim Aina. All rights reserved.
            </p>
            <div className="flex gap-6 items-center">
              <Link href={"https://linkedin.com"}>
                <Image
                  src={"/icons/linkedin-light.svg"}
                  width={18}
                  height={18}
                  alt="linkedin"
                />
              </Link>
              <Link href={"https://twitter.com"}>
                <Image
                  src={"/icons/twitter-light.svg"}
                  width={18}
                  height={18}
                  alt="twitter"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

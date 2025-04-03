import { projects } from "@/lib/data/mock";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Portfolio = () => {
  return (
    <section id="portfolio" className="bg-light-220 padding-y">
      <div className="max-width">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-center font-bold text-black text-[24px] md:text-[30.6px] md:leading-[37px]">
            My Portfolio
          </h2>
          <div className="w-[96px] h-[4px] bg-linear-to-r from-primary-100 to-primary-200" />
          <p className="max-w-[768px] text-center mt-1 md:mt-4">
            Explore my work across UI/UX design and cybersecurity projects.
          </p>
          <h3 className="mt-6 text-center text-black">All Projects</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 place-items-center max-w-[1100px] mx-auto gap-x-4 gap-y-8 mt-12 md:mt-20">
          {projects.map((project) => (
            <div
              key={project.title}
              className="max-w-[309.33px] bg-light-100 shadow-lg rounded-[12px] overflow-hidden"
            >
              <Image
                src={project.image}
                width={310}
                height={224}
                alt={project.title}
              />

              <div className="px-3 py-4 min-h-[220px] md:min-h-[260px] justify-between flex flex-col">
                <div>
                  <div className="flex justify-between gap-2">
                    <h4 className="max-w-[150px] text-[#1F2937] font-semibold line-clamp-2">
                      {project.title}
                    </h4>
                    <div
                      className={cn(
                        "flex items-center justify-center w-max h-max p-2 rounded-sm"
                      )}
                      style={{ backgroundColor: project.category_bg }}
                    >
                      <span className="line-clamp-2 text-primary-300 text-[10px]">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-[13.6px] mt-4">{project.description}</p>
                </div>

                <div className="">
                  <Link
                    href={project.source}
                    target="_blank"
                    className="flex gap-4 items-center"
                  >
                    <span className="text-[13.6px] text-primary-100">
                      View Project
                    </span>
                    <Image
                      src={"/icons/open-link.svg"}
                      width={16}
                      height={16}
                      alt="open-link"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

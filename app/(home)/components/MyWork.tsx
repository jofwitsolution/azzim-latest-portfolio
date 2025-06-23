import { myWork } from "@/lib/data/mock";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const MyWork = () => {
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
          {myWork.map((project) => (
            <div
              key={project.title}
              className="max-w-[338px] bg-light-100 shadow-lg rounded-[12px] overflow-hidden"
            >
              <div className="w-full h-[151px] relative">
                <div
                  className={cn(
                    "absolute z-10 inset-1.5 flex items-center justify-center w-max h-max p-2 rounded-sm"
                  )}
                  style={{ backgroundColor: project.category_bg }}
                >
                  <span className="line-clamp-2 text-primary-300 text-[10px]">
                    {project.mainCategory}
                  </span>
                </div>
                <Image
                  src={project.image}
                  width={310}
                  height={224}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-t-[12px] absolute"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={project.image}
                  quality={100}
                />
              </div>

              <div className="px-3 py-4 min-h-[450px] md:min-h-[590px] justify-between gap-4 flex flex-col">
                <div>
                  <div className="flex justify-between gap-2">
                    <h4 className="text-[#1F2937] font-bold line-clamp-2">
                      {project.title}
                    </h4>
                  </div>

                  <p className="text-[13.6px] mt-4">{project.description}</p>

                  <h5 className="mt-2 font-semibold">Problem</h5>
                  <p className="text-[13.6px] mt-1">{project.problem}</p>

                  <h5 className="mt-2 font-semibold">Solution</h5>
                  <p className="text-[13.6px] mt-1">{project.solution}</p>

                  <h5 className="mt-2 font-semibold">Outcome</h5>
                  <ul className="text-[13.6px] mt-1 list-none">
                    {project.results.length === 0 && (
                      <li className="flex items-center gap-2 mb-1">
                        <span className="inline-block size-2.5 rounded-full bg-red-500" />
                        <span>Still in progress</span>
                      </li>
                    )}
                    {project.results.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 mb-1">
                        <span className="inline-block size-2.5 rounded-full bg-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.categories.map((category, index) => (
                      <span
                        key={index}
                        className="text-[10px] bg-slate-300 text-primary-100 px-2 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
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

export default MyWork;

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import Timeline from "@/components/Timeline";
import TooltipWrapper from "@/components/TooltipWrapper";

const Resume = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handlePreview = (url: string) => {
    setPdfUrl(url);
    setIsPreviewOpen(true);
  };

  const handleDownload = (url: string, name: string) => {
    saveAs(url, name);
  };
  return (
    <section id="resume" className="padding-y">
      <div className="max-width">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-center font-bold text-black text-[24px] md:text-[30.6px] md:leading-[37px]">
            Resume
          </h2>
          <div className="w-[96px] h-[4px] bg-linear-to-r from-primary-100 to-primary-200" />
          <p className="max-w-[600px] text-center mt-1 md:mt-4">
            Download my resume for a comprehensive view of my experience and
            skills in both UI/UX design and cybersecurity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 max-w-[1100px] mx-auto gap-x-8 gap-y-8 mt-12 md:mt-20">
          <div className="bg-light-200 md:w-full flex flex-col items-center shadow gap-6 px-6 py-8 md:px-8 md:py-10 rounded-xl">
            <div className="h-[80px] w-[80px] rounded-full flex items-center justify-center bg-light-230">
              <Image src={"/icons/bag.svg"} width={40} height={40} alt="uiux" />
            </div>

            <TooltipWrapper message="Click to preview the CV">
              <h3
                onClick={() => handlePreview("/docs/azzim-aina-uiux-cv.pdf")}
                className="font-bold text-[20.4px] text-center"
              >
                UI/UX Design Resume
              </h3>
            </TooltipWrapper>

            <p className="text-[13.6px] text-center max-w-[320px]">
              A comprehensive overview of my design experience, process, and
              skills. Includes case studies and measurable results from previous
              projects.
            </p>

            <Button
              onClick={() =>
                handleDownload(
                  "/docs/azzim-aina-uiux-cv.pdf",
                  "azzim-aina-uiux-cv"
                )
              }
              className="w-[120px] h-[40px] md:w-[151px] md:h-[50px] bg-primary-100 text-light-100 hover:bg-primary-120 cursor-pointer"
            >
              <Image
                src={"/icons/download.svg"}
                width={20}
                height={20}
                alt="download"
                className="max-md:hidden"
              />
              <span className="text-[13.6px]">Download CV</span>
            </Button>
          </div>
          <div className="bg-light-200 md:w-full flex flex-col items-center shadow gap-6 px-6 py-8 md:px-8 md:py-10 rounded-xl">
            <div className="h-[80px] w-[80px] rounded-full flex items-center justify-center bg-primary-240">
              <Image
                src={"/icons/security.svg"}
                width={40}
                height={40}
                alt="security"
              />
            </div>

            <TooltipWrapper message="Click to preview the CV">
              <h3
                onClick={() => handlePreview("/docs/azzim-aina-cyber-cv.pdf")}
                className="font-bold text-[20.4px] text-center"
              >
                Cybersecurity Resume
              </h3>
            </TooltipWrapper>

            <p className="text-[13.6px] text-center max-w-[320px]">
              Detailing my technical expertise in cybersecurity, including
              certifications, security assessments, and threat mitigation
              strategies.
            </p>

            <Button
              onClick={() =>
                handleDownload(
                  "/docs/azzim-aina-cyber-cv.pdf",
                  "azzim-aina-cyber-cv"
                )
              }
              className="w-[120px] h-[40px] md:w-[151px] md:h-[50px] bg-primary-220 text-light-100 hover:bg-primary-200 cursor-pointer"
            >
              <Image
                src={"/icons/download.svg"}
                width={20}
                height={20}
                alt="download"
                className="max-md:hidden"
              />
              <span className="text-[13.6px]">Download CV</span>
            </Button>
          </div>
        </div>

        <div className="mt-10 md:mt-16 max-w-[1150px] mx-auto">
          <h3 className="text-center font-bold text-[20.4px]">
            Experience & Education
          </h3>

          <Timeline />
        </div>

        {isPreviewOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg w-full overflow-auto">
              <iframe
                src={pdfUrl}
                className="w-full h-[90vh]"
                title="PDF Preview"
              />
              <div className="flex w-full justify-end">
                <Button
                  className="mt-4 bg-red-500 hover:bg-red-400 text-white cursor-pointer"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Resume;

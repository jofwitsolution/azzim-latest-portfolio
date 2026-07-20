"use client";

import { useState } from "react";
import Image from "next/image";
import { saveAs } from "file-saver";
import { Download, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TooltipWrapper from "@/components/TooltipWrapper";
import Reveal from "@/components/motion/Reveal";
import type { ResumeCard } from "@/types/models";
import { slugify } from "@/lib/slugify";

const ResumeCards = ({ cards }: { cards: ResumeCard[] }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleDownload = (url: string, name: string) => saveAs(url, name);

  return (
    <>
      <Reveal
        stagger={0.12}
        className="mx-auto grid max-w-[1100px] gap-6 md:grid-cols-2"
      >
        {cards.map((card) => (
          <div
            key={card._id}
            className="card-grad group flex flex-col items-center gap-5 p-8 text-center"
          >
            <div
              className="flex size-20 items-center justify-center rounded-2xl ring-1 ring-inset ring-white/10 transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundColor: card.accent
                  ? `color-mix(in oklab, ${card.accent} 18%, transparent)`
                  : "color-mix(in oklab, var(--color-primary-100) 16%, transparent)",
              }}
            >
              {card.icon ? (
                <Image src={card.icon} width={40} height={40} alt="" />
              ) : (
                <FileText className="size-9 text-primary-100" />
              )}
            </div>

            {card.pdfUrl ? (
              <TooltipWrapper message="Click to preview the CV">
                <h3
                  onClick={() => setPreview(card.pdfUrl)}
                  className="cursor-pointer text-xl font-bold text-foreground hover:text-primary-100"
                >
                  {card.title}
                </h3>
              </TooltipWrapper>
            ) : (
              <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
            )}

            <p className="max-w-[340px] text-sm text-muted-foreground">
              {card.description}
            </p>

            {card.pdfUrl && (
              <Button
                onClick={() =>
                  handleDownload(card.pdfUrl, `${slugify(card.title)}.pdf`)
                }
                className="h-11 min-w-[150px] text-light-100"
                style={{ backgroundColor: card.accent || undefined }}
              >
                <Download className="size-4" />
                <span>Download CV</span>
              </Button>
            )}
          </div>
        ))}
      </Reveal>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div
            className="flex w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-medium text-foreground">
                Resume preview
              </span>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close preview"
              >
                <X className="size-5" />
              </button>
            </div>
            <iframe
              src={preview}
              className="h-[80vh] w-full"
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ResumeCards;

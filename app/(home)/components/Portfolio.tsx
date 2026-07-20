import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPortfolioItems } from "@/lib/data/queries";
import SectionHeading from "@/components/sections/SectionHeading";
import EmptyState from "@/components/sections/EmptyState";
import Reveal from "@/components/motion/Reveal";

const Portfolio = async () => {
  const items = await getPortfolioItems();

  return (
    <section id="gallery" className="section">
      <div className="max-width">
        <SectionHeading
          eyebrow="Gallery"
          title="Selected Portfolio"
          subtitle="A snapshot of shipped products and design explorations."
        />

        {items.length === 0 ? (
          <div className="mt-14">
            <EmptyState message="Portfolio pieces will show up here soon." />
          </div>
        ) : (
          <Reveal
            stagger={0.08}
            className="mx-auto mt-16 grid max-w-[1150px] auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3"
          >
            {items.map((item, index) => {
              const hasLink = Boolean(item.source && item.source !== "#");
              // Rhythm: every 5th tile spans two rows for a creative layout.
              const tall = index % 5 === 0;
              const tileClass = `group relative block overflow-hidden rounded-3xl border border-border bg-card ${
                tall ? "row-span-2" : ""
              }`;
              const inner = (
                <>
                  {item.image ? (
                    <Image
                      src={item.image}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      alt={item.title}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-primary-100/25 to-primary-600/20" />
                  )}

                  {/* Persistent bottom gradient for legibility */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div className="absolute inset-0 flex translate-y-2 flex-col justify-end p-4 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.category && (
                      <span className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-primary-240">
                        {item.category}
                      </span>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="line-clamp-2 font-semibold text-white">
                        {item.title}
                      </h3>
                      {hasLink && (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-colors group-hover:bg-primary-100">
                          <ArrowUpRight className="size-4 text-white" />
                        </span>
                      )}
                    </div>
                  </div>
                </>
              );

              return hasLink ? (
                <Link
                  key={item._id}
                  href={item.source}
                  target="_blank"
                  rel="noreferrer"
                  className={tileClass}
                >
                  {inner}
                </Link>
              ) : (
                <div key={item._id} className={tileClass}>
                  {inner}
                </div>
              );
            })}
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default Portfolio;

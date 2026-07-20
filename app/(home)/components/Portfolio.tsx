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
    <section id="gallery" className="padding-y">
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
            className="mx-auto mt-14 grid max-w-[1100px] auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3"
          >
            {items.map((item, index) => {
              const hasLink = Boolean(item.source && item.source !== "#");
              // Give a little rhythm: every 5th tile spans two rows.
              const tall = index % 5 === 0;
              const tileClass = `group relative block overflow-hidden rounded-2xl border border-border bg-card ${
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
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-primary-100/20 to-primary-200/20" />
                  )}

                  <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {item.category && (
                      <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-primary-240">
                        {item.category}
                      </span>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="line-clamp-2 font-semibold text-light-100">
                        {item.title}
                      </h3>
                      {hasLink && (
                        <ArrowUpRight className="size-5 shrink-0 text-light-100" />
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

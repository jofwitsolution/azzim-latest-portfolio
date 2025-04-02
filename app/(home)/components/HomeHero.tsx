import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const HomeHero = () => {
  return (
    <section id="home" className="bg-light-220">
      <div className="max-width py-10 sm:py-16 md:py-20 lg:py-30">
        <div className="flex flex-col items-center lg:flex-row gap-y-10 gap-x-16 xl:gap-x-30 justify-center">
          <header className="space-y-6">
            <h1 className="flex flex-col max-[403px]:text-[32px] max-[403px]:leading-[41px] max-[501px]:text-[40px] max-[501px]:leading-[49px] text-[51px] leading-[60px] font-bold">
              <span className="text-black">Hi, I'm Azzim Aina</span>
              <span className="text-primary-120">UI/UX Designer &</span>
              <span className="text-primary-300">Cybersecurity</span>
              <span className="text-primary-200">Analyst</span>
            </h1>
            <p className="max-w-[460px]">
              Creating beautiful digital experiences while ensuring they remain
              secure. The perfect blend of creativity and technical security
              expertise.
            </p>
            <div className="flex gap-8">
              <Link href={"#portfolio"}>
                <Button className="w-[120px] h-[40px] md:w-[151px] md:h-[50px] bg-primary-100 text-light-100 hover:bg-primary-120 cursor-pointer">
                  View My Work
                </Button>
              </Link>
              <Link href={"#contact"}>
                <Button className="w-[120px] h-[40px] md:w-[151px] md:h-[50px] border border-primary-100 text-primary-100 bg-transparent hover:bg-transparent cursor-pointer">
                  Contact Me
                </Button>
              </Link>
            </div>
          </header>
          <div className="max-sm:w-full">
            <div className="relative w-full">
              <div className="bg-linear-to-r from-light-230 to-primary-200 max-sm:w-full max-sm:h-[360px] w-[480px] h-[432px] rounded-2xl rotate-[2.3deg]"></div>
              <div className="absolute top-0 flex items-center justify-center bg-light-100 max-sm:w-full max-sm:h-[360px] w-[480px] h-[432px] rounded-2xl">
                <div className="bg-linear-to-r from-primary-100 to-primary-200 p-1 rounded-full">
                  <Image
                    src={"/images/azzim-hero.png"}
                    width={312}
                    height={312}
                    alt="azzim-hero"
                    className=""
                    // sizes="(max-width: 400px) 70vw,"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-10 md:mt-20">
          <Link href={"#about"} className="flex flex-col items-center">
            <span>Learn More</span>
            <Image src={"/icons/down.svg"} width={12} height={6} alt="down" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;

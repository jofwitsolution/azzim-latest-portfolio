import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <section id="about" className="padding-y">
      <div className="max-width">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-center font-bold text-black text-[24px] md:text-[30.6px] md:leading-[37px]">
            About Me
          </h2>
          <div className="w-[96px] h-[4px] bg-linear-to-r from-primary-100 to-primary-200" />
          <p className="max-w-[768px] text-center mt-1 md:mt-4">
            I bridge the gap between beautiful design and robust security,
            bringing a unique perspective to digital products.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 items-center max-w-[1100px] gap-12 md:gap-20 mx-auto mt-12 md:mt-20">
          <div className="space-y-6 max-w-[472px] justify-self-center">
            <h3 className="text-[#1F2937] font-bold text-[20.4px]">
              My Dual Expertise
            </h3>
            <p>
              As both a UI/UX Designer and Cybersecurity Analyst, I bring a rare
              combination of skills to the table. My journey began in design,
              creating intuitive and engaging user experiences that delight
              customers and drive business goals.
            </p>
            <p>
              Over time, I developed a passion for cybersecurity, recognizing
              that the best digital products are not only beautiful and
              functional but also secure. This dual perspective allows me to
              create designs that consider security from the ground up, rather
              than as an afterthought.
            </p>
            <p>
              Today, I help organizations build digital products that users love
              to use and attackers find difficult to exploit. This unique
              combination has proven valuable in an era where both user
              experience and security are paramount concerns.
            </p>
          </div>
          <div className="w-full md:w-[472px] justify-self-center space-y-8">
            <Card className="w-full bg-light-200 !shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-6">
                  <span className="flex items-center justify-center h-12 w-12 rounded-sm bg-light-230">
                    <Image
                      src={"/icons/pad.svg"}
                      width={24}
                      height={24}
                      alt="pad"
                    />
                  </span>
                  <span className="font-semibold text-[17px] leading-[23px]">
                    UI/UX Design
                  </span>
                </CardTitle>
                <CardDescription className="mt-2">
                  <p className="text-grey-100 text-[15px]">
                    Creating intuitive, accessible, and delightful user
                    experiences through research-driven design processes. I
                    specialize in user research, wireframing, prototyping, and
                    creating design systems that scale.
                  </p>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="w-full bg-light-200 !shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-6">
                  <span className="flex items-center justify-center h-12 w-12 rounded-sm bg-light-230">
                    <Image
                      src={"/icons/security.svg"}
                      width={24}
                      height={24}
                      alt="pad"
                    />
                  </span>
                  <span className="font-semibold text-[17px] leading-[23px]">
                    Cybersecurity Analysis
                  </span>
                </CardTitle>
                <CardDescription className="mt-2">
                  <p className="text-grey-100 text-[15px]">
                    Identifying vulnerabilities and implementing security
                    measures to protect digital assets. My expertise includes
                    threat modeling, security assessments, and designing secure
                    user flows that don't compromise on experience.
                  </p>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="w-full bg-light-200 !shadow-none">
              <CardHeader className="w-full">
                <CardTitle className="flex items-center gap-6">
                  <span className="flex items-center justify-center h-12 w-12 rounded-sm bg-light-230">
                    <Image
                      src={"/icons/intersection.svg"}
                      width={24}
                      height={24}
                      alt="pad"
                    />
                  </span>
                  <span className="font-semibold text-[17px] leading-[23px]">
                    The Intersection
                  </span>
                </CardTitle>
                <CardDescription className="mt-2 w-full">
                  <p className="text-grey-100 text-[15px] w-full">
                    Where my work truly shines is at the intersection of these
                    disciplines. I create secure-by-design experiences that
                    protect users while delighting them, ensuring privacy
                    controls are intuitive and security measures don't impede
                    usability.
                  </p>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

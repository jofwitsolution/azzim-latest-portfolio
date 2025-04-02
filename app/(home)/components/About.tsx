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
      </div>
    </section>
  );
};

export default About;

import React from "react";

const Contact = () => {
  return (
    <section id="contact" className="bg-light-220 padding-y">
      <div className="max-width">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-center font-bold text-black text-[24px] md:text-[30.6px] md:leading-[37px]">
            Get in Touch
          </h2>
          <div className="w-[96px] h-[4px] bg-linear-to-r from-primary-100 to-primary-200" />
          <p className="max-w-[768px] text-center mt-1 md:mt-4">
            Interested in working together? Feel free to reach out for
            collaborations or just a friendly hello.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;

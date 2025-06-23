import React from "react";
import HomeHero from "./components/HomeHero";
import About from "./components/About";
import MyWork from "./components/MyWork";
import Resume from "./components/Resume";
import Contact from "./components/Contact";

const Page = () => {
  return (
    <main className="top-padding">
      <HomeHero />
      <About />
      <MyWork />
      <Resume />
      <Contact />
    </main>
  );
};

export default Page;

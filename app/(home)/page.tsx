import React from "react";
import HomeHero from "./components/HomeHero";
import About from "./components/About";

const Page = () => {
  return (
    <main className="top-padding">
      <HomeHero />
      <About />
    </main>
  );
};

export default Page;

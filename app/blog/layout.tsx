import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Blog - Azzim Aina",
  description:
    "Read the latest articles on UX design, cybersecurity, research, and more.",
};
const BlogLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className={"top-padding max-width"}>{children}</div>;
};

export default BlogLayout;

import React from "react";

const BlogLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className={"top-padding max-width"}>{children}</div>;
};

export default BlogLayout;

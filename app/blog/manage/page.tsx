import React, { Suspense } from "react";
import ManageBlog from "./ManageBlog";

const ManageBlogPage = () => {
  return (
    <Suspense fallback={<div className="w-full min-h-screen">Loading...</div>}>
      <ManageBlog />
    </Suspense>
  );
};

export default ManageBlogPage;

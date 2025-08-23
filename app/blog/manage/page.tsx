import React, { Suspense } from "react";
import ManageBlog from "./ManageBlog";

const ManageBlogPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManageBlog />
    </Suspense>
  );
};

export default ManageBlogPage;

import React from "react";

const BlogLayout = ({
                        children,
                    }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className={"top-padding"}>
            {children}
        </div>
    )
}

export default BlogLayout
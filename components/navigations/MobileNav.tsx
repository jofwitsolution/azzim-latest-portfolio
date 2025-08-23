"use client";

import React from "react";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import {mobileNavLinks} from "@/lib/data/nav-links";
import Link from "next/link";

const MobileNav = () => {
    return (
        <Sheet>
            <SheetTrigger className="cursor-pointer" asChild>
                <Image
                    src={"/icons/menu.svg"}
                    width={30}
                    height={30}
                    alt="menu"
                    priority
                />
            </SheetTrigger>
            <SheetContent side="left" className="bg-light-220">
                <SheetHeader>
                    <SheetTitle>
                        <Link href={"/"} scroll={false}>
                            <Image
                                src={"/icons/site-logo.svg"}
                                width={111}
                                height={20}
                                alt="azzim-aina"
                            />
                        </Link>
                    </SheetTitle>
                    <SheetDescription className="sr-only"></SheetDescription>
                </SheetHeader>
                <ul className="space-y-6 ml-6 mt-6 font-medium">
                    {mobileNavLinks.map((item) => {
                        return (
                            <li key={item.label}>
                                <SheetClose asChild>
                                    <Link href={item.route} className="hover:text-primary-100">
                                        {item.label}
                                    </Link>
                                </SheetClose>
                            </li>
                        );
                    })}
                </ul>
                <SheetFooter>
                    <div className="flex gap-6 items-center">
                        <SheetClose asChild>
                            <Link
                                href={"https://www.linkedin.com"}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center h-12 w-12 rounded-sm bg-light-230"
                            >
                                <Image
                                    src={"/icons/linkedin-primary.svg"}
                                    width={24}
                                    height={24}
                                    alt="linkedin"
                                />
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link
                                href={"https://www.x.com"}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center h-12 w-12 rounded-sm bg-light-230"
                            >
                                <Image
                                    src={"/icons/twitter-primary.svg"}
                                    width={24}
                                    height={24}
                                    alt="linkedin"
                                />
                            </Link>
                        </SheetClose>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default MobileNav;

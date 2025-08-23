import React from "react";
import Image from "next/image";
import Link from "next/link";
import {navbarLinks} from "@/lib/data/nav-links";
import MobileNav from "./MobileNav";
import {ChevronDownIcon} from "lucide-react";
import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

const Navbar = () => {
    return (
        <nav className="fixed left-0 top-0 right-0 z-50 w-full bg-light-100 shadow-sm">
            <div className="flex justify-between items-center gap-10 navbar-h max-width">
                <Link href={"/"} scroll={false}>
                    <Image
                        src={"/icons/site-logo.svg"}
                        width={111}
                        height={20}
                        alt="azzim-aina"
                        priority
                    />
                </Link>
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-8 font-medium">
                        {navbarLinks.map((link, index) => (
                            <NavigationMenuItem key={index + link.label} className={"max-lg:hidden"}>
                                {
                                    link.isDropdown ? (
                                        <>
                                            <NavigationMenuTrigger
                                                className="text-muted-foreground hover:text-primary bg-transparent px-2 py-1.5 font-medium *:[svg]:-me-0.5 *:[svg]:size-3.5">
                                                {link.label}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent
                                                className="data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
                                                <ul className="min-w-48">
                                                    {link.dropdownItems.map((item, itemIndex) => (
                                                        <NavigationMenuLink
                                                            key={item.label + itemIndex}
                                                            href={item.route}
                                                            className="py-1.5"
                                                        >{item.label}</NavigationMenuLink>
                                                    ))}
                                                </ul>
                                            </NavigationMenuContent>
                                        </>
                                    ) : (

                                        <NavigationMenuLink
                                            href={link.route}
                                            className="text-muted-foreground hover:text-primary bg-transparent px-2 py-1.5 font-medium *:[svg]:-me-0.5 *:[svg]:size-3.5">
                                            {link.label}
                                        </NavigationMenuLink>

                                    )
                                }


                            </NavigationMenuItem>
                        ))}


                        <li className={"lg:hidden"}>
                            <MobileNav/>
                        </li>


                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </nav>
    );
};

export default Navbar;
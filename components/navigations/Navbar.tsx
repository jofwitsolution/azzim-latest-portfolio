import React from "react";
import Image from "next/image";
import Link from "next/link";
import { navbarLinks } from "@/lib/data/nav-links";
import MobileNav from "./MobileNav";

const Navbar = () => {
  return (
    <nav className="fixed left-0 top-0 right-0 z-50 w-full bg-light-100 shadow-sm">
      <div className="flex justify-between items-center gap-10 navbar-h max-width">
        <div>
          <Image
            src={"/icons/site-logo.svg"}
            width={111}
            height={20}
            alt="azzim-aina"
            priority
          />
        </div>

        <ul className="flex gap-8 font-medium">
          {navbarLinks.map((item) => {
            return (
              <li key={item.label} className="max-lg:not-last:hidden">
                <Link href={item.route} className="hover:!text-primary-100">
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="lg:hidden">
            <MobileNav />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

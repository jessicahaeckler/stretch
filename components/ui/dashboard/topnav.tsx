"use client";
import Image from "next/image";
import Link from "next/link";
import { NavbarLinks, ProfileNavbarLinks } from "./navbar-links";

export default function TopNav() {
  return (
    <nav className="bg-gray-50 rounded-md h-15 flex flex-row w-full px-1 py-1">
      <ul className="grow flex items-center gap-x-4">
        <NavbarLinks />
      </ul>
      <ul className="flex items-center gap-x-4">
        <ProfileNavbarLinks />
        <li>
          <Link href="/dashboard/profile" className="h-15 w-15 rounded-md">
            <Image
              src="/snail.jpg"
              className=" h-12 w-12 rounded-full aspect-square object-cover"
              width={150}
              height={150}
              alt="A snail"
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

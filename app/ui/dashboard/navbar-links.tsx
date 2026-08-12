"use client";
import {
  CalendarDaysIcon,
  HomeIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import SignoutButton from "../auth/signout-button";
import { useSession } from "next-auth/react";
import { Loader2Icon } from "lucide-react";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Workouts",
    href: "/dashboard/workouts",
    icon: TrophyIcon,
  },
  { name: "Schedule", href: "/dashboard/schedules", icon: CalendarDaysIcon },
];

export const NavbarLinks = () => {
  const session = useSession();
  switch (session.status) {
    case "loading":
      return <Loading />;
    case "unauthenticated":
      return <></>;
    case "authenticated":
      return <Profile />;
    default:
      return null;
  }
};

export const ProfileNavbarLinks = () => {
  const session = useSession();
  switch (session.status) {
    case "loading":
      return <Loading />;
    case "unauthenticated":
      return <SignedOut />;
    case "authenticated":
      return <SignedIn />;
    default:
      return null;
  }
};

const Loading = () => {
  return (
    <>
      <Button size="lg" variant="ghost">
        <Loader2Icon className="min-w-[8ch] animate-spin" />
      </Button>
    </>
  );
};

const Profile = () => {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
};

const SignedIn = () => {
  return (
    <>
      <SignoutButton />
    </>
  );
};

const SignedOut = () => {
  return (
    <>
      <li>
        <Button variant="outline" className="mt-auto mb-auto">
          <Link href="/auth/sign-in">Sign In</Link>
        </Button>
      </li>
      <li>
        <Button variant="outline" className="mt-auto mb-auto">
          <Link href="/auth/sign-up">Sign Up</Link>
        </Button>
      </li>
    </>
  );
};

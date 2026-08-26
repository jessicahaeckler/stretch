import Link from "next/link";
import NavLinks from "@/components/ui/dashboard/nav-links";
import BugLogo from "@/components/ui/bug-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/lib/auth/auth";
import SignoutButton from "../auth/signout-button";

export default function SideNav() {
  // TODO: fully delete this
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-green-300 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <BugLogo />
        </div>
      </Link>
      <div className="text-black flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <SignoutButton />
      </div>
    </div>
  );
}

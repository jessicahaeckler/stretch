import SignoutButton from "@/app/ui/auth/signout-button";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { type User } from "next-auth";
import Link from "next/link";
import { UpdateUserInfoForm } from "./_components/update-user-info-form";
import { redirect } from "next/navigation";
import { USER_ROLES } from "@/lib/constants";
import { LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/auth/sign-in");
  const isAdmin = session?.user?.role === USER_ROLES.ADMIN;

  return (
    <div className="container">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        {/* make this a sidebar later */}
        {isAdmin && <AdminPanelButton />}
      </div>
      <div className="my-2 h-1 bg-muted" />
      <div>
        {!!session?.user ? <SignedIn user={session.user} /> : <SignedOut />}
      </div>
    </div>
  );
}

const SignedIn = ({ user }: { user: User }) => {
  return (
    <>
      <div className="flex item-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">User Information</h2>
        <UpdateUserInfoForm user={user} />
      </div>
      <table className="mt-4 table-auto divide-y">
        <thead>
          <tr className="divide-x">
            <th className="bg-gray-50 px-6 py-3 text-start">id</th>
            <th className="bg-gray-50 px-6 py-3 text-start">username</th>
            <th className="bg-gray-50 px-6 py-3 text-start">email</th>
            <th className="bg-gray-50 px-6 py-3 text-start">role</th>
          </tr>
        </thead>
        <tbody>
          <tr className="divide-x">
            <td className="px-6 py-3">{user.id || "NULL"}</td>
            <td
              className={cn("px-6 py-3", {
                "opacity-50": user.name === null,
              })}
            >
              {user.name || "NULL"}
            </td>
            <td className="px-6 py-3">{user.email || "NULL"}</td>
            <td className="px-6 py-3 uppercase">{user.role || "NULL"}</td>
          </tr>
        </tbody>
      </table>
      <div className="my-2 h-1 bg-muted" />
      <SignoutButton />
    </>
  );
};
const SignedOut = () => {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">User Not Signed In</h2>
      <div className="my-2 h-1 bg-muted" />
      <Button>
        <Link href="/auth/sign-in">Sign In</Link>
      </Button>
    </>
  );
};
const AdminPanelButton = () => {
  return (
    <Button size="lg">
      <Link className="flex" href="/dashboard/profile/admin-panel">
        <LockIcon className="mr-2" />
        Admin Panel
      </Link>
    </Button>
  );
};

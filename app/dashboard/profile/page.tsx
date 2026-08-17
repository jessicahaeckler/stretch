import SignoutButton from "@/app/ui/auth/signout-button";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { type User } from "next-auth";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  console.log("session", session);

  return (
    <div>
      {!!session?.user ? <SignedIn user={session.user} /> : <SignedOut />}
    </div>
  );
}

const SignedIn = ({ user }: { user: User }) => {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">User Information</h2>
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
            <td className="px-6 py-3">{user.name || "NULL"}</td>
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

import TopNav from "@/app/ui/dashboard/topnav";
import { Providers } from "../ui/auth/providers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) redirect("/dashboard/profile");
  return (
    <div className="flex h-screen md:overflow-hidden">
      <div className="flex flex-col w-full">
        <Providers>
          <TopNav />
        </Providers>
        <div className="grow p-6 md:p-12 md:overflow-y-auto ">{children}</div>
      </div>
    </div>
  );
}

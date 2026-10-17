// import SideNav from "@/app/ui/dashboard/sidenav";
import TopNav from "@/components/ui/dashboard/topnav";
import { Providers } from "../../components/ui/auth/providers";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  // TODO: delete sidnav
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="grow flex-col px-3 py-4">
        <Providers>
          <TopNav />
        </Providers>
        <SessionProvider>
          <div className="p-6 md:p-12">{children}</div>
        </SessionProvider>
      </div>
    </div>
  );
}

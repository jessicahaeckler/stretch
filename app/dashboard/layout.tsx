import SideNav from "@/app/ui/dashboard/sidenav";
import TopNav from "@/app/ui/dashboard/topnav";
import { Providers } from "../ui/auth/providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow flex-col px-3 py-4">
        <Providers>
          <TopNav />
        </Providers>
        <div className="p-6 md:p-12 md:overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

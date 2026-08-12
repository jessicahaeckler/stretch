import TopNav from "@/app/ui/dashboard/topnav";
import { Providers } from "../ui/auth/providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen md:overflow-hidden">
      <div className="flex flex-col w-full">
        <Providers>
          <TopNav />
        </Providers>
        <div className="grow p-6 md:p-12 md:overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

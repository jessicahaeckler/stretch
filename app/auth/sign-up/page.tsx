import StretchLogo from "@/app/ui/bug-logo";
import SignupForm, { SignupFormSkeleton } from "@/app/ui/auth/signup-form";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-green-500 p-3 md:h-36">
          <div className="w-40 text-white md:w-40">
            <StretchLogo />
          </div>
        </div>
        <Suspense fallback={<SignupFormSkeleton />}>
          <SignupForm />
        </Suspense>
      </div>
    </main>
  );
}

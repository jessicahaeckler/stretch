"use client";

import { useSearchParams } from "next/navigation";
import { signInWithGoogle } from "@/app/lib/auth-actions";
import googleLogo from "@/public/google.png";
import { Button } from "../button";
import Image from "next/image";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  return (
    <form action={() => signInWithGoogle(callbackUrl)}>
      <Button
        color="grey"
        className="mt-4 w-full flex items-center font-semibold justify-center"
      >
        <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
        <span className="ml-4">Continue with Google</span>
      </Button>
    </form>
  );
}

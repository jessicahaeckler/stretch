"use client";

import { inter } from "@/app/ui/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./button";
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";
import SignIn from "./sign-in";
import Link from "next/link";
import clsx from "clsx";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <form action={formAction}>
          <h1 className={`${inter.className} mb-3 text-2xl`}>
            Please log in to continue.
          </h1>
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className={clsx(
                    "peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500",
                    {
                      "outline-red-500": errorMessage,
                    },
                  )}
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {errorMessage && (
              <>
                <div
                  className="flex h-8 items-end space-x-1"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </div>
              </>
            )}
          </div>
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <Button className="mt-4 w-full font-bold!" aria-disabled={isPending}>
            <div className="m-auto">Log In</div>
          </Button>
        </form>
        <div className="relative mt-[15px]">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-50 px-2 text-muted-foreground">OR</span>
          </div>
        </div>
        <SignIn></SignIn>
        <div className="flex gap-1 text-sm mb-[5px] mt-[15px]">
          <p className="hidden md:block">Don&apos;t have an account?</p>
          <Link
            key="create-account"
            href="/sign-up"
            className="underline flex h-[20px] grow items-center justify-center gap-2 rounded-md font-medium hover:text-blue-600 md:flex-none md:justify-start"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

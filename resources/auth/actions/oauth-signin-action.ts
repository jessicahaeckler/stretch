"use server";

import { signIn } from "@/lib/auth/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function oauthSignInAction(
  provider: "google" | "github",
  callbacks: string,
) {
  try {
    await signIn(provider, { redirectTo: callbacks });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
  }
}

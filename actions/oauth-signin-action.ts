"use server";

import { signIn } from "@/auth";
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
    console.log(error);
  }
}

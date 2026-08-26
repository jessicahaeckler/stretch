"use server";

import { signOut } from "@/lib/auth/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function signoutUserAction() {
  try {
    await signOut({ redirectTo: "/auth/sign-in" });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error);
  }
}

"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type Res =
  | { success: true }
  | {
      success: false;
      error: string;
      statusCode: 500 | 401;
    };

export async function signinUserAction(
  values: unknown,
  callbacks: string,
): Promise<Res> {
  try {
    if (typeof values !== "object" || values == null || Array.isArray(values)) {
      throw new Error("Invalid JSON Object");
    }
    await signIn("credentials", { ...values, redirectTo: callbacks });
    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return {
            success: false,
            error: "Invalid Credentials",
            statusCode: 401,
          };
        case "OAuthAccountAlreadyLinkedError" as AuthError["type"]:
          return {
            success: false,
            error: "Login with your Google or Github",
            statusCode: 401,
          };
        default:
          return {
            success: false,
            error: "Oops. Something went wrong",
            statusCode: 500,
          };
      }
    }
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}

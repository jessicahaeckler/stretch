"use server";

import { findUserByEmail } from "@/resources/user-queries";
import { ForgotPasswordSchema } from "@/validators/forgot-password-validator";
import z from "zod";
import { createVerificationTokenAction } from "./create-verification-token-action";
import { sendForgotPasswordEmail } from "./mail/send-forgot-password-email";

type Res =
  | { success: true }
  | {
      success: false;
      error: z.inferFlattenedErrors<typeof ForgotPasswordSchema>;
      statusCode: 400;
    }
  | { success: false; error: string; statusCode: 401 | 500 };

export async function forgotPasswordAction(values: unknown): Promise<Res> {
  const parsedValues = z.safeParse(ForgotPasswordSchema, values);

  if (!parsedValues.success) {
    const flatErrors = z.flattenError(parsedValues.error);
    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const email = parsedValues.data.email;

  try {
    const existingUser = await findUserByEmail(email);

    // false positive to prevent malicious actors from knowing if an email exists in the database
    if (!existingUser?.id || !existingUser?.email) return { success: true };
    if (!existingUser?.password) {
      return {
        success: false,
        error:
          "This user was created with Google or Github, please sign in with Google or Github",
        statusCode: 401,
      };
    }

    const verificationToken = await createVerificationTokenAction(
      existingUser.email,
    );

    await sendForgotPasswordEmail({
      email: existingUser.email,
      token: verificationToken.token,
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}

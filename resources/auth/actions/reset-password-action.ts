"use server";

import { db } from "@/drizzle";
import { users, verificationTokens } from "@/drizzle/schema";
import { findUserByEmail } from "@/resources/users/queries/user-queries";
import { findVerificationTokenByToken } from "@/resources/auth/queries/verification-token-queries";
import { ResetPasswordSchema } from "@/resources/auth/schemas/reset-password-validator";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import z from "zod";

type Res =
  | { success: true }
  | {
      success: false;
      error: z.inferFlattenedErrors<typeof ResetPasswordSchema>;
      statusCode: 400;
    }
  | { success: false; error: string; statusCode: 401 | 500 };

export async function resetPasswordAction(
  email: string,
  token: (typeof verificationTokens.$inferSelect)["token"],
  values: unknown,
): Promise<Res> {
  const parsedValues = ResetPasswordSchema.safeParse(values);

  if (!parsedValues.success) {
    const flatErrors = z.flattenError(parsedValues.error);
    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const password = parsedValues.data.password;

  const existingToken = await findVerificationTokenByToken(token);
  if (!existingToken?.expires) {
    return {
      success: false,
      error: "Token is invalid",
      statusCode: 401,
    };
  }

  if (new Date(existingToken.expires) < new Date()) {
    return {
      success: false,
      error: "Token is expired",
      statusCode: 401,
    };
  }

  const existingUser = await findUserByEmail(email);
  if (
    !existingUser?.password ||
    existingUser?.email !== existingToken.identifier
  ) {
    return {
      success: false,
      error: "Oops, Something went wrong",
      statusCode: 401,
    };
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));

    return { success: true };
  } catch (error) {
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}

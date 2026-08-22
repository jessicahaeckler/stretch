"use server";

import { signUpSchema } from "@/validators/signup-validators";
import z from "zod";
import bcrypt from "bcrypt";
import { db } from "@/drizzle";
import { lower, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { USER_ROLES } from "@/lib/constants";
import { createVerificationTokenAction } from "./create-verification-token-action";

type Res =
  | { success: true }
  | {
      success: false;
      error: z.inferFlattenedErrors<typeof signUpSchema>;
      statusCode: 400;
    }
  | {
      success: false;
      error: string;
      statusCode: 500 | 409;
    };

export async function signupUserAction(values: unknown): Promise<Res> {
  const parsedValues = signUpSchema.safeParse(values);

  if (!parsedValues.success) {
    const flatErrors = z.flattenError(parsedValues.error);
    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const { name, email, password } = parsedValues.data;

  // check for existing email
  try {
    const existingUser = await db
      .select({
        id: users.id,
        email: users.email,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(lower(users.email), email.toLowerCase()))
      .then((res) => res?.[0] ?? null);

    if (existingUser?.id) {
      if (!existingUser.emailVerified && existingUser.email) {
        const verificationToken = await createVerificationTokenAction(
          existingUser.email,
        );
        return {
          success: false,
          error: "This users is not verified. Verification link sent.",
          statusCode: 409,
        };
      } else {
        return {
          success: false,
          error: "Email already exists",
          statusCode: 409,
        };
      }
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }

  try {
    const hash = bcrypt.hashSync(password, 10);
    // handling roles w/ email
    // const isAdmin =
    //   process.env.ADMIN_EMAIL_ADDRESS?.toLowerCase() === email.toLowerCase();
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hash,
        role: USER_ROLES.STANDARD,
      })
      .returning({
        id: users.id,
        email: users.email,
        emailVerified: users.emailVerified,
      })
      .then((res) => res[0]);

    const verificationToken = newUser.email
      ? await createVerificationTokenAction(newUser.email)
      : null;
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}

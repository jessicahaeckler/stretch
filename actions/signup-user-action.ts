"use server";

import { signUpSchema } from "@/validators/signup-validators";
import z from "zod";
import bcrypt from "bcrypt";
import { db } from "@/drizzle";
import { lower, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

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
    console.log(flatErrors);
    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const { username, email, password } = parsedValues.data;

  // check for existing email
  try {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(lower(users.email), email.toLowerCase()))
      .then((res) => res?.[0] ?? null);

    if (existingUser.id) {
      return { success: false, error: "Email already exists", statusCode: 409 };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }

  try {
    const hash = bcrypt.hashSync(password, 10);
    console.log("hashed password", hash);
    const newUser = await db
      .insert(users)
      .values({ username, email, password: hash })
      .returning({ id: users.id })
      .then((res) => res[0]);
    console.log({ insertedID: newUser.id });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}

"use server";

import { signUpSchema } from "@/validators/signup-validators";
import z from "zod";
import bcrypt from "bcrypt";

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
      statusCode: 500;
    };

export async function signupUserAction(values: unknown): Promise<Res> {
  const parsedValues = signUpSchema.safeParse(values);

  if (!parsedValues.success) {
    const flatErrors = z.flattenError(parsedValues.error);
    console.log(flatErrors);
    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const { username, email, password } = parsedValues.data;

  console.log("success", username, email, password);

  try {
    bcrypt.hash(password, 10, function (err, hash) {
      console.log("hashed password", hash);
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}

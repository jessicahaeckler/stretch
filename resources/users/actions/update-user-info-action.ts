"use server";

import z from "zod";
import { UpdateUserInfoSchema } from "@/resources/users/schemas/update-user-info-validator";
import { auth } from "@/lib/auth/auth";
import { users } from "@/drizzle/schema";
import { db } from "@/drizzle";
import { eq } from "drizzle-orm";

type Res =
  | {
      success: true;
      data: {
        id: (typeof users.$inferSelect)["id"];
        name: (typeof users.$inferSelect)["name"];
      };
    }
  | {
      success: false;
      error: z.inferFlattenedErrors<typeof UpdateUserInfoSchema>;
      statusCode: 400;
    }
  | {
      success: false;
      error: string;
      statusCode: 500 | 401;
    };

export async function updateUserInfoAction(values: unknown): Promise<Res> {
  const parsedValues = z.safeParse(UpdateUserInfoSchema, values);

  if (!parsedValues.success) {
    const flatErrors = z.flattenError(parsedValues.error);
    return { success: false, error: flatErrors, statusCode: 400 };
  }
  const { name, id } = parsedValues.data;

  const session = await auth();
  if (!session?.user?.id || session.user.id !== id) {
    return { success: false, error: "Unauthorized", statusCode: 401 };
  }

  if (session.user.name === name) {
    return { success: true, data: { id, name } };
  }

  try {
    const updatedUser = await db
      .update(users)
      .set({ name })
      .where(eq(users.id, id))
      .returning({ id: users.id, name: users.name })
      .then((res) => res[0]);

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}

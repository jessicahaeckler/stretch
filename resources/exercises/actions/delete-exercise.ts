"use server";

import { db } from "@/drizzle";
import { exercises } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

type State =
  | { success: true }
  | {
      success: false;
      error: string;
      statusCode: 500 | 401;
    };

export async function deleteExercise(id: string): Promise<State> {
  try {
    await db.delete(exercises).where(eq(exercises.id, id));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}

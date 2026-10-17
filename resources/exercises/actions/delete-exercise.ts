"use server";

import { db } from "@/drizzle";
import { exercises, workoutExerciseLinks } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";

type State =
  | { success: true }
  | {
      success: false;
      error: string;
      statusCode: 500 | 401;
    };

export async function deleteExercise(
  workoutId: string,
  exerciseId: string,
): Promise<State> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  try {
    console.log("deleting", workoutId, exerciseId);
    await db
      .delete(workoutExerciseLinks)
      .where(
        and(
          eq(workoutExerciseLinks.exerciseId, exerciseId),
          eq(workoutExerciseLinks.workoutId, workoutId),
        ),
      );
    await db.delete(exercises).where(eq(exercises.id, exerciseId));

    revalidatePath(`/dashboard/workouts/${workoutId}/edit`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}

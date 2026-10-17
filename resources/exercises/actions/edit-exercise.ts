"use server";

import { db } from "@/drizzle";
import {
  ExerciseLinkSchema,
  CreateExerciseLinkSchema,
  CreateExerciseLinkInput,
} from "@/resources/exercises/schemas/exercise-validators";
import { exercises, workoutExerciseLinks } from "@/drizzle/schema";
import { auth } from "@/lib/auth/auth";
import z from "zod";
import { eq } from "drizzle-orm";

type State =
  | { success: true }
  | {
      success: false;
      error: z.inferFlattenedErrors<typeof CreateExerciseLinkSchema>;
      statusCode: 400;
    }
  | {
      success: false;
      error: string;
      statusCode: 500 | 401;
    };

const EditExercise = ExerciseLinkSchema.omit({
  id: true,
  dateEntered: true,
  order: true,
  workoutId: true,
});

export async function editExercise(
  exerciseId: string,
  linkId: string,
  values: CreateExerciseLinkInput,
): Promise<State> {
  const validatedFields = EditExercise.safeParse(values);
  console.log("Exercise:", values);

  if (!validatedFields.success) {
    const flatErrors = z.flattenError(validatedFields.error);
    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const { name, description, time, reps, rest } = validatedFields.data;

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized", statusCode: 401 };
  }

  try {
    await db
      .update(exercises)
      .set({
        name,
        description,
      })
      .where(eq(exercises.id, exerciseId));

    await db
      .update(workoutExerciseLinks)
      .set({
        time,
        reps,
        rest,
        order: 0,
      })
      .where(eq(workoutExerciseLinks.id, linkId));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}

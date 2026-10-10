"use server";

import { db } from "@/drizzle";
import {
  ExerciseLinkSchema,
  CreateExerciseLinkSchema,
} from "@/resources/exercises/schemas/exercise-validators";
import { exercises, workoutExerciseLinks } from "@/drizzle/schema";
import { auth } from "@/lib/auth/auth";
import z from "zod";

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

const CreateExercise = ExerciseLinkSchema.omit({
  id: true,
  dateEntered: true,
  order: true,
  workoutId: true,
});

export async function createExercise(
  workoutId: string,
  values: unknown,
): Promise<State> {
  const validatedFields = CreateExercise.safeParse(values);

  if (!validatedFields.success) {
    const flatErrors = z.flattenError(validatedFields.error);
    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const { name, description, time, reps, rest } = validatedFields.data;

  console.log(name, description);

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized", statusCode: 401 };
  }

  const userId = session.user.id;
  const dateEntered = new Date();

  try {
    const exercise = await db
      .insert(exercises)
      .values({
        name,
        description,
        userId,
        dateEntered,
      })
      .returning({
        id: exercises.id,
      })
      .then((res) => res[0]);

    await db.insert(workoutExerciseLinks).values({
      exerciseId: exercise.id,
      dateEntered,
      time,
      reps,
      rest,
      order: 0,
      workoutId,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}

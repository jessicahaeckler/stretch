"use server";

import { db } from "@/drizzle";
import { WorkoutSchema } from "@/resources/workouts/schemas/workout-validators";
import { workouts } from "@/drizzle/schema";
import { auth } from "@/lib/auth/auth";
import { CreateWorkoutSchema } from "@/resources/workouts/schemas/workout-validators";
import z from "zod";
import { eq } from "drizzle-orm";

type State =
  | { success: true }
  | {
      success: false;
      error: z.inferFlattenedErrors<typeof CreateWorkoutSchema>;
      statusCode: 400;
    }
  | {
      success: false;
      error: string;
      statusCode: 500 | 401;
    };

const EditWorkout = WorkoutSchema.omit({ id: true, date: true });

export async function editWorkout(id: string, values: unknown): Promise<State> {
  const validatedFields = EditWorkout.safeParse(values);

  if (!validatedFields.success) {
    const flatErrors = z.flattenError(validatedFields.error);
    return { success: false, error: flatErrors, statusCode: 400 };
  }

  const { name, description, schedule_days, status } = validatedFields.data;

  console.log(name, description, schedule_days, status);

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized", statusCode: 401 };
  }

  try {
    await db
      .update(workouts)
      .set({
        name,
        description,
        schedule_days,
        status,
      })
      .where(eq(workouts.id, id));

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}

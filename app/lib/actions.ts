"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { signIn, auth } from "@/auth";
import { AuthError } from "next-auth";
import { WorkoutSchema } from "./zod";

const sql = postgres(process.env.STORAGE_POSTGRES_URL!, { ssl: "require" });

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export type State = {
  errors?: {
    name?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateWorkout = WorkoutSchema.omit({ id: true, date: true });

export async function createWorkout(prevState: State, formData: FormData) {
  let parsedExercises: unknown;
  try {
    parsedExercises = JSON.parse(formData.get("exercises") as string);
  } catch {
    throw new Error("Invalid exercises payload");
  }

  const validatedFields = CreateWorkout.safeParse({
    name: formData.get("workout"),
    exercises: parsedExercises,
    schedule: formData.getAll("schedule"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Workout.",
    };
  }

  const { name, exercises, schedule, status } = validatedFields.data;
  const date = new Date().toISOString().split("T")[0];
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // TODO: Change this to current user - hard coding the user id until users/login is set up
  try {
    await sql.begin(async (sql) => {
      const [{ id }] = await sql`
          INSERT INTO workouts (user_id, name, status, schedule_days, duration, date_entered)
          VALUES (${userId}, ${name}, ${status}, ${schedule}, ${"00:00:00"}, ${date}) RETURNING id;
        `;
      for (const exercise of exercises) {
        const time =
          exercise.time == "00:00:00" || exercise.time == undefined
            ? null
            : exercise.time;
        const reps = !exercise.reps ? null : exercise.reps;
        const rest =
          exercise.rest == "00:00:00" || exercise.rest == undefined
            ? null
            : exercise.rest;
        await sql`
            INSERT INTO workout_exercise_links (workout_id, exercise_id, time, reps, rest)
            VALUES (${id}, ${exercise.exerciseid}, ${time}, ${reps}, ${rest})
          `;
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: Failed to Create Workout.");
  }

  revalidatePath("/dashboard/workouts");
  redirect("/dashboard/workouts");
}

const UpdateWorkout = WorkoutSchema.omit({ id: true, date: true });

export async function updateWorkout(
  id: string,
  prevState: State,
  formData: FormData,
) {
  let parsedExercises: unknown;
  try {
    parsedExercises = JSON.parse(formData.get("exercises") as string);
  } catch {
    throw new Error("Invalid exercises payload");
  }

  let parsedDelete: unknown;
  try {
    parsedDelete = JSON.parse(formData.get("deletedExercises") as string);
  } catch {
    throw new Error("Invalid exercises payload");
  }

  const validatedFields = UpdateWorkout.safeParse({
    name: formData.get("name"),
    exercises: parsedExercises,
    schedule: formData.getAll("schedule"),
    status: formData.get("status"),
    deletedExercises: parsedDelete,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Workout.",
    };
  }

  const { exercises, schedule, name, status, deletedExercises } =
    validatedFields.data;

  try {
    await sql.begin(async (sql) => {
      await sql`
        UPDATE workouts
        SET schedule_days = ${schedule}, name = ${name}, status = ${status}
        WHERE id = ${id}
      `;
      if (deletedExercises && deletedExercises.length > 0) {
        await sql`
          DELETE FROM workout_exercise_links WHERE id = ANY(${deletedExercises})
        `;
      }
      // TODO: add a way to edit exercise links
      for (const exercise of exercises) {
        const time =
          exercise.time == "00:00:00" || exercise.time == undefined
            ? null
            : exercise.time;
        const reps = !exercise.reps ? null : exercise.reps;
        const rest =
          exercise.rest == "00:00:00" || exercise.rest == undefined
            ? null
            : exercise.rest;
        if (exercise.id) {
          await sql`
            UPDATE workout_exercise_links set exercise_id = ${exercise.exerciseid}, time = ${time}, reps = ${reps}, rest = ${rest} 
            WHERE id = ${id} AND (exercise_id <> ${exercise.exerciseid} OR time <> ${time} OR reps = ${reps} OR rest = ${rest})
          `;
        } else {
          await sql`
            INSERT INTO workout_exercise_links (workout_id, exercise_id, time, reps, rest)
            VALUES (${id}, ${exercise.exerciseid}, ${time}, ${reps}, ${rest})
          `;
        }
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: Failed to Update Workout.");
  }

  revalidatePath("/dashboard/workouts");
  redirect("/dashboard/workouts");
}

export async function deleteWorkout(id: string) {
  await sql`DELETE FROM workouts WHERE id = ${id}`;
  revalidatePath("/dashboard/workouts");
}

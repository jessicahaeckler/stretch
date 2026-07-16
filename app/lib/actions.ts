"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.STORAGE_POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  exercises: z.array(
    z.object({
      id: z.nullable(z.string().optional()),
      exerciseid: z.string(),
      reps: z.nullable(z.number().optional()),
      time: z.nullable(z.string().optional()),
      rest: z.nullable(z.string().optional()),
    }),
  ),
  schedule: z.array(z.string()),
  status: z.enum(["public", "private"]),
  date: z.string(),
  deletedExercises: z.array(z.string()).optional(),
});

const CreateWorkout = FormSchema.omit({ id: true, date: true });

export async function createWorkout(formData: FormData) {
  let parsedExercises: unknown;
  try {
    parsedExercises = JSON.parse(formData.get("exercises") as string);
  } catch {
    throw new Error("Invalid exercises payload");
  }

  const { name, exercises, schedule, status } = CreateWorkout.parse({
    name: formData.get("workout"),
    exercises: parsedExercises,
    schedule: formData.getAll("schedule"),
    status: formData.get("status"),
  });
  const date = new Date().toISOString().split("T")[0];

  await sql.begin(async (sql) => {
    // TODO: Change this to current user - hard coding the user id until users/login is set up
    const [{ id }] = await sql`
            INSERT INTO workouts (user_id, name, status, schedule_days, duration, date_entered)
            VALUES ('410544b2-4001-4271-9855-fec4b6a6442a', ${name}, ${status}, ${schedule}, ${"00:00:00"}, ${date}) RETURNING id;
        `;
    for (const exercise of exercises) {
      await sql`
                INSERT INTO workout_exercise_links (workout_id, exercise_id, time, reps, rest)
                VALUES (${id}, ${exercise.exerciseid}, ${exercise.time || "00:00:00"}, ${exercise.reps || 0}, ${exercise.rest || "00:00:00"})
            `;
    }
  });

  revalidatePath("/dashboard/workouts");
  redirect("/dashboard/workouts");
}

const UpdateWorkout = FormSchema.omit({ id: true, date: true });

export async function updateWorkout(id: string, formData: FormData) {
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

  const { exercises, schedule, name, status, deletedExercises } =
    UpdateWorkout.parse({
      name: formData.get("name"),
      exercises: parsedExercises,
      schedule: formData.getAll("schedule"),
      status: formData.get("status"),
      deletedExercises: parsedDelete,
    });

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

  // revalidatePath('/dashboard/workouts');
  // redirect('/dashboard/workouts');
}

export async function deleteWorkout(id: string) {
  await sql`DELETE FROM workouts WHERE id = ${id}`;
  revalidatePath("/dashboard/workouts");
}

import "server-only";

import { db } from "@/drizzle";
import { exercises, workoutExerciseLinks } from "@/drizzle/schema";
import { count, desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";

const ITEMS_PER_PAGE = 6;

export async function fetchUserExercisesPages(query: string) {
  const session = await auth();

  if (!session?.user?.id) return [];

  try {
    const allExercises = await db
      .select({ count: count() })
      .from(exercises)
      .where(eq(exercises.userId, session?.user?.id));

    return Math.ceil(Number(allExercises[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of exercises.");
  }
}

export async function fetchUserExercises(currentPage: number) {
  const session = await auth();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  if (!session?.user?.id) return [];
  try {
    const pageExercises = await db
      .select({
        id: exercises.id,
        name: exercises.name,
        description: exercises.description,
        image: exercises.image,
      })
      .from(exercises)
      .where(eq(exercises.userId, session?.user?.id))
      .orderBy(desc(exercises.name))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return pageExercises;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch all exercises.");
  }
}

export async function fetchExerciseLinksById(id: string) {
  try {
    const exerciseLinks = await db
      .select({
        id: workoutExerciseLinks.id,
        time: workoutExerciseLinks.time,
        reps: workoutExerciseLinks.reps,
        rest: workoutExerciseLinks.rest,
        order: workoutExerciseLinks.order,
        exerciseId: workoutExerciseLinks.exerciseId,
      })
      .from(workoutExerciseLinks)
      .where(eq(workoutExerciseLinks.workoutId, id));

    return exerciseLinks;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch workout links.");
  }
}

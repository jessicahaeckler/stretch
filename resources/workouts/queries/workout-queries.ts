import "server-only";

import { db } from "@/drizzle";
import { users, workouts } from "@/drizzle/schema";
import { count, desc, eq, ilike, or } from "drizzle-orm";

const ITEMS_PER_PAGE = 6;
export async function fetchWorkoutsPages(query: string) {
  try {
    const allWorkouts = await db
      .select({ count: count() })
      .from(workouts)
      .leftJoin(users, eq(users.id, workouts.userId))
      .where(
        or(ilike(users.name, `%${query}%`), ilike(workouts.name, `%${query}%`)),
      );

    return Math.ceil(Number(allWorkouts[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of workouts.");
  }
}

export async function fetchFilteredWorkouts(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pageWorkouts = await db
      .select({
        id: workouts.id,
        userId: workouts.userId,
        name: workouts.name,
        schedule_days: workouts.schedule_days,
        duration: workouts.duration,
        description: workouts.description,
        tags: workouts.tags,
        image: workouts.image,
        user: users.name,
      })
      .from(workouts)
      .leftJoin(users, eq(users.id, workouts.userId))
      .where(
        or(ilike(users.name, `%${query}%`), ilike(workouts.name, `%${query}%`)),
      )
      .orderBy(desc(workouts.name))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return pageWorkouts;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch workouts.");
  }
}

export async function fetchWorkoutById(id: string) {
  try {
    const workout = await db
      .select({
        id: workouts.id,
        userId: workouts.userId,
        name: workouts.name,
        days: workouts.schedule_days,
        duration: workouts.duration,
        description: workouts.description,
        tags: workouts.tags,
        image: workouts.image,
        status: workouts.status,
      })
      .from(workouts)
      .where(eq(workouts.id, id))
      .then((res) => res[0] ?? null);

    return workout;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch workout.");
  }
}

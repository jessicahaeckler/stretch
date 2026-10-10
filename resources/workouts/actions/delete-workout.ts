"use server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/drizzle";
import { workouts } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteWorkout(id: string): Promise<void> {
  const session = await auth();

  // Ensure the user is signed in.
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await db
      .delete(workouts)
      .where(and(eq(workouts.id, id), eq(workouts.userId, session.user.id)));

    revalidatePath("/dashboard");
  } catch (error) {
    console.error(error);
  }
}

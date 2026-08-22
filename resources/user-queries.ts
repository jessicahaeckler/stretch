import "server-only";

import { db } from "@/drizzle";
import { lower, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { USER_ROLES } from "@/app/lib/constants";
import { desc, getTableColumns } from "drizzle-orm";

// ADMIN QUERIES
export async function FindAllUsers() {
  const session = await auth();

  if (session?.user?.role !== USER_ROLES.ADMIN) {
    throw new Error("Unauthorized");
  }

  const { password, ...rest } = getTableColumns(users);

  // TODO:: add pagination
  const allUsers = await db
    .select({ ...rest })
    .from(users)
    .orderBy(desc(users.role));

  return allUsers;
}

// -----------------------------

export const findUserByEmail = async (
  email: string | null,
): Promise<typeof users.$inferSelect | null> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email?.toLowerCase()))
    .then((res) => res[0] ?? null);

  return user;
};

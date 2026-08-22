"use server";

import { USER_ROLES } from "@/app/lib/constants";
import { auth } from "@/auth";
import { db } from "@/drizzle";
import { users } from "@/drizzle/schema";
import { findUserByEmail } from "@/resources/user-queries";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function changeUserRoleAction(
  email: (typeof users.$inferSelect)["email"],
  newRole: (typeof users.$inferSelect)["role"],
) {
  const session = await auth();

  if (session?.user?.role !== USER_ROLES.ADMIN) {
    throw new Error("Unauthorized");
  }
  const existingUser = await findUserByEmail(email);
  if (!existingUser?.id) return;
  if (existingUser?.role === USER_ROLES.ADMIN) return;
  if (existingUser.role === newRole) return;

  await db
    .update(users)
    .set({ role: newRole })
    .where(eq(users.id, existingUser.id));

  revalidatePath("/dashboard/profile/admin-panel");
}

"use server";

import { db } from "@/drizzle";
import { users, verificationTokens } from "@/drizzle/schema";
import { findUserByEmail } from "@/resources/users/queries/user-queries";
import { findVerificationTokenByToken } from "@/resources/auth/queries/verification-token-queries";
import { eq } from "drizzle-orm";

export async function verfiyCredentialsEmailAction(
  token: (typeof verificationTokens.$inferSelect)["identifier"],
) {
  const verificationToken = await findVerificationTokenByToken(token);

  if (!verificationToken?.expires) return { success: false };

  if (new Date(verificationToken.expires) < new Date()) {
    return { success: false };
  }

  const existingUser = await findUserByEmail(verificationToken.identifier);

  if (
    existingUser?.id &&
    !existingUser.emailVerified &&
    existingUser.email === verificationToken.identifier
  ) {
    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.id, existingUser.id));
    if (existingUser.email) {
      await db
        .update(verificationTokens)
        .set({ expires: new Date() })
        .where(eq(verificationTokens.identifier, existingUser.email));
    }
    console.log("returning");
    return { success: true };
  }
  return { success: false };
}

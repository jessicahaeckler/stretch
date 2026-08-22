"use server";

import { db } from "@/drizzle";
import { users, verificationTokens } from "@/drizzle/schema";
import { findUserByEmail } from "@/resources/user-queries";
import { findVerificationTokenByToken } from "@/resources/verification-token-queries";
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

  if (existingUser?.id && !existingUser.emailVerified) {
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

    return { success: true };
  }
  return { success: false };
}

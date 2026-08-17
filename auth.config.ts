import type { NextAuthConfig } from "next-auth";
import { getUser, createUser } from "./app/lib/data";

export const authConfig = {
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await getUser(user.email!);

        if (!existingUser) {
          const newUser = await createUser(user.email!, user.name ?? "User");
          user.id = newUser.id;
        } else {
          user.id = existingUser.id;
        }
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

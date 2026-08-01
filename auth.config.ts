import type { NextAuthConfig } from "next-auth";
import { getUser, createUser } from "./app/lib/data";

export const authConfig = {
  pages: {
    signIn: "/login",
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

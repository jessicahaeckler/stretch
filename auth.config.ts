import type { NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/drizzle";
import * as schema from "@/drizzle/schema";
import { OAuthVerifyEmailAction } from "./actions/oauth-verify-email-action";
import { USER_ROLES } from "./app/lib/constants";
import { changeUserRoleAction } from "./actions/change-user-role-action";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  adapter: DrizzleAdapter(db, {
    accountsTable: schema.accounts,
    usersTable: schema.users,
    authenticatorsTable: schema.authenticators,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  pages: {
    signIn: "/auth/sign-in",
  },
  events: {
    async linkAccount({ user, account }) {
      if (["google", "github"].includes(account.provider)) {
        if (user.email) await OAuthVerifyEmailAction(user.email);
      }
    },
    async createUser({ user }) {
      if (
        user.email &&
        process.env.ADMIN_EMAIL_ADDRESS?.toLowerCase() ===
          user.email.toLowerCase()
      ) {
        await changeUserRoleAction(user.email, USER_ROLES.ADMIN);
      }
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isOnAuth) {
        if (!isLoggedIn) return true;
        return Response.redirect(new URL("/dashboard/profile", nextUrl));
      }
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      if (user?.id) token.id = user.id;
      if (user?.role) token.role = user.role;
      if (
        user?.email &&
        process.env.ADMIN_EMAIL_ADDRESS?.toLowerCase() ===
          user.email.toLowerCase()
      ) {
        token.role = USER_ROLES.ADMIN;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        return !!profile?.email_verified;
      }
      if (account?.provider === "github") {
        return true;
      }
      if (account?.provider === "credentials") {
        if (user.emailVerified) {
          // return true;
        }
        return true;
      }
      return false;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

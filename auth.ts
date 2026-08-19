import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import * as schema from "@/drizzle/schema";
import bcrypt from "bcrypt";
import { signInSchema } from "@/validators/signin-validators";
import { findUserByEmail } from "./resources/user-queries";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/drizzle";
import { OAuthVerifyEmailAction } from "./actions/oauth-verify-email-action";
// TODO: add 2fa

const nextAuth = NextAuth({
  // ...authConfig,
  adapter: DrizzleAdapter(db, {
    accountsTable: schema.accounts,
    usersTable: schema.users,
    authenticatorsTable: schema.authenticators,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/auth/sign-in" },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      if (user?.id) token.id = user.id;
      if (user?.role) token.role = user.role;
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
  events: {
    async linkAccount({ user, account }) {
      if (["google", "github"].includes(account.provider)) {
        if (user.email) await OAuthVerifyEmailAction(user.email);
      }
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await findUserByEmail(email);
          if (!user) return null;
          if (!user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            const { password, ...userWithoutPassword } = user;
            console.log("userWithoutPassword", userWithoutPassword);
            return userWithoutPassword;
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});

export const { handlers, auth, signIn, signOut } = nextAuth;

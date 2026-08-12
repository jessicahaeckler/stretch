import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import bcrypt from "bcrypt";
import { signInSchema } from "@/validators/signin-validators";
import { findUserByEmail } from "./resources/user-queries";
// TODO: add 2fa

const nextAuth = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/auth/sign-in" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
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

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user?.username;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;

      return session;
    },
  },
});

export const { handlers, auth, signIn, signOut } = nextAuth;

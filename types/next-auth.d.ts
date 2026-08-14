import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    name?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name?: string | null;
  }
}

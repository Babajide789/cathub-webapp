import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      hasOnboarded: boolean;
      role: string;
      location?: string;
      image?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    hasOnboarded: boolean;
    role: string;
    location?: string;
    image?: string;
  }
}
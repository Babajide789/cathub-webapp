import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type AuthUser = {
  hasOnboarded?: boolean;
  role?: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // ✅ Return hasOnboarded and role so the JWT callback can seed them
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          hasOnboarded: user.hasOnboarded,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    // ✅ Session expires after 30 minutes of inactivity
    maxAge: 30 * 60,
    // ✅ Rolls the expiry forward on every active request (sliding window)
    updateAge: 60,
  },

  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Runs on sign-in — seed token from authorize() return value
      if (user) {
        const authUser = user as AuthUser;
        token.id = user.id;
        token.hasOnboarded = authUser.hasOnboarded ?? false;
        token.role = authUser.role ?? "USER";
      }

      // ✅ Re-read from DB whenever:
      //    - update() is called from the client (trigger === "update")
      // This avoids repeated DB reads from normal /api/auth/session checks.
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            hasOnboarded: true,
            role: true,
            location: true,
            image: true,
          },
        });
        if (dbUser) {
          token.hasOnboarded = dbUser.hasOnboarded;
          token.role = dbUser.role;
          token.location = dbUser.location ?? undefined;
          token.image = dbUser.image ?? undefined;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.hasOnboarded = token.hasOnboarded as boolean;
        session.user.role = token.role as string;
        session.user.location = token.location as string | undefined;
        session.user.image = token.image as string | undefined;
      }
      return session;
    },
  },
};

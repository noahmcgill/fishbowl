import NextAuth, { User } from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "../db";
import Resend from "next-auth/providers/resend";
import { SLUG_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { SignupRequiredError } from "@/lib/errors";

const combinedProviders = [
  ...authConfig.providers,
  Resend({
    apiKey: process.env.AUTH_RESEND_KEY,
    from: process.env.AUTH_RESEND_FROM,
  }),
];

const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut,
} = NextAuth({
  providers: combinedProviders,
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/api/start",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    /**
     * Checks for a page present in the database and a slug present in the cookies.
     * If there's no page and no slug, this means that a user is attempting to
     * login without going through the signup process. Otherwise, Next Auth will
     * redirect to the newUser page on first sign up, which will create a page for
     * the user.
     */
    async signIn({ user }) {
      const cookieStore = await cookies();
      const slugCookie = cookieStore.get(SLUG_COOKIE_NAME);
      const slug = atob(slugCookie?.value ?? "");

      const page = await db.page.findFirst({
        where: { userId: user.id ?? "" },
      });

      if (!page && !slug) {
        const error = new SignupRequiredError(
          "[auth.signIn] user has attempted to login without going through account creation process first",
        );
        console.error(error);

        return `/api/auth/error?error=${error.type}`;
      }

      return true;
    },
  },
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };

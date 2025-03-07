import NextAuth from "next-auth";
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
  /**
   * The Resend adapter does not create a row in the Account database table like it should.
   * See: {@link https://github.com/nextauthjs/next-auth/issues/10662}
   * This doesn't break auth, but instead (I suspect) contributes to account linking with
   * the Github provider. When first logging in with Github, the user can subsequently
   * login with a magic link, and the database User is updated to include the emailVerified
   * column; subsequent logins with Github still work. However, vice versa, Next Auth blocks
   * Github logins once magic link has been used. We'll maintain this for now, but might
   * want to set up Email -> Github account linking if the above issue isn't solved,
   * just to have some consistency.
   */
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
    signIn: "/api/auth-handler",
    error: "/api/auth-handler",
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
      const slug = cookieStore.get(SLUG_COOKIE_NAME);

      // Find the page associated with this email
      const page = await db.page.findFirst({
        where: {
          user: {
            email: user.email,
          },
        },
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

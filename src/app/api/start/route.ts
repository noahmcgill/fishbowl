import { SLUG_COOKIE_NAME } from "@/lib/constants";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * Creates a page for a user. User must be authenticated.
 * GET method is used here because Next Auth expects this
 * as a target for the `newUser` page.
 */
export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const slugCookie = cookieStore.get(SLUG_COOKIE_NAME);
  const slug = atob(slugCookie?.value ?? "");

  if (!slug) {
    return NextResponse.json(
      { message: "Slug not set in cookies" },
      { status: 400 },
    );
  }

  await db.page.create({
    data: {
      userId: req.auth.user.id,
      slug,
      name: "My Page",
    },
  });

  cookieStore.delete(SLUG_COOKIE_NAME);

  redirect("/");
});

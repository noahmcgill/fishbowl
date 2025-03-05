import { SLUG_COOKIE_NAME } from "@/lib/constants";
import { auth } from "@/server/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const GET = auth(async function GET(req) {
  const url = new URL(req.url);
  const error = url.searchParams.get("error");

  const cookieStore = await cookies();
  const slug = cookieStore.get(SLUG_COOKIE_NAME);

  const basePath = error ? (slug ? "/signup" : "/login") : "/";
  if (!error) {
    cookieStore.delete(SLUG_COOKIE_NAME);
  }

  redirect(`${basePath}?${url.searchParams.toString()}`);
});

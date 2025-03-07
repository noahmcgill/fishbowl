"use server";

import { signIn, signOut } from "@/server/auth";
import { redirect } from "next/navigation";
import { SLUG_COOKIE_NAME } from "../constants";
import { cookies } from "next/headers";

export const continueWithGithub = async () => {
  await signIn("github", {
    redirectTo: "/",
  });
};

export const continueWithMagicLink = async (formData: FormData) => {
  const email = formData.get("email") as string;

  const res = (await signIn("resend", {
    email,
    redirect: false,
  })) as string;

  // res only returns a URL string, so we need to extract the error in order
  // to display it on the sign in page
  const url = new URL(res);
  if (url.searchParams.get("error")) {
    redirect(`/login?error=${url.searchParams.get("error")}`);
  }

  redirect("/login?status=sent");
};

export const logout = async () => {
  await signOut({
    redirectTo: "/login",
  });
};

export const claim = async (formData: FormData) => {
  const slug = formData.get("slug") as string;
  const cookieStore = await cookies();

  cookieStore.set(SLUG_COOKIE_NAME, btoa(slug), {
    sameSite: "lax",
  });

  redirect("/signup");
};

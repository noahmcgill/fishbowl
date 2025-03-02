"use server";

import { signIn, signOut } from "@/server/auth";
import { redirect } from "next/navigation";

export const continueWithGithub = async (formData: FormData) => {
  const slug = formData.get("slug") as string | undefined;

  await signIn("github", {
    redirectTo: "/",
  });

  if (slug) {
    // create page
  }
};

export const continueWithMagicLink = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const slug = formData.get("slug") as string | undefined;

  const res = (await signIn("resend", {
    email,
    redirect: false,
  })) as string;

  if (slug) {
    // create page
  }

  // res only returns a URL string, so we need to extract the error in order
  // to display it on the sign in page
  const url = new URL(res);
  if (url.searchParams.get("error")) {
    redirect(`/login?error=${url.searchParams.get("error")}`);
  }

  redirect("/login?status=sent");
};

export const logout = async () => {
  await signOut();
};

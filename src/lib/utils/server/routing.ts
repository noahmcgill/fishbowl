import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export const resolveUserPage = async () => {
  const page = await api.page.getFirstForUser();

  redirect(`/${page?.slug}`);
};

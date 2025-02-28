import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export const resolveUserPage = async (userId: string) => {
  const page = await api.page.getFirstForUserEmail({
    id: userId,
  });

  if (!page) {
    redirect("/start");
  } else {
    redirect(`/p/${page.slug}`);
  }
};

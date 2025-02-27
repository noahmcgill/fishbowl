import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export const routeToOwnedPage = async () => {
  const session = await auth();
  const page = await api.page.getFirstForUserEmail({
    id: session?.user.id ?? "",
  });

  if (!page) {
    redirect("/start");
  } else {
    redirect(`/p/${page.slug}`);
  }
};

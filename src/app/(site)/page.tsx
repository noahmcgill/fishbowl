import { resolveUserPage } from "@/lib/utils/server/routing";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

/**
 * App home page. If there's no session, the marketing page is displayed.
 * If there is a session, the user is redirected to their slug.
 */
export default async function Home() {
  const session = await auth();

  if (session) {
    await resolveUserPage();
  } else {
    redirect("/login");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      Home
    </div>
  );
}

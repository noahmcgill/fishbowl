import { resolveUserPage } from "@/lib/utils/server/routing";
import { auth } from "@/server/auth";

export default async function Home() {
  const session = await auth();

  if (session) {
    await resolveUserPage(session.user.id);
  }

  // @todo: add box where users can input a slug they want to see if it's available.
  // if so, they will be forwarded to the sign up page
  return <>Sign Up</>;
}

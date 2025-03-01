import { ClaimLinkForm } from "@/components/ui/claim-link/claim-link-form";
import { resolveUserPage } from "@/lib/utils/server/routing";
import { auth } from "@/server/auth";

export default async function Home() {
  const session = await auth();

  if (session) {
    await resolveUserPage(session.user.id);
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ClaimLinkForm />
      </div>
    </div>
  );
}

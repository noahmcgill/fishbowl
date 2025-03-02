import { ClaimLinkForm } from "@/components/ui/claim-link/claim-link-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="w-full max-w-sm">
      <ClaimLinkForm />
    </div>
  );
}

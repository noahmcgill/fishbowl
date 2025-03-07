import { ClaimLinkForm } from "@/components/claim-link/claim-link-form";
import { SLUG_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";

export default async function ClaimPage() {
  const cookieStore = await cookies();
  const slug = atob(cookieStore.get(SLUG_COOKIE_NAME)?.value ?? "");

  return (
    <div className="w-full max-w-sm">
      <ClaimLinkForm initialSlug={slug} />
    </div>
  );
}

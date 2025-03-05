import { AuthForm } from "@/components/auth/auth-form";
import { SLUG_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const cookieStore = await cookies();
  const slug = cookieStore.get(SLUG_COOKIE_NAME);

  if (!slug) {
    redirect("/claim");
  }

  return (
    <div className="w-full max-w-sm">
      <AuthForm slug={atob(slug.value)} />
    </div>
  );
}

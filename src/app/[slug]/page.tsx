import { UserProfileImage } from "@/components/page/user-profile-image";
import { SignoutBtn } from "@/components/page/signout-btn";
import { api } from "@/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { id, imageUrl } = await api.page.getPageBySlug({ slug });

  return (
    <div className="">
      Slug: {slug}
      <UserProfileImage pageId={id} existingImageUrl={imageUrl} />
      <SignoutBtn />
    </div>
  );
}

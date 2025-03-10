import { UserProfileImage } from "@/components/page/metadata/user-profile-image";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { PageMetadata } from "@/components/page/metadata/page-metadata";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await api.page.getPageBySlug({ slug });

  if (!page) redirect("/");

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <div className="flex basis-full animate-fadeIn-1.5s flex-col gap-8 md:basis-[500px]">
        <UserProfileImage pageId={page.id} existingImageUrl={page.imageUrl} />
        <PageMetadata page={page} />
      </div>
      <div className="grow">Hello</div>
    </div>
  );
}

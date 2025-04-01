import { UserProfileImage } from "@/components/page/metadata/user-profile-image";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { PageMetadata } from "@/components/page/metadata/page-metadata";
import { type JsonObject } from "@prisma/client/runtime/library";
import { Menu } from "@/components/page/menu/menu";
import { EditableGrid } from "@/components/page/grid/editable-grid";
import Head from "next/head";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await api.page.getPageBySlug({ slug });

  if (!page) redirect("/");

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:justify-between">
      <Head>
        <link rel="preload" href={page.imageUrl ?? ""} as="image" />
      </Head>
      <div className="flex basis-full animate-fadeIn-1.5s flex-col gap-8 md:basis-[400px]">
        <UserProfileImage pageId={page.id} existingImageUrl={page.imageUrl} />
        <PageMetadata page={page} />
      </div>
      <div className="basis-full md:basis-[820px]">
        <EditableGrid
          initialGridState={page.gridState as JsonObject}
          pageId={page.id}
        />
      </div>
      <Menu pageId={page.id} />
    </div>
  );
}

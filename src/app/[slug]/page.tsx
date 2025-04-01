import { EditableUserProfileImage } from "@/components/page/metadata/editable/editable-user-profile-image";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { type JsonObject } from "@prisma/client/runtime/library";
import { Menu } from "@/components/page/menu/menu";
import { EditableGrid } from "@/components/page/grid/blocks/editable/editable-grid";
import Head from "next/head";
import { auth } from "@/server/auth";
import { Grid } from "@/components/page/grid/blocks/non-editable/grid";
import { EditablePageMetadata } from "@/components/page/metadata/editable/editable-page-metadata";
import { UserProfileImage } from "@/components/page/metadata/non-editable/user-profile-image";
import { PageMetadata } from "@/components/page/metadata/non-editable/page-metadata";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await api.page.getPageBySlug({ slug });

  if (!page) redirect("/claim");

  const session = await auth();
  const isEditable = session && session.user.id === page.userId;

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:justify-between">
      <Head>
        <link rel="preload" href={page.imageUrl ?? ""} as="image" />
      </Head>
      <div className="flex basis-full animate-fadeIn-1.5s flex-col gap-8 md:basis-[400px]">
        {isEditable ? (
          <EditableUserProfileImage
            pageId={page.id}
            existingImageUrl={page.imageUrl}
          />
        ) : (
          <UserProfileImage title={page.title} imageUrl={page.imageUrl} />
        )}
        {isEditable ? (
          <EditablePageMetadata page={page} />
        ) : (
          <PageMetadata page={page} />
        )}
      </div>
      <div className="basis-full md:basis-[820px]">
        {isEditable ? (
          <EditableGrid
            initialGridState={page.gridState as JsonObject}
            pageId={page.id}
          />
        ) : (
          <Grid gridState={page.gridState as JsonObject} pageId={page.id} />
        )}
      </div>
      {isEditable && <Menu pageId={page.id} />}
    </div>
  );
}

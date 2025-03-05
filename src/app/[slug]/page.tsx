import { resolveUserPage } from "@/lib/utils/server/routing";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  resolveUserPage;
  const { slug } = await params;
  return <div>My Post: {slug}</div>;
}

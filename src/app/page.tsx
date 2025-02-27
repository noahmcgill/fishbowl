import { routeToOwnedPage } from "@/lib/utils/server/routing";

export default async function Home() {
  await routeToOwnedPage();
  return null;
}

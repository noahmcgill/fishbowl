import { routeToOwnedPage } from "@/lib/utils/server.ts/routing";

export default async function Home() {
  await routeToOwnedPage();
  return null;
}

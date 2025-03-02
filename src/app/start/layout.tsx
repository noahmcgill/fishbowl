import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparify - Create your page",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function StartLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";
import { IoMdAlert, IoMdCheckmarkCircle } from "react-icons/io";

export const metadata: Metadata = {
  title: "Transparifi - Share your project's metrics",
  description:
    "Foster transparency. Share your project's metrics with the world.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Toaster
          icons={{
            error: <IoMdAlert className="text-red-500" />,
            success: <IoMdCheckmarkCircle className="text-green-500" />,
          }}
        />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}

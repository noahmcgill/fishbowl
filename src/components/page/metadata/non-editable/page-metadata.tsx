"use client";

import { type Page } from "@prisma/client";
import React from "react";
import { ContentEditable } from "../../../ui/content-editable";
import { LuLink } from "react-icons/lu";
import Link from "next/link";

interface PageMetadataProps {
  page: Page;
}

export const PageMetadata: React.FC<PageMetadataProps> = ({ page }) => {
  return (
    <div className="flex flex-col">
      <ContentEditable
        html={page.title ?? ""}
        className="text-[32px] font-bold leading-[120%] tracking-[-1px] min-[1360px]:text-[44px] min-[1360px]:tracking-[-2px]"
        role="textbox"
        disabled
      />
      <ContentEditable
        className="mt-3 text-zinc-600 min-[1360px]:mt-3 min-[1360px]:text-xl"
        role="textbox"
        html={page.description ?? ""}
        disabled
      />
      {page.link && (
        <div className="mt-2 flex items-center gap-2">
          <LuLink className="h-4 w-4 text-zinc-400" />
          <Link
            href={page.link}
            target="_blank"
            className="border-0 p-0 text-sm text-zinc-500 !opacity-100 shadow-none placeholder:text-zinc-400 focus-visible:ring-transparent min-[1360px]:text-base"
          >
            {page.link.replace(/^[a-zA-Z]+:\/\/|\/$/g, "")}
          </Link>
        </div>
      )}
    </div>
  );
};

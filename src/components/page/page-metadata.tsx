"use client";

import { type Page } from "@prisma/client";
import React, { useEffect, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { api } from "@/trpc/react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  METADATA_DESC_SANITIZED_MAX_LENGTH,
  METADATA_NAME_SANITIZED_MAX_LENGTH,
  metadataDomPurifyConfig,
} from "@/lib/constants";
import { ContentEditable } from "../ui/content-editable";
import { type ContentEditableEvent } from "react-contenteditable";
import { toast } from "sonner";

interface PageMetadataProps {
  page: Page;
}

export const PageMetadata: React.FC<PageMetadataProps> = ({ page }) => {
  const [name, setName] = useState<string | null>(page.name);
  const [desc, setDesc] = useState<string | null>(page.description);
  const [inputHasChanged, setInputHasChanged] = useState<boolean>(false);

  const [debouncedName] = useDebounce(name, 1000);
  const [debouncedDesc] = useDebounce(desc, 1000);

  const sanitizeAndSetContent = (
    e: ContentEditableEvent,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    if (!inputHasChanged) setInputHasChanged(true);

    const rawContent = e.target.value;
    const sanitizedContent =
      rawContent === "" || rawContent === "<br>"
        ? null
        : DOMPurify.sanitize(rawContent, metadataDomPurifyConfig);
    setter(sanitizedContent);
  };

  const { mutate } = api.page.updatePageMetadata.useMutation({
    onError: (e) => {
      if (e.data?.httpStatus === 400) {
        toast.error(
          "Page details couldn't be saved because one or more fields is over the character limit.",
        );
        return;
      }

      toast.error(
        "An unexpected error occurred while saving page details. Please try again.",
      );
    },
  });

  useEffect(() => {
    if (inputHasChanged) {
      mutate({
        pageId: page.id,
        metadata: {
          name: debouncedName,
          desc: debouncedDesc,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName, debouncedDesc, mutate, page]);

  return (
    <div className="flex flex-col gap-0">
      <ContentEditable
        html={name ?? ""}
        placeholder="Page Name"
        onChange={(e) => sanitizeAndSetContent(e, setName)}
        className="text-[32px] font-bold leading-[120%] tracking-[-1px] xl:text-[44px] xl:tracking-[-2px]"
        role="textbox"
        tabIndex={0}
        sanitizedMaxLength={METADATA_NAME_SANITIZED_MAX_LENGTH}
      />
      <ContentEditable
        className="mt-3 text-zinc-600 md:text-xl xl:mt-3"
        placeholder="Page bio..."
        role="textbox"
        onChange={(e) => sanitizeAndSetContent(e, setDesc)}
        html={desc ?? ""}
        tabIndex={0}
        sanitizedMaxLength={METADATA_DESC_SANITIZED_MAX_LENGTH}
      />
    </div>
  );
};

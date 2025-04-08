"use client";

import { type Page } from "@prisma/client";
import React, { useEffect, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { api } from "@/trpc/react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  METADATA_DESC_SANITIZED_MAX_LENGTH,
  METADATA_TITLE_SANITIZED_MAX_LENGTH,
  METADATA_DOM_PURIFY_CONFIG,
} from "@/lib/constants";
import { ContentEditable } from "../../../ui/content-editable";
import { type ContentEditableEvent } from "react-contenteditable";
import { toast } from "sonner";
import { LuLink } from "react-icons/lu";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { useMaxLengthFromRichText } from "@/lib/hooks/use-sanitized-max-length";
import { useUrlValidation } from "@/lib/hooks/use-url-validation";
import { CharsLeft } from "./chars-left";

interface EditablePageMetadataProps {
  page: Page;
}

export const EditablePageMetadata: React.FC<EditablePageMetadataProps> = ({
  page,
}) => {
  // STATE
  const [title, setTitle] = useState<string | null>(page.title);
  const [desc, setDesc] = useState<string | null>(page.description);
  const [link, setLink] = useState<string | null>(page.link);
  const [inputHasChanged, setInputHasChanged] = useState<boolean>(false);

  // CUSTOM HOOKS
  const [debouncedTitle] = useDebounce(title, 1000);
  const [debouncedDesc] = useDebounce(desc, 1000);
  const [debouncedLink] = useDebounce(link, 1000);

  const {
    charsLeft: titleCharsLeft,
    displayCharsLeft: displayTitleCharsLeft,
    isPastMaxLength: isTitlePastMaxLength,
  } = useMaxLengthFromRichText(
    title ?? "",
    METADATA_TITLE_SANITIZED_MAX_LENGTH,
  );
  const {
    charsLeft: descCharsLeft,
    displayCharsLeft: displayDescCharsLeft,
    isPastMaxLength: isDescPastMaxLength,
  } = useMaxLengthFromRichText(desc ?? "", METADATA_DESC_SANITIZED_MAX_LENGTH);
  const isUrlValid = useUrlValidation(link);

  const sanitizeAndSetContent = (
    e: ContentEditableEvent,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    const rawContent = e.target.value;
    const sanitizedContent =
      rawContent === "" || rawContent === "<br>"
        ? null
        : DOMPurify.sanitize(rawContent, METADATA_DOM_PURIFY_CONFIG);
    setter(sanitizedContent);
  };

  const { mutate } = api.page.updatePageMetadata.useMutation({
    onError: () => {
      toast.error(
        "An unexpected error occurred while saving your changes. Please try again.",
      );
    },
  });

  useEffect(() => {
    if (!inputHasChanged) {
      setInputHasChanged(true);
      return;
    }

    if (!isUrlValid || isTitlePastMaxLength || isDescPastMaxLength) {
      toast.error(
        "Your changes could not be saved because some fields are invalid.",
      );
      return;
    }

    mutate({
      pageId: page.id,
      metadata: {
        title: debouncedTitle,
        desc: debouncedDesc,
        link: debouncedLink,
      },
    });

    toast.success("Your changes have been saved.");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedDesc, debouncedLink, mutate, page]);

  return (
    <div className="flex flex-col">
      <ContentEditable
        html={title ?? ""}
        placeholder="Page Title"
        onChange={(e) => sanitizeAndSetContent(e, setTitle)}
        className="text-[32px] font-bold leading-[120%] tracking-[-1px] min-[1360px]:text-[44px] min-[1360px]:tracking-[-2px]"
        role="textbox"
        tabIndex={0}
      />
      {displayTitleCharsLeft && <CharsLeft charsLeft={titleCharsLeft} />}
      <ContentEditable
        className="mt-3 text-zinc-600 min-[1360px]:mt-3 min-[1360px]:text-xl"
        placeholder="Page bio..."
        role="textbox"
        onChange={(e) => sanitizeAndSetContent(e, setDesc)}
        html={desc ?? ""}
        tabIndex={0}
      />
      {displayDescCharsLeft && <CharsLeft charsLeft={descCharsLeft} />}
      <div className="mt-2 flex items-center gap-2">
        <Label htmlFor="link">
          <LuLink className="h-4 w-4 text-zinc-400" />
        </Label>
        <Input
          type="text"
          id="link"
          value={link ?? ""}
          placeholder="mycompany.com"
          onChange={(e) => setLink(e.target.value)}
          className="border-0 p-0 text-sm text-zinc-500 shadow-none placeholder:text-zinc-400 focus-visible:ring-transparent min-[1360px]:text-base"
        />
      </div>
      {!isUrlValid && (
        <p className="text-sm text-red-500">This link is invalid.</p>
      )}
    </div>
  );
};

import { type TitleConfig } from "@/store/types";
import { EditableBlockContainer } from "./editable-block-container";
import { ContentEditable } from "@/components/ui/content-editable";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/use-debounce";
import React, { useEffect, useState } from "react";
import { BLOCK_DATA_DOM_PURIFY_CONFIG } from "@/lib/constants";
import { sanitizeAndSetContentNoLineBreaks } from "@/lib/utils/client/sanitize";
import { api } from "@/trpc/react";
import { BlockSize } from "./types";

interface EditableTitleBlockProps {
  pageId: string;
  blockKey: string;
  config: TitleConfig;
}

export const EditableTitleBlock: React.FC<EditableTitleBlockProps> = ({
  pageId,
  blockKey,
  config,
}) => {
  // STATE
  const [title, setTitle] = useState<string | null>(config.title);
  const [inputHasChanged, setInputHasChanged] = useState<boolean>(false);

  // HOOKS
  const [debouncedTitle] = useDebounce(title, 1000);

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

    // @todo: implement API route
    /*
    mutate({
      pageId: page.id,
      metadata: {
        title: debouncedTitle,
        data: debouncedData,
        desc: debouncedDesc,
      },
    });
    */

    toast.success("Your changes have been saved.");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, mutate, pageId]);

  return (
    <EditableBlockContainer
      blockKey={blockKey}
      pageId={pageId}
      allowedBlockSizes={[BlockSize.TITLE]}
    >
      <div className="no-scrollbar title-block w-full min-w-0 overflow-x-auto whitespace-nowrap">
        <ContentEditable
          html={title ?? ""}
          placeholder="Section Title"
          onChange={(e) =>
            sanitizeAndSetContentNoLineBreaks(
              e,
              BLOCK_DATA_DOM_PURIFY_CONFIG,
              setTitle,
            )
          }
          className="text-2xl font-bold text-black"
          role="textbox"
          tabIndex={0}
        />
      </div>
    </EditableBlockContainer>
  );
};

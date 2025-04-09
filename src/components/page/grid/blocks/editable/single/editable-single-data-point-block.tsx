import { type SingleDataPointConfig } from "@/store/types";
import { EditableBlockContainer } from "../editable-block-container";
import { ContentEditable } from "@/components/ui/content-editable";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { BLOCK_DATA_DOM_PURIFY_CONFIG } from "@/lib/constants";
import { toast } from "sonner";
import { sanitizeAndSetContentNoLineBreaks } from "@/lib/utils/client/sanitize";
import { api } from "@/trpc/react";
import { BlockSize } from "../types";
import { WebhookInstructions } from "./webhook-instructions";

interface EditableSingleDataPointBlockProps {
  pageId: string;
  blockKey: string;
  config: SingleDataPointConfig;
}

export const EditableSingleDataPointBlock: React.FC<
  EditableSingleDataPointBlockProps
> = ({ pageId, blockKey, config }) => {
  // STATE
  const [title, setTitle] = useState<string | null>(config.title);
  const [data, setData] = useState<string | null>(config.data);
  const [desc, setDesc] = useState<string | null>(config.description);
  const [inputHasChanged, setInputHasChanged] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // HOOKS
  const [debouncedTitle] = useDebounce(title, 1000);
  const [debouncedData] = useDebounce(data, 1000);
  const [debouncedDesc] = useDebounce(desc, 1000);

  // @todo: implement with correct endpoint
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
  }, [debouncedTitle, debouncedData, debouncedDesc, mutate, pageId]);

  return (
    <EditableBlockContainer
      blockKey={blockKey}
      pageId={pageId}
      allowedBlockSizes={[BlockSize.SINGLE, BlockSize.DOUBLE]}
      setIsEditMenuOpen={setIsOpen}
    >
      <div className="no-scrollbar w-full min-w-0 overflow-x-auto whitespace-nowrap">
        <ContentEditable
          html={title ?? ""}
          placeholder="Label"
          onChange={(e) =>
            sanitizeAndSetContentNoLineBreaks(
              e,
              BLOCK_DATA_DOM_PURIFY_CONFIG,
              setTitle,
            )
          }
          className="text-sm font-medium text-zinc-700"
          role="textbox"
          tabIndex={0}
        />
      </div>
      <div className="no-scrollbar w-full min-w-0 overflow-x-auto whitespace-nowrap">
        <ContentEditable
          html={data ?? ""}
          placeholder="Value"
          onChange={(e) =>
            sanitizeAndSetContentNoLineBreaks(
              e,
              BLOCK_DATA_DOM_PURIFY_CONFIG,
              setData,
            )
          }
          className="text-4xl font-bold"
          role="textbox"
          tabIndex={0}
        />
      </div>
      <div className="no-scrollbar w-full min-w-0 overflow-y-auto">
        <ContentEditable
          html={desc ?? ""}
          placeholder="Data Description"
          onChange={(e) =>
            sanitizeAndSetContentNoLineBreaks(
              e,
              BLOCK_DATA_DOM_PURIFY_CONFIG,
              setDesc,
            )
          }
          className="text-xs font-normal text-zinc-600"
          role="textbox"
          tabIndex={0}
        />
      </div>
      <EditableBlockContainer.OptionsDialog
        title="Populate Block Data"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <WebhookInstructions
          blockKey={blockKey}
          onClose={() => setIsOpen(false)}
        />
      </EditableBlockContainer.OptionsDialog>
    </EditableBlockContainer>
  );
};

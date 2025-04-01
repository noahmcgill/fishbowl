import { type SingleDataPointConfig } from "@/store/types";
import DOMPurify from "isomorphic-dompurify";
import { EditableBlockContainer } from "./editable-block-container";
import { ContentEditable } from "@/components/ui/content-editable";
import { useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { type ContentEditableEvent } from "react-contenteditable";
import { blockDataDomPurifyConfig } from "@/lib/constants";

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

  // CUSTOM HOOKS
  const [debouncedTitle] = useDebounce(title, 1000);
  const [debouncedData] = useDebounce(data, 1000);
  const [debouncedDesc] = useDebounce(desc, 1000);

  const sanitizeAndSetContent = (
    e: ContentEditableEvent,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    const rawContent = e.target.value
      .replace(/<div>\s*<br\s*\/?>\s*<\/div>/g, " ")
      .replace(/<br\s*\/?>/g, " ");

    const sanitizedContent =
      rawContent === ""
        ? null
        : DOMPurify.sanitize(rawContent, blockDataDomPurifyConfig);
    setter(sanitizedContent);
  };

  // TODO: Add API call to save data


  return (
    <EditableBlockContainer
      blockKey={blockKey}
      pageId={pageId}
      allowedBlockSizes={{
        SINGLE: true,
        DOUBLE: true,
        ROW: false,
        TXT: false,
        FXT: false,
      }}
    >
      <div className="w-full min-w-0 overflow-x-auto whitespace-nowrap no-scrollbar">
        <ContentEditable
          html={title ?? ""}
          placeholder="Label"
          onChange={(e) => sanitizeAndSetContent(e, setTitle)}
          className="text-sm font-medium text-zinc-700"
          role="textbox"
          tabIndex={0}
        />
      </div>
      <div className="w-full min-w-0 overflow-x-auto whitespace-nowrap no-scrollbar">
        <ContentEditable
          html={data ?? ""}
          placeholder="Value"
          onChange={(e) => sanitizeAndSetContent(e, setData)}
          className="text-4xl font-bold"
          role="textbox"
          tabIndex={0}
        />
      </div>
      <div className="w-full min-w-0 overflow-x-auto whitespace-nowrap no-scrollbar">
        <ContentEditable
          html={desc ?? ""}
          placeholder="Data Description"
          onChange={(e) => sanitizeAndSetContent(e, setDesc)}
          className="text-xs font-normal text-zinc-600"
          role="textbox"
          tabIndex={0}
        />
      </div>
    </EditableBlockContainer>
  );
};

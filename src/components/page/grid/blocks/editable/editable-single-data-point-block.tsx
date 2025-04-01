import { type SingleDataPointConfig } from "@/store/types";
import { EditableBlockContainer } from "./editable-block-container";

interface EditableSingleDataPointBlockProps {
  pageId: string;
  blockKey: string;
  config: SingleDataPointConfig;
}

export const EditableSingleDataPointBlock: React.FC<
  EditableSingleDataPointBlockProps
> = ({ pageId, blockKey, config }) => {
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
      <div className="text-sm font-medium text-zinc-700">{config.title}</div>
      <div className="w-full">
        <div className="whitespace-nowrap text-4xl font-bold">
          {config.data}
        </div>
      </div>
      {config.description && (
        <div className="text-xs font-normal text-zinc-600">
          {config.description}
        </div>
      )}
    </EditableBlockContainer>
  );
};

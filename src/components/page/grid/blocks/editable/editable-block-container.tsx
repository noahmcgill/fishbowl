import { Button } from "@/components/ui/button";
import { gridStateAtom } from "@/store";
import { type GridState } from "@/store/types";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { type Layout } from "react-grid-layout";
import { MdOutlineDragIndicator } from "react-icons/md";
import { toast } from "sonner";
import { BlockSize, type AllowedBlockSizes } from "./types";
import { BlockPanel } from "./block-panel";
import { getBlockSizeFromWH } from "@/lib/utils/client/grid";
import { BLOCK_SIZE_MAP } from "@/lib/constants";

interface EditableBlockContainerProps {
  pageId: string;
  blockKey: string;
  children: React.ReactNode;
  allowedBlockSizes: AllowedBlockSizes;
}

export const EditableBlockContainer: React.FC<EditableBlockContainerProps> = ({
  pageId,
  blockKey,
  children,
  allowedBlockSizes,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [gridState, setGridState] = useAtom(gridStateAtom);

  const memoizedBlock = useMemo(() => {
    return gridState.layouts.lg?.find((block) => block.i === blockKey);
  }, [blockKey, gridState.layouts.lg]);
  const [currentSize, setCurrentSize] = useState<BlockSize>(
    getBlockSizeFromWH({
      w: memoizedBlock?.w ?? 0,
      h: memoizedBlock?.h ?? 0,
    }),
  );

  const { mutateAsync } = api.page.updateGridState.useMutation({
    onError: () => {
      toast.error(
        "Unable to update grid. Please refresh the page and try again.",
      );
    },
  });

  const handleDeleteBlock = async () => {
    const filterBlock = (layout?: Layout[]) =>
      (layout ?? []).filter((l) => l.i !== blockKey);

    const newGridState: GridState = {
      widgets: gridState.widgets.filter(({ key }) => key !== blockKey),
      layouts: {
        lg: filterBlock(gridState.layouts.lg),
        md: filterBlock(gridState.layouts.md),
      },
    };

    setGridState(newGridState);
    await mutateAsync({ pageId, gridState: newGridState });
  };

  const handleChangeBlockSize = async (size: BlockSize) => {
    const updateLayout = (breakpoint: "lg" | "md", layout?: Layout[]) =>
      (layout ?? []).map((l) =>
        l.i === blockKey ? { ...l, ...BLOCK_SIZE_MAP[size][breakpoint] } : l,
      );

    const newGridState: GridState = {
      widgets: gridState.widgets,
      layouts: {
        lg: updateLayout("lg", gridState.layouts.lg),
        md: updateLayout("md", gridState.layouts.md),
      },
    };

    await mutateAsync({ pageId, gridState: newGridState });
    setGridState(newGridState);
    setCurrentSize(size);
  };

  return (
    <div
      className={`flex h-full w-full animate-fadeIn flex-col justify-center gap-2 rounded-3xl border-[1px] p-8 transition-all hover:border-slate-200 hover:shadow-[0_2px_4px_rgba(0,0,0,.04)] active:bg-white ${currentSize !== BlockSize.TITLE ? "border-slate-200 shadow-[0_2px_4px_rgba(0,0,0,.04)]" : "shadow-0 border-white px-8 py-6"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      key={blockKey}
    >
      {children}
      {isHovered && (
        <div className="absolute left-[-14px] top-[-14px] flex w-full justify-between px-2">
          <Button
            variant="outline"
            className="drag-handle cursor-grab rounded-full bg-white p-2 shadow-md active:cursor-grabbing"
          >
            <MdOutlineDragIndicator className="h-5 w-5" />
          </Button>
        </div>
      )}
      {isHovered && (
        <BlockPanel
          handleChange={handleChangeBlockSize}
          handleDelete={handleDeleteBlock}
          allowedSizes={allowedBlockSizes}
          currentSize={currentSize}
          showSizeSelector={currentSize !== BlockSize.TITLE}
        />
      )}
    </div>
  );
};

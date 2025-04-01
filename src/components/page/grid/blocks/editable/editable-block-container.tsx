import { Button } from "@/components/ui/button";
import { gridStateAtom } from "@/store";
import { type GridState } from "@/store/types";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { type Layout } from "react-grid-layout";
import { MdOutlineDragIndicator } from "react-icons/md";
import { toast } from "sonner";
import {
  type ResponsiveWH,
  type AllowedBlockSizes,
  BlockSize,
  type WH,
} from "./types";
import { SizeSelector } from "./size-selector";

const BLOCK_SIZE_MAP: Record<BlockSize, ResponsiveWH> = {
  SINGLE: {
    lg: { w: 1, h: 1 },
    md: { w: 1, h: 1 },
  },
  DOUBLE: {
    lg: { w: 2, h: 1 },
    md: { w: 2, h: 1 },
  },
  ROW: {
    lg: { w: 4, h: 1 },
    md: { w: 2, h: 1 },
  },
  TXT: {
    lg: { w: 2, h: 2 },
    md: { w: 2, h: 2 },
  },
  FXT: {
    lg: { w: 4, h: 2 },
    md: { w: 2, h: 2 },
  },
};

const WH_SIZE_MAP: Record<string, BlockSize> = {
  "1,1": BlockSize.SINGLE,
  "2,1": BlockSize.DOUBLE,
  "4,1": BlockSize.ROW,
  "2,2": BlockSize.TXT,
};

const getBlockSizeFromWH = (wh: WH): BlockSize =>
  WH_SIZE_MAP[`${wh.w},${wh.h}`] ?? BlockSize.FXT;

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
      className="flex h-full w-full flex-col justify-center gap-2 rounded-3xl border-[1px] border-slate-200 p-8 shadow-[0_2px_4px_rgba(0,0,0,.04)] active:bg-white"
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
        <SizeSelector
          handleChange={handleChangeBlockSize}
          handleDelete={handleDeleteBlock}
          allowedSizes={allowedBlockSizes}
          currentSize={currentSize}
        />
      )}
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { gridStateAtom } from "@/store";
import { type GridState } from "@/store/types";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import { useState } from "react";
import { LuTrash } from "react-icons/lu";
import { toast } from "sonner";

interface AllowedBlockSizes {
  single?: boolean; // 1x1
  double?: boolean; // 2x1
  row?: boolean; // 4x1
  txt?: boolean; // 2x2
  fxf?: boolean; // 4x4
}

interface EditableBlockContainerProps {
  pageId: string;
  blockKey: string;
  children: React.ReactNode;
  allowedBlockSizes?: AllowedBlockSizes;
}

export const EditableBlockContainer: React.FC<EditableBlockContainerProps> = ({
  pageId,
  blockKey,
  children,
  // allowedBlockSizes,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [gridState, setGridState] = useAtom(gridStateAtom);

  const { mutateAsync } = api.page.updateGridState.useMutation({
    onError: () => {
      toast.error(
        "Unable to update grid. Please refresh the page and try again.",
      );
    },
  });

  const handleDeleteBlock = async () => {
    const newGridState: GridState = {
      widgets: gridState.widgets.filter((widget) => widget.key !== blockKey),
      layouts: {
        lg: (gridState.layouts.lg ?? []).filter(
          (layout) => layout.i !== blockKey,
        ),
        md: (gridState.layouts.md ?? []).filter(
          (layout) => layout.i !== blockKey,
        ),
      },
    };

    setGridState(newGridState);

    await mutateAsync({
      pageId,
      gridState: newGridState,
    });
  };

  return (
    <div
      className="flex h-full w-full cursor-grab flex-col justify-center gap-2 rounded-3xl border-[1px] border-slate-200 p-8 shadow-[0_2px_4px_rgba(0,0,0,.04)] active:cursor-grabbing active:bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      key={blockKey}
    >
      {children}
      {isHovered && (
        <div className="absolute left-[-14px] top-[-14px] flex w-full justify-between px-2 no-drag">
          <Button
            variant="outline"
            className="rounded-full bg-white p-2 shadow-md"
            onClick={async () => await handleDeleteBlock()}
          >
            <LuTrash className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

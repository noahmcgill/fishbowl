"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { gridStateAtom } from "@/store";
import { useAtom } from "jotai";
import { LuPlus, LuCircleDotDashed } from "react-icons/lu";
import { createId } from "@paralleldrive/cuid2";
import { ConfigType, type SingleDataPointConfig } from "@/store/types";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface AddWidgetDropdownProps {
  pageId: string;
}

export const AddWidgetDropdown: React.FC<AddWidgetDropdownProps> = ({
  pageId,
}) => {
  const [gridState, setGridState] = useAtom(gridStateAtom);

  const { mutateAsync } = api.page.updateGridState.useMutation({
    onError: () => {
      toast.error("Unable to add widget to grid. Please try again.");
    },
  });

  const handleAddSingleDataPoint = async (config: SingleDataPointConfig) => {
    const key = createId();
    const newGridState = {
      widgets: [
        ...gridState.widgets,
        {
          key,
          config,
        },
      ],
      layouts: {
        lg: [
          ...gridState.layouts.lg!,
          { i: key, x: 0, y: Infinity, w: 1, h: 1, isResizable: false },
        ],
        md: [
          ...gridState.layouts.md!,
          { i: key, x: 0, y: Infinity, w: 1, h: 1, isResizable: false },
        ],
      },
    };

    setGridState(newGridState);

    await mutateAsync({
      pageId,
      gridState: newGridState,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="rounded-full">
                <LuPlus />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent
            side="top"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuItem
              onClick={() =>
                handleAddSingleDataPoint({
                  type: ConfigType.COUNT,
                  title: "New Stat",
                  description: null,
                  data: "Data",
                })
              }
              className="cursor-pointer rounded-lg p-3 text-xs text-zinc-500"
            >
              <LuCircleDotDashed />
              Single Data Point
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>Add Widget</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

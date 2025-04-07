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
import {
  LuPlus,
  LuCircleDotDashed,
  LuChartColumnIncreasing,
  LuLetterText,
} from "react-icons/lu";
import { createId } from "@paralleldrive/cuid2";
import {
  type BarChartConfig,
  ConfigType,
  type SingleDataPointConfig,
  type TitleConfig,
} from "@/store/types";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { BLOCK_SIZE_MAP } from "@/lib/constants";
import { BlockSize } from "../../grid/blocks/editable/types";

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
          {
            ...BLOCK_SIZE_MAP[BlockSize.SINGLE].lg,
            i: key,
            x: 0,
            y: Infinity,
            isResizable: false,
          },
        ],
        md: [
          ...gridState.layouts.md!,
          {
            ...BLOCK_SIZE_MAP[BlockSize.SINGLE].md,
            i: key,
            x: 0,
            y: Infinity,
            isResizable: false,
          },
        ],
      },
    };

    setGridState(newGridState);

    await mutateAsync({
      pageId,
      gridState: newGridState,
    });
  };

  const handleAddBarChart = async (config: BarChartConfig) => {
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
          {
            ...BLOCK_SIZE_MAP[BlockSize.TXT].lg,
            i: key,
            x: 0,
            y: Infinity,
            isResizable: false,
          },
        ],
        md: [
          ...gridState.layouts.md!,
          {
            ...BLOCK_SIZE_MAP[BlockSize.TXT].md,
            i: key,
            x: 0,
            y: Infinity,
            isResizable: false,
          },
        ],
      },
    };

    setGridState(newGridState);

    await mutateAsync({
      pageId,
      gridState: newGridState,
    });
  };

  const handleAddTitle = async (config: TitleConfig) => {
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
          {
            ...BLOCK_SIZE_MAP[BlockSize.TITLE].lg,
            i: key,
            x: 0,
            y: Infinity,
            isResizable: false,
          },
        ],
        md: [
          ...gridState.layouts.md!,
          {
            ...BLOCK_SIZE_MAP[BlockSize.TITLE].md,
            i: key,
            x: 0,
            y: Infinity,
            isResizable: false,
          },
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
            <DropdownMenuItem
              onClick={() =>
                handleAddBarChart({
                  type: ConfigType.BAR,
                  title: "Bar Chart",
                  description: null,
                  data: {
                    labels: [],
                    datasets: [],
                    /*
                    datasets: [
                      {
                        label: "",
                        data: [],
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                        borderWidth: 0,
                        barThickness: 6,
                      },
                    ],
                    */
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        enabled: true,
                      },
                    },
                    scales: {
                      x: {
                        ticks: { color: "black" },
                        grid: { display: false },
                      },
                      y: {
                        ticks: { color: "black" },
                        grid: { color: "transparent" },
                      },
                    },
                  },
                })
              }
              className="cursor-pointer rounded-lg p-3 text-xs text-zinc-500"
            >
              <LuChartColumnIncreasing />
              Bar Chart
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleAddTitle({
                  type: ConfigType.TITLE,
                  title: "Title",
                  description: null,
                })
              }
              className="cursor-pointer rounded-lg p-3 text-xs text-zinc-500"
            >
              <LuLetterText />
              Title
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>Add Widget</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

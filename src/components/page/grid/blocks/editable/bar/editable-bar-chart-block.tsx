import { type BarChartConfig } from "@/store/types";
import { EditableBlockContainer } from "../editable-block-container";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  type Plugin,
} from "chart.js";
import { ContentEditable } from "@/components/ui/content-editable";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/use-debounce";
import React, { useEffect, useState } from "react";
import { BLOCK_DATA_DOM_PURIFY_CONFIG } from "@/lib/constants";
import { sanitizeAndSetContentNoLineBreaks } from "@/lib/utils/client/sanitize";
import { api } from "@/trpc/react";
import { LuBrush, LuUpload } from "react-icons/lu";
import { type BarChartBlockOption } from "../block-panel";
import { BlockSize } from "../types";
import { BarChartOptionsTabs } from "./bar-chart-options-tabs";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const noDataPlugin: Plugin<"bar"> = {
  id: "noDataMessage",
  afterDraw(chart) {
    if (chart.data.datasets.length < 1) {
      const { ctx, width, height } = chart;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgb(63, 63, 70)";
      ctx.font = "normal 16px sans-serif";
      ctx.fillText("No chart data available", width / 2, height / 2);
      ctx.restore();
    }
  },
};

interface EditableBarChartBlockProps {
  pageId: string;
  blockKey: string;
  config: BarChartConfig;
}

export const EditableBarChartBlock: React.FC<EditableBarChartBlockProps> = ({
  pageId,
  blockKey,
  config,
}) => {
  const BarChartBlockOptions: BarChartBlockOption[] = [
    {
      label: "Change chart colors",
      icon: <LuBrush />,
      action: () => console.log("changing colors"),
    },
    {
      label: "Add new data",
      icon: <LuUpload />,
      action: () => console.log("adding new data"),
    },
  ];

  // STATE
  const [title, setTitle] = useState<string | null>(config.title);
  const [desc, setDesc] = useState<string | null>(config.description);
  const [inputHasChanged, setInputHasChanged] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // HOOKS
  const [debouncedTitle] = useDebounce(title, 1000);
  const [debouncedDesc] = useDebounce(desc, 1000);

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
  }, [debouncedTitle, debouncedDesc, mutate, pageId]);

  return (
    <EditableBlockContainer
      blockKey={blockKey}
      pageId={pageId}
      allowedBlockSizes={[BlockSize.TXT, BlockSize.FXT]}
      setIsEditMenuOpen={setIsOpen}
    >
      <div className="no-scrollbar w-full min-w-0 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-4">
        <ContentEditable
          html={title ?? ""}
          placeholder="Chart Title"
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
      <div className="h-full w-full self-center">
        <Bar
          data={config.data}
          options={{
            ...config.options,
            scales: {
              x: {
                ...config.options.scales?.x,
                display: config.data.datasets.length > 0,
              },
              y: {
                ...config.options.scales?.y,
                display: config.data.datasets.length > 0,
              },
            },
          }}
          plugins={[noDataPlugin]}
        />
      </div>

      <div className="no-scrollbar h-[50px] w-full min-w-0 overflow-y-auto">
        <ContentEditable
          html={desc ?? ""}
          placeholder="Chart Description"
          onChange={(e) =>
            sanitizeAndSetContentNoLineBreaks(
              e,
              BLOCK_DATA_DOM_PURIFY_CONFIG,
              setDesc,
            )
          }
          className="text-md font-md text-zinc-700"
          role="textbox"
          tabIndex={0}
        />
      </div>
      <EditableBlockContainer.OptionsDialog
        title="Bar Chart Options"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <BarChartOptionsTabs
          pageId={pageId}
          blockKey={blockKey}
          onClose={() => setIsOpen(false)}
        />
      </EditableBlockContainer.OptionsDialog>
    </EditableBlockContainer>
  );
};

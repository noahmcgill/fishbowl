import { type BarChartConfig } from "@/store/types";
import { EditableBlockContainer } from "./editable-block-container";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { ContentEditable } from "@/components/ui/content-editable";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useEffect, useState } from "react";
import { BLOCK_DATA_DOM_PURIFY_CONFIG } from "@/lib/constants";
import { sanitizeAndSetContentNoLineBreaks } from "@/lib/utils/client/sanitize";
import { api } from "@/trpc/react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

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
  // STATE
  const [title, setTitle] = useState<string | null>(config.title);
  const [desc, setDesc] = useState<string | null>(config.description);
  const [inputHasChanged, setInputHasChanged] = useState<boolean>(false);

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
      allowedBlockSizes={{
        SINGLE: false,
        DOUBLE: false,
        ROW: false,
        TXT: true,
        FXT: true,
      }}
    >
      <div className="no-scrollbar w-full min-w-0 overflow-x-auto whitespace-nowrap text-center">
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
          className="text-lg font-bold text-zinc-700"
          role="textbox"
          tabIndex={0}
        />
      </div>
      <div className="h-full w-full self-center">
        <Bar data={config.data} options={config.options} />
      </div>
      {desc && (
        <div className="no-scrollbar h-[50px] w-full min-w-0 overflow-y-auto text-center">
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
            className="text-md font-md text-center text-zinc-700"
            role="textbox"
            tabIndex={0}
          />
        </div>
      )}
    </EditableBlockContainer>
  );
};

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CsvUploader, type CsvRow } from "./csv-uploader";
import { useSetAtom } from "jotai";
import { widgetsAtom } from "@/store";
import { randomHexColor } from "@/lib/utils/random-hex-color";

interface PopulateBarChartAccordionProps {
  pageId: string;
  blockKey: string;
  onClose: () => void;
}

export const PopulateBarChartAccordion: React.FC<
  PopulateBarChartAccordionProps
> = ({ blockKey, onClose }) => {
  // ATOMS
  const setWidgets = useSetAtom(widgetsAtom);

  // ACTIONS
  const buildConfigData = (result: CsvRow[]) => {
    const data = result as string[][];
    const labels = data.slice(1).map((row) => row[0]);
    const datasets = data[0]?.slice(1).map((_, index) => ({
      label: data[0]?.[index + 1],
      data: data.slice(1).map((row) => parseFloat(row[index + 1] ?? "")),
      backgroundColor: randomHexColor(),
    }));

    return {
      labels,
      datasets,
    };
  };

  const onUpload = async (data: CsvRow[]) => {
    // @todo: mutate/persist

    setWidgets((prev) => {
      return prev.map((widget) => {
        if (widget.key !== blockKey) return widget;

        return {
          ...widget,
          config: {
            ...widget.config,
            data: buildConfigData(data),
          },
        };
      });
    });

    onClose();
  };

  return (
    <Accordion type="single">
      <AccordionItem value="webhook">
        <AccordionTrigger>Populate from webhook</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="csv">
        <AccordionTrigger>Populate from CSV</AccordionTrigger>
        <AccordionContent>
          <CsvUploader onUpload={onUpload} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

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
  const buildConfigData = (rows: CsvRow[]) => {
    const seriesNames = Object.keys(rows[0] ?? []);
    const labels = rows.map((_, idx) => `Row ${idx + 1}`);

    const datasets = seriesNames.map((seriesName) => ({
      label: seriesName,
      data: rows.map((row) => Number(row[seriesName])),
      backgroundColor: randomHexColor(),
    }));

    return {
      labels,
      datasets,
    };
  };

  const onUpload = async (rows: CsvRow[]) => {
    // @todo: mutate/persist

    setWidgets((prev) => {
      return prev.map((widget) => {
        if (widget.key !== blockKey) return widget;

        return {
          ...widget,
          config: {
            ...widget.config,
            data: buildConfigData(rows),
          },
        };
      });
    });

    onClose();
  };

  return (
    <Accordion type="single" collapsible>
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

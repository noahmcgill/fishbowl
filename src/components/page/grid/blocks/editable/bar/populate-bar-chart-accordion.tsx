import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CsvUploader, type CsvRow } from "./csv-uploader";
import { useSetAtom } from "jotai";
import { widgetsAtom } from "@/store";
import { WebhookInstructions } from "./webhook-instructions";
import { csvToBarChartData } from "@/lib/utils/csv";

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
  const onUpload = async (data: CsvRow[]) => {
    // @todo: mutate/persist

    setWidgets((prev) => {
      return prev.map((widget) => {
        if (widget.key !== blockKey) return widget;

        return {
          ...widget,
          config: {
            ...widget.config,
            data: csvToBarChartData(data),
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
          <WebhookInstructions blockKey={blockKey} />
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

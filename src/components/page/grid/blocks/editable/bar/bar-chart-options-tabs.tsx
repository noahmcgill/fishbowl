import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CsvUploader, { CsvRow } from "./csv-uploader";
import { PopulateBarChartAccordion } from "./populate-bar-chart-accordion";

interface BarChartOptionsTabsProps {
  pageId: string;
  blockKey: string;
  onClose: () => void;
}

export const BarChartOptionsTabs: React.FC<BarChartOptionsTabsProps> = ({
  pageId,
  blockKey,
  onClose,
}) => {
  return (
    <div className="flex w-full flex-col">
      <Tabs defaultValue="populate" className="w-full">
        <TabsList className="grid w-full grid-cols-2 items-center">
          <TabsTrigger value="populate">Populate Data</TabsTrigger>
          <TabsTrigger value="customize">Customize Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="populate">
          <PopulateBarChartAccordion
            onClose={onClose}
            pageId={pageId}
            blockKey={blockKey}
          />
        </TabsContent>
        <TabsContent value="customize">Customize Appearance</TabsContent>
      </Tabs>
    </div>
  );
};

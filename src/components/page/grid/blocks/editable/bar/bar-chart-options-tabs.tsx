import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PopulateBarChartAccordion } from "./populate-bar-chart-accordion";
import { BarChartAppearanceSettings } from "./bar-chart-appearance-settings";

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
          <p className="mt-6 text-sm">
            There are two methods for populating chart data: webhooks and CSVs.
            You can find instructions for each method below.
          </p>
          <PopulateBarChartAccordion
            onClose={onClose}
            pageId={pageId}
            blockKey={blockKey}
          />
        </TabsContent>
        <TabsContent value="customize">
          <BarChartAppearanceSettings blockKey={blockKey} onClose={onClose} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

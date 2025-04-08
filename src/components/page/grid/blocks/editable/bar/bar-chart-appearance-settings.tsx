import ColorPicker from "@/components/ui/color-picker";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { type BarChartConfig } from "@/store/types";
import { useAtom } from "jotai";
import { widgetsAtom } from "@/store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface BarChartAppearanceSettingsProps {
  blockKey: string;
  onClose: () => void;
}

export const BarChartAppearanceSettings: React.FC<
  BarChartAppearanceSettingsProps
> = ({ blockKey, onClose }) => {
  // STATE
  const [widgets, setWidgets] = useAtom(widgetsAtom);
  const widget = widgets.find((w) => w.key === blockKey);

  // ACTIONS
  const handleColorChange = (seriesIndex: number, newColor: string) => {
    // @todo: mutate/persist

    setWidgets((prev) => {
      return prev.map((w) => {
        if (w.key !== blockKey) return w;

        const config = w.config as BarChartConfig;

        return {
          ...w,
          config: {
            ...config,
            data: {
              ...config.data,
              datasets: config.data.datasets.map((d, i) => {
                if (i !== seriesIndex) return d;

                return {
                  ...d,
                  backgroundColor: newColor,
                };
              }),
            },
          },
        };
      });
    });

    toast.success("Color change saved!");
  };

  return (
    <div className="mt-6 w-full justify-items-end">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 border-0 shadow-none">
        <p className="font-medium">Data Series Colors</p>
        <p className="text-sm">
          Choose the colors for your chart&apos;s data series below.
        </p>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {((widget?.config as BarChartConfig).data.datasets ?? []).map(
                (series, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      {series.label}
                    </TableCell>
                    <TableCell>
                      <ColorPicker
                        color={
                          typeof series.backgroundColor === "string"
                            ? series.backgroundColor
                            : undefined
                        }
                        onChange={(color) => handleColorChange(i, color)}
                        name={`color-${i}`}
                      />
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Button onClick={onClose} className="mt-2">
        Done
      </Button>
    </div>
  );
};

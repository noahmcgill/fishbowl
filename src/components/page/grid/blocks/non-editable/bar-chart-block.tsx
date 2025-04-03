import { type BarChartConfig } from "@/store/types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { BlockContainer } from "./block-container";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

interface BarChartBlockProps {
  blockKey: string;
  config: BarChartConfig;
}

export const BarChartBlock: React.FC<BarChartBlockProps> = ({
  blockKey,
  config,
}) => {
  return (
    <BlockContainer blockKey={blockKey}>
      <div className="w-full text-center text-lg font-bold text-zinc-700">
        {config.title}
      </div>
      <div className="h-full w-full self-center">
        <Bar data={config.data} options={config.options} />
      </div>
      {config.description && (
        <div className="text-md font-md w-full text-center text-zinc-700">
          {config.description}
        </div>
      )}
    </BlockContainer>
  );
};

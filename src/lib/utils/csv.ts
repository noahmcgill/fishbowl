import { type CsvRow } from "@/components/page/grid/blocks/editable/bar/csv-uploader";
import {
  type ChartType,
  type DefaultDataPoint,
  type ChartData,
} from "chart.js";
import { randomHexColor } from "./random-hex-color";
import { type BarChartConfig, type Widget } from "@/store/types";

export const isCsvDataNumeric = (data: string[][]): boolean => {
  if (data.length <= 1) {
    return true;
  }

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    if (!row) {
      continue;
    }

    for (const cell of row) {
      if (isNaN(Number(cell))) {
        return false; // Return false if any cell is not a number
      }
    }
  }

  return true;
};

export const barChartDataToCsv = (
  data: ChartData<"bar", DefaultDataPoint<ChartType>, unknown>,
): CsvRow[] => {
  let labels: string[] = [];

  try {
    labels = data.labels as string[];
  } catch (e) {
    console.error(e);
    throw new Error("Labels not present in data state");
  }

  const rows: CsvRow[] = [["Label", ...labels]];

  for (const dataset of data.datasets) {
    const label = dataset.label ?? "";
    const datapoints = dataset.data.map((d) => {
      if (!d) {
        throw new Error("Data point is null");
      }

      return (d as number).toString();
    });
    rows.push([label, ...datapoints]);
  }

  return rows;
};

type Datasets =
  | { label: string | undefined; data: number[]; backgroundColor: string }[]
  | undefined;

export const csvToBarChartData = (
  data: string[][],
): ChartData<"bar", DefaultDataPoint<ChartType>, unknown> => {
  const labels = data.slice(1).map((row) => row[0]);

  let datasets: Datasets = [];

  if (data.length > 0) {
    datasets = data[0]?.slice(1).map((_, index) => ({
      label: data[0]?.[index + 1],
      data: data.slice(1).map((row) => parseFloat(row[index + 1] ?? "")),
      backgroundColor: randomHexColor(),
    }));
  }

  return {
    labels,
    datasets: datasets ?? [],
  };
};

export const getConfigWithPersistedColors = (
  existingWidget: Widget<BarChartConfig>,
  components: ReturnType<typeof csvToBarChartData>,
) => {
  const { labels, datasets } = components;

  return {
    labels,
    datasets: datasets.map((dataset, i) => {
      return {
        ...dataset,
        backgroundColor:
          existingWidget.config.data.datasets[i]?.backgroundColor ??
          randomHexColor(),
      };
    }),
  };
};

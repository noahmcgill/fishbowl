import {
  type ChartData,
  type ChartOptions,
  type ChartType,
  type DefaultDataPoint,
} from "chart.js";
import { type Layouts } from "react-grid-layout";

// @note: this will change based on widget type
export type WidgetConfig = Record<string, string>;

export enum ConfigType {
  COUNT = "COUNT",
  BAR = "BAR",
  TITLE = "TITLE",
}

export interface BaseConfig {
  type: ConfigType;
  title: string;
  description: string | null;
}

export interface SingleDataPointConfig extends BaseConfig {
  type: ConfigType.COUNT;
  data: string | null;
}

export interface Widget {
  key: string;
  config: SingleDataPointConfig | BaseConfig;
}

export interface GridState {
  widgets: Widget[];
  layouts: Layouts;
}

export interface BarChartConfig extends BaseConfig {
  type: ConfigType.BAR;
  data: ChartData<"bar", DefaultDataPoint<ChartType>, unknown>;
  options: ChartOptions<"bar">;
}

export interface TitleConfig extends BaseConfig {
  type: ConfigType.TITLE;
}

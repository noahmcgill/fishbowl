import { type Layouts } from "react-grid-layout";

// @note: this will change based on widget type
export type WidgetConfig = Record<string, string>;

export enum ConfigType {
  COUNT = "COUNT",
}

export interface BaseConfig {
  type: ConfigType;
  title: string;
  description: string | null;
}

export interface SingleDataPointConfig extends BaseConfig {
  type: ConfigType.COUNT;
  data: number | string | null;
}

export interface Widget {
  key: string;
  config: SingleDataPointConfig | BaseConfig;
}

export interface GridState {
  widgets: Widget[];
  layouts: Layouts;
}

import { type Layouts } from "react-grid-layout";

// @note: this will change based on widget type
export type WidgetConfig = Record<string, string>;

export interface Widget {
  key: string;
  config: WidgetConfig;
}

export interface GridState {
  widgets: Widget[];
  layouts: Layouts;
}

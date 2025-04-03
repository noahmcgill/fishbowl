"use client";

import React, { type ComponentClass, useMemo } from "react";
import {
  Responsive,
  type ResponsiveProps,
  WidthProvider,
  type WidthProviderProps,
} from "react-grid-layout";
import { CheckConfig } from "@/lib/utils/store";
import { type JsonObject } from "@prisma/client/runtime/library";
import { type GridState } from "@/store/types";
import { SingleDataPointBlock } from "./single-data-point-block";
import { BarChartBlock } from "./bar-chart-block";

type ResponsiveGridType = ComponentClass<
  ResponsiveProps & WidthProviderProps,
  unknown
>;

interface EditableGridStateProps {
  pageId: string;
  gridState: JsonObject;
}

export const Grid: React.FC<EditableGridStateProps> = ({
  pageId,
  gridState,
}) => {
  const gridStateCast = gridState as unknown as GridState;

  const ResponsiveReactGridLayout = useMemo<ResponsiveGridType>(
    () => WidthProvider(Responsive),
    [],
  );

  return (
    <div>
      <ResponsiveReactGridLayout
        className="m-[-40px] animate-fadeIn-1.5s"
        breakpoints={{ lg: 768, md: 0 }}
        cols={{ lg: 4, md: 2 }}
        rowHeight={175}
        layouts={gridStateCast.layouts}
        margin={[40, 40]}
        isDraggable={false}
      >
        {gridStateCast.widgets.map((widget) => {
          if (CheckConfig.isSingleDataPointConfig(widget.config)) {
            return (
              <div key={widget.key}>
                <SingleDataPointBlock
                  config={widget.config}
                  blockKey={widget.key}
                  pageId={pageId}
                />
              </div>
            );
          } else if (CheckConfig.isBarChartConfig(widget.config)) {
            return (
              <div key={widget.key}>
                <BarChartBlock config={widget.config} blockKey={widget.key} />
              </div>
            );
          }

          return (
            <div
              key={widget.key}
              className="flex items-center justify-center rounded-3xl bg-white shadow-[0_2px_4px_rgba(0,0,0,.04)]"
            >
              {widget.key}
            </div>
          );
        })}
      </ResponsiveReactGridLayout>
    </div>
  );
};

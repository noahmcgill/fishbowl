"use client";

import { gridStateAtom, layoutsAtom } from "@/store";
import { useAtom, useAtomValue } from "jotai";
import React, { type ComponentClass, useMemo } from "react";
import {
  type Layout,
  type Layouts,
  Responsive,
  type ResponsiveProps,
  WidthProvider,
  type WidthProviderProps,
} from "react-grid-layout";
import { useHydrateAtoms } from "jotai/utils";
import { EditableSingleDataPointBlock } from "./single/editable-single-data-point-block";
import { CheckConfig } from "@/lib/utils/store";
import { type JsonObject } from "@prisma/client/runtime/library";
import { type GridState } from "@/store/types";
import { EditableBarChartBlock } from "./bar/editable-bar-chart-block";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { EditableTitleBlock } from "./editable-title-block";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";

type ResponsiveGridType = ComponentClass<
  ResponsiveProps & WidthProviderProps,
  unknown
>;

interface EditableGridStateProps {
  pageId: string;
  initialGridState: JsonObject;
}

export const EditableGrid: React.FC<EditableGridStateProps> = ({
  pageId,
  initialGridState,
}) => {
  const initialGridStateCast = initialGridState as unknown as GridState;

  // STATE & ATOMS
  useHydrateAtoms([[gridStateAtom, initialGridStateCast]]);
  const gridState = useAtomValue(gridStateAtom);
  const [layouts, setLayouts] = useAtom(layoutsAtom);
  const isMounted = useIsMounted();

  // HOOKS

  const ResponsiveReactGridLayout = useMemo<ResponsiveGridType>(
    () => WidthProvider(Responsive),
    [],
  );

  const { mutateAsync } = api.page.updateGridState.useMutation({
    onError: () => {
      toast.error(
        "Unable to update grid. Please refresh the page and try again.",
      );
    },
  });

  // ACTIONS
  const onLayoutChange = async (
    currentLayout: Layout[],
    allLayouts: Layouts,
  ) => {
    const newGridState: GridState = {
      widgets: gridState.widgets,
      layouts: allLayouts,
    };

    await mutateAsync({ pageId, gridState: newGridState });
    setLayouts(layouts);
  };

  return (
    <div>
      {isMounted && (
        <ResponsiveReactGridLayout
          className="m-[-40px] animate-fadeIn-1.5s"
          breakpoints={{ lg: 768, md: 0 }}
          cols={{ lg: 4, md: 2 }}
          rowHeight={175}
          layouts={layouts}
          margin={[40, 40]}
          onLayoutChange={onLayoutChange}
          draggableHandle=".drag-handle"
        >
          {gridState.widgets.map((widget) => {
            if (CheckConfig.isSingleDataPointConfig(widget.config)) {
              return (
                <div key={widget.key}>
                  <EditableSingleDataPointBlock
                    config={widget.config}
                    blockKey={widget.key}
                    pageId={pageId}
                  />
                </div>
              );
            } else if (CheckConfig.isBarChartConfig(widget.config)) {
              return (
                <div key={widget.key}>
                  <EditableBarChartBlock
                    config={widget.config}
                    blockKey={widget.key}
                    pageId={pageId}
                  />
                </div>
              );
            } else if (CheckConfig.isTitleConfig(widget.config)) {
              return (
                <div key={widget.key}>
                  <EditableTitleBlock
                    config={widget.config}
                    blockKey={widget.key}
                    pageId={pageId}
                  />
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
      )}
      <div className="h-[200px]"> </div>
    </div>
  );
};

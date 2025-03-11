"use client";

import { editableLayoutsAtom, editableWidgetsAtom } from "@/store";
import { useAtom } from "jotai";
import { type ComponentClass, useMemo } from "react";
import {
  type Layout,
  type Layouts,
  Responsive,
  type ResponsiveProps,
  WidthProvider,
  type WidthProviderProps,
} from "react-grid-layout";

type ResponsiveGridType = ComponentClass<
  ResponsiveProps & WidthProviderProps,
  unknown
>;

export const EditableGrid = () => {
  const [widgets] = useAtom(editableWidgetsAtom);
  const [layouts, setLayouts] = useAtom(editableLayoutsAtom);
  const ResponsiveReactGridLayout = useMemo<ResponsiveGridType>(
    () => WidthProvider(Responsive),
    [],
  );

  const onLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  };

  return (
    <ResponsiveReactGridLayout
      className="m-auto"
      breakpoints={{ xxl: 1536, xl: 1280, lg: 1024, md: 768, sm: 640 }}
      cols={{ xxl: 4, xl: 4, lg: 4, md: 4, sm: 1 }}
      rowHeight={175}
      layouts={layouts}
      margin={[40, 40]}
      onLayoutChange={onLayoutChange}
    >
      {widgets.map((widget) => (
        <div
          key={widget.key}
          className="flex cursor-grab items-center justify-center rounded-3xl bg-white shadow-[0_2px_4px_rgba(0,0,0,.04)] active:cursor-grabbing"
        >
          <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-white p-6 text-3xl uppercase text-[var(--black-1)]">
            {widget.key}
          </div>
        </div>
      ))}
    </ResponsiveReactGridLayout>
  );
};

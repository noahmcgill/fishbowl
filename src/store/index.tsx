import { atom } from "jotai";
import { ConfigType, type GridState } from "./types";
import { focusAtom } from "jotai-optics";

// @todo: remove or solidify as default
export const testState: GridState = {
  widgets: [
    {
      key: "a",
      config: {
        type: ConfigType.COUNT,
        title: "MRR",
        description: "Monthly Recurring Revenue",
        data: "$2k",
      },
    },
    {
      key: "b",
      config: {
        type: ConfigType.COUNT,
        title: "ARR",
        description: "Annual Recurring Revenue",
        data: "$24k",
      },
    },
    {
      key: "c",
      config: {
        type: ConfigType.COUNT,
        title: "Total Funding Raised",
        description: "March 11, 2024",
        data: "$100k",
      },
    },
  ],
  layouts: {
    lg: [
      { i: "a", x: 0, y: 0, w: 1, h: 1, isResizable: false },
      { i: "b", x: 2, y: 0, w: 1, h: 1, isResizable: false },
      { i: "c", x: 3, y: 0, w: 1, h: 1, isResizable: false },
    ],
    md: [
      { i: "a", x: 0, y: 0, w: 2, h: 1, isResizable: false },
      { i: "b", x: 0, y: 1, w: 1, h: 1, isResizable: false },
      { i: "c", x: 0, y: 7, w: 1, h: 1, isResizable: false },
    ],
  },
};

export const gridStateAtom = atom<GridState>(testState);
export const widgetsAtom = focusAtom(gridStateAtom, (optic) =>
  optic.prop("widgets"),
);
export const layoutsAtom = focusAtom(gridStateAtom, (optic) =>
  optic.prop("layouts"),
);

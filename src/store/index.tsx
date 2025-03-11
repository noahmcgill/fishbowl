import { atom } from "jotai";
import { type GridState } from "./types";
import { focusAtom } from "jotai-optics";

// @todo: remove or solidify as default
export const testState: GridState = {
  widgets: [
    {
      key: "a",
      config: {},
    },
    {
      key: "b",
      config: {},
    },
    {
      key: "c",
      config: {},
    },
  ],
  layouts: {
    lg: [
      { i: "a", x: 0, y: 0, w: 2, h: 2, isResizable: true },
      { i: "b", x: 2, y: 0, w: 1, h: 1, isResizable: false },
      { i: "c", x: 3, y: 0, w: 1, h: 1, isResizable: false },
    ],
    xs: [
      { i: "a", x: 0, y: 0, w: 2, h: 1, isResizable: false },
      { i: "b", x: 0, y: 1, w: 1, h: 1, isResizable: false },
      { i: "c", x: 0, y: 7, w: 1, h: 1, isResizable: false },
    ],
  },
};

export const editableGridStateAtom = atom<GridState>(testState);
export const editableWidgetsAtom = focusAtom(editableGridStateAtom, (optic) =>
  optic.prop("widgets"),
);
export const editableLayoutsAtom = focusAtom(editableGridStateAtom, (optic) =>
  optic.prop("layouts"),
);

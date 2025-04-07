export interface WH {
  w: number;
  h: number;
}

export interface ResponsiveWH {
  md: WH;
  lg: WH;
}

export enum BlockSize {
  SINGLE = "SINGLE", // 1x1
  DOUBLE = "DOUBLE", // 2x1
  TXT = "TXT", // 2x2
  FXT = "FXT", // 4x2
  TITLE = "TITLE",
}

import {
  BlockSize,
  type WH,
} from "@/components/page/grid/blocks/editable/types";
import { WH_SIZE_MAP } from "@/lib/constants";

export const getBlockSizeFromWH = (wh: WH): BlockSize =>
  WH_SIZE_MAP[`${wh.w},${wh.h}`] ?? BlockSize.FXT;

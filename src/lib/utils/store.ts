import {
  type BarChartConfig,
  ConfigType,
  type BaseConfig,
  type SingleDataPointConfig,
  type TitleConfig,
  type Widget,
} from "@/store/types";

export class CheckConfig {
  public static isSingleDataPointConfig(
    config: BaseConfig,
  ): config is SingleDataPointConfig {
    return config.type === ConfigType.COUNT;
  }

  public static isBarChartConfig(config: BaseConfig): config is BarChartConfig {
    return config.type === ConfigType.BAR;
  }

  public static isTitleConfig(config: BaseConfig): config is TitleConfig {
    return config.type === ConfigType.TITLE;
  }
}

export const isWidget = <T extends BaseConfig>(
  obj: unknown,
): obj is Widget<T> => {
  if (typeof obj === "object" && obj !== null && "config" in obj) {
    const config = (obj as { config: unknown }).config;

    return typeof config === "object" && config !== null && "type" in config;
  }

  return false;
};

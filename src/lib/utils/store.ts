import {
  type BarChartConfig,
  ConfigType,
  type BaseConfig,
  type SingleDataPointConfig,
  type TitleConfig,
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

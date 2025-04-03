import {
  type BarChartConfig,
  ConfigType,
  type BaseConfig,
  type SingleDataPointConfig,
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
}

import {
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
}

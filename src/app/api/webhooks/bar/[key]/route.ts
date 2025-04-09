import {
  csvToBarChartData,
  getConfigWithPersistedColors,
} from "@/lib/utils/csv";
import { CORS_HEADERS } from "@/lib/utils/server/cors";
import { jsonResponse } from "@/lib/utils/server/json-response";
import {
  ConfigType,
  type BarChartConfig,
  type SingleDataPointConfig,
} from "@/store/types";
import { z } from "zod";
import { dataRoutePreChecks, updateState } from "../../helpers";

type RequestBody = { data: string[][] };

// @todo: clean up and test

export async function POST(
  req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const result = await dataRoutePreChecks<BarChartConfig>({
      req,
      params,
      expectedType: ConfigType.COUNT,
    });

    if (result instanceof Response) return result;

    const { page, widget, state, key } = result;
    let body: RequestBody = { data: [] };
    try {
      body = (await req.json()) as RequestBody;

      const dataSchema = z.object({
        data: z.array(z.array(z.string())),
      });

      body = dataSchema.parse(body);
    } catch (e) {
      console.error(e);
      return jsonResponse(
        { error: "Chart data format is invalid" },
        400,
        CORS_HEADERS,
      );
    }

    const components = csvToBarChartData(body.data);
    const data = getConfigWithPersistedColors(widget, components);
    await updateState<BarChartConfig>(page?.id ?? "", widget, data, state, key);

    return jsonResponse(
      { message: "success", blockId: key },
      200,
      CORS_HEADERS,
    );
  } catch (e) {
    console.error(e);
    return jsonResponse({ error: "Internal server error" }, 500, CORS_HEADERS);
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const result = await dataRoutePreChecks<SingleDataPointConfig>({
      req,
      params,
      expectedType: ConfigType.COUNT,
    });

    if (result instanceof Response) return result;

    const { widget } = result;

    return jsonResponse({ data: widget.config.data }, 200, CORS_HEADERS);
  } catch (e) {
    console.error(e);
    return jsonResponse({ error: "Internal server error" }, 500, CORS_HEADERS);
  }
}

import {
  barChartDataToCsv,
  csvToBarChartData,
  getConfigWithPersistedColors,
} from "@/lib/utils/csv";
import { CORS_HEADERS } from "@/lib/utils/server/cors";
import { jsonResponse } from "@/lib/utils/server/json-response";
import { requireAuth } from "@/lib/utils/server/require-auth";
import { validateBlockKey } from "@/lib/utils/server/validate-block-key";
import { db } from "@/server/db";
import {
  ConfigType,
  type Widget,
  type BarChartConfig,
  type GridState,
} from "@/store/types";
import { type JsonObject } from "@prisma/client/runtime/library";
import { z } from "zod";

type RequestBody = { data: string[][] };

export async function POST(
  req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const user = await requireAuth(req);
    if (user instanceof Response) return user;

    const key = (await params).key;
    const keyValidation = validateBlockKey(key);
    if (keyValidation) return keyValidation;

    const page = await db.page.findFirst({
      where: { userId: user.id },
    });
    if (!page) {
      return jsonResponse(
        { error: "No page exists for user" },
        400,
        CORS_HEADERS,
      );
    }

    const state = page.gridState as JsonObject as unknown as GridState;
    const widget = state.widgets.find(
      (w) => w.key === key,
    ) as Widget<BarChartConfig>;

    if (!widget) {
      return jsonResponse(
        { error: "Widget not found in page" },
        400,
        CORS_HEADERS,
      );
    }

    let body: RequestBody = { data: [] };
    try {
      body = (await req.json()) as RequestBody;

      const dataSchema = z.object({
        data: z.array(z.array(z.string())),
      });

      dataSchema.parse(body);
    } catch (e) {
      console.error(e);
      return jsonResponse(
        { error: "Chart data format is invalid" },
        400,
        CORS_HEADERS,
      );
    }

    // persist new state
    const components = csvToBarChartData(body.data);
    const newWidget: Widget<BarChartConfig> = {
      key,
      config: {
        type: ConfigType.BAR,
        title: widget.config.title,
        description: widget.config.description,
        options: widget.config.options,
        data: getConfigWithPersistedColors(widget, components),
      },
    };

    const newState: GridState = {
      widgets: state.widgets.map((w) => (w.key !== key ? w : newWidget)),
      layouts: state.layouts,
    };

    await db.page.update({
      where: { id: page.id },
      data: {
        gridState: newState as unknown as JsonObject,
      },
    });

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
    const user = await requireAuth(req);
    if (user instanceof Response) return user;

    const key = (await params).key;
    const keyValidation = validateBlockKey(key);
    if (keyValidation) return keyValidation;

    const page = await db.page.findFirst({
      where: { userId: user.id },
    });
    if (!page) {
      return jsonResponse(
        { error: "No page exists for user" },
        400,
        CORS_HEADERS,
      );
    }

    const state = page.gridState as JsonObject as unknown as GridState;
    const widget = state.widgets.find((w) => w.key === key);

    if (!widget) {
      return jsonResponse(
        { error: "Widget not found in page" },
        400,
        CORS_HEADERS,
      );
    }

    const config = widget.config as BarChartConfig;
    const data = barChartDataToCsv(config.data);

    return jsonResponse({ data }, 200, CORS_HEADERS);
  } catch (e) {
    console.error(e);
    return jsonResponse({ error: "Internal server error" }, 500, CORS_HEADERS);
  }
}

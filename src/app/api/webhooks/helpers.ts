import { CORS_HEADERS } from "@/lib/utils/server/cors";
import { jsonResponse } from "@/lib/utils/server/json-response";
import { requireAuth } from "@/lib/utils/server/require-auth";
import { validateBlockKey } from "@/lib/utils/server/validate-block-key";
import { db } from "@/server/db";
import {
  type ConfigType,
  type BaseConfig,
  type GridState,
  type Widget,
} from "@/store/types";
import { type JsonObject } from "@prisma/client/runtime/library";

type GetWidgetOptions = {
  req: Request;
  params: Promise<{ key: string }>;
  expectedType: ConfigType;
};

export async function dataRoutePreChecks<T extends BaseConfig>({
  req,
  params,
  expectedType,
}: GetWidgetOptions): Promise<
  | {
      user: Awaited<ReturnType<typeof requireAuth>>;
      page: Awaited<ReturnType<typeof db.page.findFirst>>;
      widget: Widget<T>;
      state: GridState;
      key: string;
    }
  | Response
> {
  const user = await requireAuth(req);
  if (user instanceof Response) return user;

  const key = (await params).key;
  const keyValidation = validateBlockKey(key);
  if (keyValidation) return keyValidation;

  const page = await db.page.findFirst({ where: { userId: user.id } });
  if (!page) {
    return jsonResponse(
      { error: "No page exists for user" },
      400,
      CORS_HEADERS,
    );
  }

  const state = page.gridState as JsonObject as unknown as GridState;
  const widget = state.widgets.find((w) => w.key === key) as Widget<T>;

  if (!widget || widget.config.type !== expectedType) {
    return jsonResponse(
      { error: "Widget not found in page" },
      404,
      CORS_HEADERS,
    );
  }

  return { user, page, widget, state, key };
}

export const updateState = async <T extends BaseConfig>(
  pageId: string,
  prevWidget: Widget<T>,
  data: unknown,
  state: GridState,
  key: string,
) => {
  const newWidget: Widget<T> = {
    key,
    config: { ...prevWidget.config, data: data ?? null },
  };

  const newState: GridState = {
    widgets: state.widgets.map((w) => (w.key !== key ? w : newWidget)),
    layouts: state.layouts,
  };

  await db.page.update({
    where: { id: pageId },
    data: {
      gridState: newState as unknown as JsonObject,
    },
  });
};

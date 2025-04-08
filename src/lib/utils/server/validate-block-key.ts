import { CORS_HEADERS } from "./cors";
import { jsonResponse } from "./json-response";

export function validateBlockKey(key: string | undefined) {
  if (!key || key.length < 1) {
    return jsonResponse(
      { error: "You must provide a block key" },
      400,
      CORS_HEADERS,
    );
  }
  return null;
}

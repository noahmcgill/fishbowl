import { authenticateRequest } from "@/lib/middleware/authenticate-request";
import { CORS_HEADERS } from "@/lib/utils/server/cors";
import { jsonResponse } from "./json-response";

export async function requireAuth(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) {
    return jsonResponse(
      { error: "Missing or invalid API key" },
      401,
      CORS_HEADERS,
    );
  }
  return user;
}

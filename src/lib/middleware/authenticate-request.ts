import { db } from "@/server/db";
import { verify } from "../utils/api-keys";
import { type User } from "next-auth";

// @todo: test

export const authenticateRequest = async (
  req: Request,
): Promise<User | null> => {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split("Bearer ")[1];

  if (!token) {
    console.error("Missing token");
    return null;
  }

  try {
    const [userId, apiKey] = token.split(".");
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user?.apiKey || !(await verify(apiKey ?? "", user.apiKey))) {
      throw new Error();
    }

    return user;
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
};

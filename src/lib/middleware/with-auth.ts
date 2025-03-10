import {
  type NextApiRequest,
  type NextApiResponse,
  type NextApiHandler,
} from "next";
import { db } from "@/server/db";
import { verify } from "../utils/api-keys";

const authenticateToken = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void,
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token)
      return res.status(401).json({ error: "Invalid or missing token" });

    const [userId, apiKey] = token.split(".") ?? [];
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user?.apiKey || !(await verify(apiKey ?? "", user.apiKey))) {
      return res.status(401).json({ error: "Invalid token" });
    }

    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default authenticateToken;

export const withAuth = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await authenticateToken(req, res, () => handler(req, res));
  };
};

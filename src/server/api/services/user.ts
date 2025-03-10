import { generateApiKey, hash } from "@/lib/utils/api-keys";
import { db } from "@/server/db";

export class UserService {
  static instance: UserService | null = null;

  constructor() {
    if (!UserService.instance) {
      UserService.instance = this;
    }
    return UserService.instance;
  }

  async userApiKeyExists(userId: string): Promise<boolean> {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return false;
    }

    return user.apiKey !== null;
  }

  async refreshUserApiKey(userId: string): Promise<string> {
    const plainTextKey = generateApiKey();
    const key = await hash(plainTextKey);

    await db.user.update({
      where: { id: userId },
      data: { apiKey: key },
    });

    return `${userId}.${plainTextKey}`;
  }
}

export const userService = new UserService();

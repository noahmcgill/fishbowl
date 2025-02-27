import { db } from "@/server/db";
import { type Page } from "@prisma/client";

export class PageService {
  static instance: PageService | null = null;

  constructor() {
    if (!PageService.instance) {
      PageService.instance = this;
    }
    return PageService.instance;
  }

  async getFirstForUserEmail(id: string): Promise<Page | null> {
    return await db.page.findFirst({
      where: { userId: id },
    });
  }
}

export const pageService = new PageService();

import { db } from "@/server/db";
import { type Page } from "@prisma/client";

interface CreatePageInput {
  userId: string;
  slug: string;
  name?: string;
  description?: string;
  companyUrl?: string;
  imageUrl?: string;
}

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

  async create({
    userId,
    slug,
    name,
    description,
    companyUrl,
    imageUrl,
  }: CreatePageInput): Promise<void> {
    await db.page.create({
      data: {
        userId,
        slug,
        name,
        description,
        companyUrl,
        imageUrl,
      },
    });
  }
}

export const pageService = new PageService();

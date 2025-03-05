import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { pageService } from "../services/page";
import { TRPCError } from "@trpc/server";
import { TRPCErrorCode } from "@/lib/constants";

export const pageRouter = createTRPCRouter({
  getFirstForUserEmail: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input }) => {
      try {
        return await pageService.getFirstForUser(input.id);
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message: "There was an unexpected error retrieving the page",
        });
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        slug: z.string(), // @todo: custom validator
        name: z.string().optional(),
        description: z.string().optional(),
        companyUrl: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        color: z.string().optional(), // @todo: custom validator
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const page = await pageService.getFirstForUser(ctx.session.user.id);

        if (page) {
          throw new TRPCError({
            code: TRPCErrorCode.UNPROCESSABLE_CONTENT,
            message:
              "The page was not created because one already exists for this user",
          });
        }

        await pageService.create({
          userId: ctx.session.user.id,
          slug: input.slug,
          name: input.name,
          description: input.description,
          companyUrl: input.companyUrl,
          imageUrl: input.imageUrl,
          color: input.color,
        });
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message: "There was an unexpected error creating the page",
        });
      }
    }),

  // @todo: custom validator on slug input
  getPageBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const page = await pageService.getPageBySlug(input.slug);

        if (!page) {
          throw new TRPCError({
            code: TRPCErrorCode.NOT_FOUND,
            message: "A page with this slug does not exist",
          });
        }

        return page;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message: "An unexpected error while finding the page",
        });
      }
    }),

  // @todo: custom validator on slug input
  slugExists: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const page = await pageService.getPageBySlug(input.slug);
        return page !== null;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message: "An unexpected error while finding the page",
        });
      }
    }),
});

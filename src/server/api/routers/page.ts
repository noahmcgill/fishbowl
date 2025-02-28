import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { pageService } from "../services/page";
import { TRPCError } from "@trpc/server";
import { TRPCErrorCode } from "@/lib/constants";

export const pageRouter = createTRPCRouter({
  getFirstForUserEmail: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input }) => {
      try {
        return await pageService.getFirstForUserEmail(input.id);
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
        slug: z.string(), // @todo: stricter validation on slug
        name: z.string().optional(),
        description: z.string().optional(),
        companyUrl: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const page = await pageService.getFirstForUserEmail(
          ctx.session.user.id,
        );

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
        });
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: TRPCErrorCode.UNPROCESSABLE_CONTENT,
          message: "There was an unexpected error creating the page",
        });
      }
    }),
});

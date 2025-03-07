import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { pageService } from "../services/page";
import { TRPCError } from "@trpc/server";
import {
  imageMimeTypeRegex,
  TRPCErrorCode,
  urlSafeSlugRegex,
} from "@/lib/constants";

export const pageRouter = createTRPCRouter({
  getFirstForUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await pageService.getFirstForUser(ctx.session.user.id);
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
        slug: z.string().regex(urlSafeSlugRegex),
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

  getPageBySlug: publicProcedure
    .input(z.object({ slug: z.string().regex(urlSafeSlugRegex) }))
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

  slugExists: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const isValidSlug = urlSafeSlugRegex.test(input.slug);
      if (!isValidSlug) {
        throw new TRPCError({
          code: TRPCErrorCode.BAD_REQUEST,
          message: "Invalid slug",
        });
      }

      try {
        const page = await pageService.getPageBySlug(input.slug);
        return page !== null;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message: "An unexpected error occurred while finding the page",
        });
      }
    }),

  getPageImageUploadUrl: protectedProcedure
    .input(
      z.object({
        pageId: z.string().cuid(),
        fileName: z.string(),
        contentLength: z.number(),
        contentType: z.string().regex(imageMimeTypeRegex),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.contentLength > 10485760) {
        throw new TRPCError({
          code: TRPCErrorCode.BAD_REQUEST,
          message:
            "Error getting presigned URL for profile image upload: the file size must be under 10mb",
        });
      }

      try {
        return await pageService.getS3PresignedUrl({
          pageId: input.pageId,
          bucketName: process.env.S3_BUCKET_NAME!,
          contentType: input.contentType,
          contentLength: input.contentLength,
          fileName: input.fileName,
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message:
            "An unexpected error occurred while retrieving the presigned URL for image upload from object storage",
        });
      }
    }),

  updatePageImageUrl: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await pageService.updatePageImageUrl(
          ctx.session.user.id,
          input.url,
        );
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message:
            "An unexpected error occurred while updating the user's profile image",
        });
      }
    }),
});

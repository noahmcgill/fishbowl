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
  METADATA_DESC_SANITIZED_MAX_LENGTH,
  METADATA_NAME_SANITIZED_MAX_LENGTH,
  metadataDomPurifyConfig,
  TRPCErrorCode,
  urlSafeSlugRegex,
} from "@/lib/constants";
import DOMPurify from "isomorphic-dompurify";

const getErrorMsg = (route: string, msg: string) => {
  return `[PageRouter.${route}]: ${msg}`;
};

const sanitizeStrOrNull = (str: string | null) => {
  if (!str || str === "") return null;
  return DOMPurify.sanitize(str, metadataDomPurifyConfig);
};

const isMetadataSanitizedLengthValid = (
  name: string | null,
  desc: string | null,
): boolean => {
  const nameSanitizedLength = DOMPurify.sanitize(name ?? "", {
    ALLOWED_TAGS: [],
  }).replace(/&nbsp;/g, " ").length;
  const descSanitizedLength = DOMPurify.sanitize(desc ?? "", {
    ALLOWED_TAGS: [],
  }).replace(/&nbsp;/g, " ").length;

  return (
    nameSanitizedLength > METADATA_NAME_SANITIZED_MAX_LENGTH &&
    descSanitizedLength > METADATA_DESC_SANITIZED_MAX_LENGTH
  );
};

export const pageRouter = createTRPCRouter({
  getFirstForUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await pageService.getFirstForUser(ctx.session.user.id);
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
        message: getErrorMsg(
          "getFirstForUser",
          "unexpected error retrieving user page",
        ),
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
            message: getErrorMsg("create", "page already exists for user"),
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
        if (e instanceof TRPCError) throw e;
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message: getErrorMsg("create", "unexpected error creating the page"),
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
            message: getErrorMsg(
              "getPageBySlug",
              "a page with this slug does not exist",
            ),
          });
        }

        return page;
      } catch (e) {
        console.log(e);
        if (e instanceof TRPCError) throw e;
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message: getErrorMsg(
            "getPageBySlug",
            "unexpected error while finding the page",
          ),
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
          message: getErrorMsg("slugExists", "invalid slug"),
        });
      }

      try {
        const page = await pageService.getPageBySlug(input.slug);
        return page !== null;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message: getErrorMsg(
            "slugExists",
            "unexpected error while finding the page",
          ),
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
          message: getErrorMsg(
            "getPageImageUploadUrl",
            "file size must be under 10mb",
          ),
        });
      }

      try {
        return await pageService.getS3PresignedUrl({
          pageId: input.pageId,
          bucketName: process.env.STORAGE_BUCKET_NAME!,
          contentType: input.contentType,
          contentLength: input.contentLength,
          fileName: input.fileName,
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message: getErrorMsg(
            "getPageImageUploadUrl",
            "unexpected error generating presigned URL",
          ),
        });
      }
    }),

  updatePageImageUrl: protectedProcedure
    .input(
      z.object({
        pageId: z.string().cuid(),
        url: z.string().url().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const userPage = await pageService.getFirstForUser(ctx.session.user.id);
        if (!userPage || userPage.id !== input.pageId) {
          throw new TRPCError({
            code: TRPCErrorCode.FORBIDDEN,
            message: getErrorMsg(
              "updatePageImageUrl",
              "user is attempting to modify a page that is not theirs",
            ),
          });
        }

        return await pageService.updatePageImageUrl(input.pageId, input.url);
      } catch (e) {
        console.log(e);
        if (e instanceof TRPCError) throw e;
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message: getErrorMsg(
            "updatePageImageUrl",
            "unexpected error occurred updating the user's profile image",
          ),
        });
      }
    }),

  // Takes rich text for metadata fields, checks for a character limit by sanitizing tags,
  // runs another sanitation of unwanted tags (but keeps rich text format), and persists changes.
  updatePageMetadata: protectedProcedure
    .input(
      z.object({
        pageId: z.string().cuid(),
        metadata: z.object({
          name: z.string().nullable(),
          desc: z.string().nullable(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const userPage = await pageService.getFirstForUser(ctx.session.user.id);
        if (!userPage || userPage.id !== input.pageId) {
          throw new TRPCError({
            code: TRPCErrorCode.FORBIDDEN,
            message: getErrorMsg(
              "updatePageMetadata",
              "user is attempting to modify a page that is not theirs",
            ),
          });
        }

        // Check the metadata field lengths without tags or space codes
        if (
          isMetadataSanitizedLengthValid(
            input.metadata.name,
            input.metadata.desc,
          )
        ) {
          throw new TRPCError({
            code: TRPCErrorCode.BAD_REQUEST,
            message: getErrorMsg(
              "updatePageMetadata",
              "max length on one or more of the page metadata fields exceeded",
            ),
          });
        }

        // Perform sanitation on the strings that will be persisted
        const sanitizedName = sanitizeStrOrNull(input.metadata.name);
        const sanitizedDesc = sanitizeStrOrNull(input.metadata.desc);

        return await pageService.updatePageMetadata(input.pageId, {
          name: sanitizedName,
          desc: sanitizedDesc,
        });
      } catch (e) {
        console.log(e);
        if (e instanceof TRPCError) throw e;
        throw new TRPCError({
          code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
          message: getErrorMsg(
            "updatePageMetadata",
            "unexpected error occurred updating the user's page metadata",
          ),
        });
      }
    }),
});

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
});

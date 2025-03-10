import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { TRPCErrorCode } from "@/lib/constants";
import { userService } from "../services/user";

const getErrorMsg = (route: string, msg: string) => {
  return `[UserRouter.${route}]: ${msg}`;
};

export const userRouter = createTRPCRouter({
  userApiKeyExists: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await userService.userApiKeyExists(ctx.session.user.id);
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
        message: getErrorMsg(
          "getApiKeyForUser",
          "unexpected error retrieving user's API key status",
        ),
      });
    }
  }),

  refreshUserApiKey: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      return await userService.refreshUserApiKey(ctx.session.user.id);
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: TRPCErrorCode.INTERNAL_SERVER_ERROR,
        message: getErrorMsg(
          "getApiKeyForUser",
          "unexpected error generating user's API key",
        ),
      });
    }
  }),
});

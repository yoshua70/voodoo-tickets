import { createRouter } from "../router";
import { createUserInputSchema } from "../../schemas/CreateUserInput";
import {
  createUser,
  findUniqueUser,
  findUser,
  generateTokens,
} from "../../services/user.service";
import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import { loginUserInputSchema } from "../../schemas/LoginUserInput";
import { sendAccessToken, sendTokens } from "../../utils/send-token";
import { decode, encode } from "../../jwt";
import { User } from "@prisma/client";

export const userRouter = createRouter()
  .mutation("register", {
    input: createUserInputSchema,
    async resolve({ ctx, input }) {
      let user: User = await findUser({ where: { phone: input.phone } });

      if (user)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Numéro de téléphone déjà utilisé.",
        });

      const hashedPassword = await argon2.hash(input.password);

      user = await createUser({
        name: input.name,
        password: hashedPassword,
        phone: input.phone,
      });

      const { access_token, refresh_token } = await generateTokens(user.id);

      return {
        id: null,
        result: {
          type: "data",
          data: { user, access_token, refresh_token },
        },
      };
    },
  })
  .mutation("login", {
    input: loginUserInputSchema,
    async resolve({ ctx, input }) {
      const user = await findUser({
        where: { phone: input.phone, diallingCode: input.diallingCode },
      });

      if (!user || !(await argon2.verify(user.password, input.password)))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Identifiants invalides.",
        });

      const { access_token, refresh_token } = await generateTokens(user.id);

      // Send access and refresh tokens in the cookie
      sendTokens({
        ctx,
        accessToken: access_token,
        refreshToken: refresh_token,
      });

      return {
        id: null,
        result: {
          type: "data",
          data: { user, access_token, refresh_token },
          status: "success",
        },
      };
    },
  })
  .mutation("logout", {
    async resolve({ ctx }) {
      ctx.res.cookie("voodoo_access_token", null, {
        httpOnly: true,
      });
      ctx.res.cookie("voodoo_refresh_token", null, {
        httpOnly: true,
      });
    },
  })
  .mutation("refreshAccessToken", {
    async resolve({ ctx }) {
      const refreshToken = ctx.req.cookies?.voodoo_refresh_token as string;

      if (!refreshToken)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Impossible de rafraîchir le jeton d'accès.",
        });

      const payload = await decode({
        token: refreshToken,
        type: "refresh",
      });

      if (!payload)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Impossible de rafraîchir le jeton d'accès.",
        });

      const user = await findUniqueUser({ where: { id: payload.userId } });

      if (!user)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Impossible de rafraîchir le jeton d'accès.",
        });

      const accessToken = await encode({
        userId: user.id,
        expiresIn: "15m",
        type: "access",
      });

      sendAccessToken({ ctx, accessToken });

      return {
        id: null,
        result: {
          type: "data",
          data: accessToken,
        },
      };
    },
  });
  
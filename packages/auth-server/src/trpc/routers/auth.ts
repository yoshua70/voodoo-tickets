import { createRouter } from "../router";
import { z } from "zod";
import { twilio } from "../../utils/twilio-client";
import { TRPCError } from "@trpc/server";
import {
  findUser,
  generateTokens,
  updateUser,
} from "../../services/user.service";

const sendVerificationCodeSchema = z.object({
  phone: z.string().min(10),
  diallingCode: z.string().min(1),
});

const verifyCodeSchema = z.object({
  phone: z.string().min(10),
  diallingCode: z.string().min(1),
  code: z.string().length(6),
});

export const authRouter = createRouter()
  .mutation("sendVerificationCode", {
    input: sendVerificationCodeSchema,
    async resolve({ ctx, input }) {
      const { phone, diallingCode } = input;

      return twilio.verifications
        .create({
          to: `${diallingCode}${phone}`,
          channel: "sms",
        })
        .then((verification) => {
          return {
            id: null,
            result: {
              type: "data",
              data: verification.status,
            },
          };
        })
        .catch((err) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send request.",
            cause: err,
          });
        });
    },
  })
  .mutation("verify", {
    input: verifyCodeSchema,
    async resolve({ ctx, input }) {
      const { phone, diallingCode, code } = input;

      return twilio.verificationChecks
        .create({ to: `${diallingCode}${phone}`, code: code.toString() })
        .then(async (verification_check) => {
          if (verification_check.status !== "approved") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Code invalide",
            });
          }

          const user = await findUser({
            where: { phone, diallingCode },
            select: { id: true },
          });

          if (!user)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Aucun utilisateur associé à ce numéro de téléphone.",
            });

          await updateUser({
            where: { id: user.id },
            data: {
              verified: true,
              verifiedAt: Date.now().toString(),
            },
          });

          const { access_token, refresh_token } = await generateTokens(user.id);

          return {
            id: null,
            result: {
              type: "data",
              data: {
                access_token,
                refresh_token,
              },
            },
          };
        })
        .catch((err) => {
          console.error(err);
          throw new TRPCError({
            code: "CONFLICT",
            cause: err,
          });
        });
    },
  })
  .mutation("forgotPassword", {
    input: z.object({
      phone: z.string().min(10),
      diallingCode: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
      const { phone, diallingCode } = input;
      const user = await findUser({
        where: {
          phone,
          diallingCode,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Aucun utilisateur associé à ce numéro.",
        });
    },
  });

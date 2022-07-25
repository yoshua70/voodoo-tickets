import { createRouter } from "../router";
import { z } from "zod";
import { prisma } from "../../utils/prisma-client";
import argon2 from "argon2";
import { twilio } from "../../utils/twilio-client";
import { encode } from "../../jwt";
import { TRPCError } from "@trpc/server";

export const userRouter = createRouter()
  .query("getUser", {
    input: z.string(),
    async resolve(req) {
      const user = await prisma.user
        .findFirst({ where: { id: req.input } })
        .finally(() => prisma.$disconnect);

      return user;
    },
  })
  .mutation("createUser", {
    input: z.object({
      name: z.string().min(5),
      phone: z.string().min(10),
      password: z.string().min(8),
    }),
    async resolve(req) {
      const { phone, password, name } = req.input;

      let user = await prisma.user
        .findFirst({ where: { phone } })
        .finally(() => prisma.$disconnect);

      if (user)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le numéro de téléphone est déjà enregistré.",
        });

      const hashedPassword = await argon2.hash(password);

      const newUser = await prisma.user
        .create({
          data: { phone, name, password: hashedPassword },
          select: {
            id: true,
            phone: true,
            indicatif: true,
          },
        })
        .finally(() => prisma.$disconnect);

      return {
        id: null,
        result: {
          type: "data",
          data: newUser,
        },
      };
    },
  })
  .mutation("sendVerification", {
    input: z.object({
      phone: z.string().length(10),
      indicatif: z.string(),
      id: z.string(),
    }),
    async resolve({ input }) {
      const { phone, indicatif } = input;

      return twilio.verifications
        .create({
          to: `${indicatif}${phone}`,
          channel: "sms",
        })
        .then((verification) => {
          return { status: verification.status };
        })
        .catch((err) => {
          console.error(err);
          return { status: "failed to send request" };
        });
    },
  })
  .mutation("verify", {
    input: z.object({
      phone: z.string().length(10),
      indicatif: z.string(),
      code: z.number().int(),
    }),
    async resolve({ ctx, input }) {
      const { phone, indicatif, code } = input;

      return twilio.verificationChecks
        .create({ to: `${indicatif}${phone}`, code: code.toString() })
        .then(async (verification_check) => {
          if (verification_check.status === "approved") {
            const user = await prisma.user.findFirst({
              where: { phone },
              select: { id: true },
            });

            if (!user)
              return { status: "failed", message: "The user does not exist." };

            ctx.res.cookie(
              "refresh_token",
              await encode({
                userId: user.id,
                expiresIn: "7d",
                type: "refresh",
              }),
              { httpOnly: true }
            );

            ctx.res.cookie(
              "access_token",
              await encode({
                userId: user.id,
                expiresIn: "15m",
                type: "access",
              }),
              { httpOnly: true }
            );

            return {
              accessToken: await encode({
                userId: user.id,
                expiresIn: "15m",
                type: "access",
              }),
            };
          }
          return { status: verification_check.status };
        })
        .catch((err) => {
          console.error(err);
          return { status: "failed to send request" };
        });
    },
  });

import { createRouter } from "./router";
import { appAuthRouter } from "auth-server/src/trpc/server";

export const appRouter = createRouter().merge("apiAuth.", appAuthRouter);

export type AppRouter = typeof appRouter;

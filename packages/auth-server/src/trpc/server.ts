import { createRouter } from "./router";
import { authRouter } from "./routers/auth";

export const appRouter = createRouter().merge("auth.", authRouter);

export type AppRouter = typeof appRouter;

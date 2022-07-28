import { createRouter } from "./router";
import { authRouter } from "./routers/auth";

export const appAuthRouter = createRouter().merge("auth.", authRouter);

export type AppRouter = typeof appAuthRouter;

import { createRouter } from "./router";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";

export const appRouter = createRouter()
  .merge("user.", userRouter)
  .merge("auth.", authRouter);

export type AppRouter = typeof appRouter;

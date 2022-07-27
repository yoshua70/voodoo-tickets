import { createRouter } from "../router";
import { loginUserSchema, registerUserSchema } from "../../schemas/user.schema";
import { registerController } from "../../controllers/auth/register.controller";
import { loginController } from "../../controllers/auth/login.controller";

export const authRouter = createRouter()
  .mutation("register", {
    input: registerUserSchema,
    resolve: async ({ input }) => await registerController(input),
  })
  .mutation("login", {
    input: loginUserSchema,
    resolve: async ({ input, ctx }) => await loginController({ input, ctx }),
  });

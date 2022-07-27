import { faker } from "@faker-js/faker";
import { RegisterUserInput } from "../../../schemas/user.schema";
import { registerController } from "../register.controller";

describe("register", () => {
  it("should return an access and a refresh token", async () => {
    const user: RegisterUserInput = {
      name: faker.name.findName(),
      phone: faker.phone.number(),
      diallingCode: faker.random.numeric(3),
      password: faker.random.alphaNumeric(10),
    };

    const response = await registerController(user);

    expect(response).toHaveProperty("result.data.access_token");
    expect(response).toHaveProperty("result.data.refresh_token");
  });
});

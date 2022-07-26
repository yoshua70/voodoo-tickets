import {
  createUser,
  deleteUser,
  findUniqueUser,
  findUser,
  updateUser,
} from "../user.service";

describe("user CRUD", () => {
  it("should resolve with true and valid userId", async () => {
    const name = "John Doe";
    const password = "john@doe";
    const phone = "0102030405";

    const response = await createUser({
      name,
      password,
      phone,
    });
    expect(response).toHaveProperty("name", name);
    expect(response).toHaveProperty("phone", phone);
  });

  it("should resolve with true and user name and id", async () => {
    const phone = "0102030405";

    const response = await findUser({
      where: { phone },
      select: { name: true, id: true },
    });

    expect(response).toHaveProperty("name", "John Doe");
    expect(response).toHaveProperty("id");
  });

  it("should resolve with true and user name and id", async () => {
    const phone = "0102030405";

    const response = await findUniqueUser({
      where: { phone },
      select: { name: true, id: true },
    });

    expect(response).toHaveProperty("name", "John Doe");
    expect(response).toHaveProperty("id");
  });

  it("should resolve with true and user name and id", async () => {
    const phone = "0102030405";
    const name = "John Doe II";

    const response = await updateUser({
      data: {
        name,
      },
      where: { phone },
      select: { name: true, id: true },
    });

    expect(response).toHaveProperty("name", "John Doe II");
    expect(response).toHaveProperty("id");
  });

  it("should resolve with true and the data of the deleted user", async () => {
    const phone = "0102030405";

    const response = await deleteUser({
      where: { phone },
    });

    expect(response).toHaveProperty("id", null);
    expect(response).toHaveProperty("result.type", "data");
    expect(response).toHaveProperty("result.data", "success");
  });
});

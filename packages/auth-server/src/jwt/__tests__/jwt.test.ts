import { decode } from "..";

describe("jwts", () => {
  it("", async () => {
    const accessToken =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyYW5kb20tdXNlci1pZCIsImlhdCI6MTY1ODg0Mjc2MiwiZXhwIjoxNjU4ODQzNjYyfQ.VNang7P_HdgYBJx9n15NV1sxjm6enWI-9_8YLbaLnGe_0pa8KmcN3jd7P1E1r80KgaZCHRPsb-vRl9cF4uGClsVY8P9ZfZC4LCFbDoU1aL-x2X_L2Wgq30POWLHpJjZjNlHr-c8LDY1ELLlhig7_d-gaWj4-BBGy2XXrHUzCk0w";

    const response = await decode({ token: accessToken, type: "access" });

    expect(response).toHaveProperty("userId", "random-user-id");
  });
});

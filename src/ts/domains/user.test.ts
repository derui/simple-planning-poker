import { createId } from "./base";
import { createUser } from "./user";

describe("domains", () => {
  describe("users", () => {
    test("create user with id", () => {
      // Arrange
      const name = "name";

      // Act
      const ret = createUser(createId<"User">(), name);

      // Assert
      expect(ret.name).toEqual("name");
    });

    test("change name", () => {
      // Arrange
      const name = "name";
      const user = createUser(createId<"User">(), name);

      // Act
      user.changeName("changed name");

      // Assert
      expect(user.name).toEqual("changed name");
    });

    test("throw error if user name is empty", () => {
      // Arrange

      // Act

      // Assert
      expect(() => createUser(createId<"User">(), "")).toThrowError();
    });

    test("throw error when change to empty name", () => {
      // Arrange
      const name = "name";
      const user = createUser(createId<"User">(), name);

      // Act

      // Assert
      expect(() => user.changeName("")).toThrowError();
    });

    test("validate name", () => {
      // Arrange
      const name = "name";
      const user = createUser(createId<"User">(), name);

      // Act

      // Assert
      expect(user.canChangeName("")).toBeFalsy;
      expect(user.canChangeName("foo")).toBeTruthy;
    });
  });
});

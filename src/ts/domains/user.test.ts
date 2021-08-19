import { DOMAIN_EVENTS } from "./event";
import { createUser, createUserId } from "./user";

describe("domains", () => {
  describe("users", () => {
    test("create user with id", () => {
      // Arrange
      const name = "name";

      // Act
      const ret = createUser(createUserId(), name);

      // Assert
      expect(ret.name).toEqual("name");
    });

    test("change name", () => {
      // Arrange
      const name = "name";
      const user = createUser(createUserId(), name);

      // Act
      user.changeName("changed name");

      // Assert
      expect(user.name).toEqual("changed name");
    });

    test("throw error if user name is empty", () => {
      // Arrange

      // Act

      // Assert
      expect(() => createUser(createUserId(), "")).toThrowError();
    });

    test("throw error when change to empty name", () => {
      // Arrange
      const name = "name";
      const user = createUser(createUserId(), name);

      // Act

      // Assert
      expect(() => user.changeName("")).toThrowError();
    });

    test("validate name", () => {
      // Arrange
      const name = "name";
      const user = createUser(createUserId(), name);

      // Act

      // Assert
      expect(user.canChangeName("")).toBeFalsy;
      expect(user.canChangeName("foo")).toBeTruthy;
    });

    test("should return event to notify user name changed", () => {
      // Arrange
      const name = "name";
      const user = createUser(createUserId(), name);

      // Act
      const event = user.changeName("foobar");

      // Assert
      expect(event.kind).toEqual(DOMAIN_EVENTS.UserNameChanged);
      expect(event.name).toEqual("foobar");
      expect(event.userId).toBe(user.id);
    });
  });
});

import { DOMAIN_EVENTS } from "./event";
import { createGameJoinedUser, UserMode } from "./game-joined-user";
import { createUserId } from "./user";

describe("domains", () => {
  describe("users", () => {
    test("create user with id", () => {
      // Arrange
      const name = "name";

      // Act
      const ret = createGameJoinedUser(createUserId(), name, UserMode.normal);

      // Assert
      expect(ret.name).toEqual("name");
    });

    test("change mode", () => {
      // Arrange
      const name = "name";
      const user = createGameJoinedUser(createUserId(), name, UserMode.normal);

      // Act
      user.changeUserMode(UserMode.inspector);

      // Assert
      expect(user.mode).toEqual(UserMode.inspector);
    });

    test("should return event to notify user name changed", () => {
      // Arrange
      const name = "name";
      const user = createGameJoinedUser(createUserId(), name, UserMode.normal);

      // Act
      const event = user.changeUserMode(UserMode.inspector);

      // Assert
      expect(event.kind).toEqual(DOMAIN_EVENTS.GameJoinedUserModeChanged);
      expect(event.mode).toEqual(UserMode.inspector);
      expect(event.userId).toBe(user.userId);
    });
  });
});

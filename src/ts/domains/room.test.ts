import { DOMAIN_EVENTS } from "./event";
import { createRoomByUser, createRoomId } from "./room";
import { createSelectableCards } from "./selectable-cards";
import { createStoryPoint } from "./story-point";
import { createUser, createUserId } from "./user";

describe("domains", () => {
  describe("room", () => {
    const cards = createSelectableCards([1, 2].map(createStoryPoint));

    test("create room", () => {
      // Arrange
      const id = createRoomId();
      const user = createUser(createUserId(), "user");

      // Act
      const room = createRoomByUser(id, "name", cards, user);

      // Assert
      expect(room.id).toEqual(id);
      expect(room.name).toEqual("name");
      expect(room.joinedUsers).toContainEqual(user.id);
    });

    test("throw error if name is empty", () => {
      // Arrange
      const id = createRoomId();
      const user = createUser(createUserId(), "user");

      // Act

      // Assert
      expect(() => createRoomByUser(id, "", cards, user)).toThrowError();
    });

    test("can not accept same user that joined the room already", () => {
      // Arrange
      const id = createRoomId();
      const user = createUser(createUserId(), "user");
      const room = createRoomByUser(id, "name", cards, user);

      // Act
      const ret = room.canAcceptToBeJoinedBy(user);

      // Assert
      expect(ret).toBe(false);
    });

    test("can accept same user that do not join the room yet", () => {
      // Arrange
      const id = createRoomId();
      const user = createUser(createUserId(), "user");
      const user2 = createUser(createUserId(), "user");
      const room = createRoomByUser(id, "name", cards, user);

      // Act
      const ret = room.canAcceptToBeJoinedBy(user2);

      // Assert
      expect(ret).toBe(true);
    });

    test("can accept to be joined by user", () => {
      // Arrange
      const id = createRoomId();
      const user = createUser(createUserId(), "user");
      const user2 = createUser(createUserId(), "user2");
      const room = createRoomByUser(id, "name", cards, user);

      // Act
      room.acceptToBeJoinedBy(user2);

      // Assert
      expect(room.joinedUsers).toContainEqual(user2.id);
    });

    test("should start a game when a room created", () => {
      // Arrange
      const id = createRoomId();
      const user = createUser(createUserId(), "user");

      // Act
      const room = createRoomByUser(id, "name", cards, user);

      // Assert
      expect(room.currentGame.joinedUsers).toContain(user.id);
    });

    test("should be able to start new game", () => {
      // Arrange
      const id = createRoomId();
      const user = createUser(createUserId(), "user");
      const room = createRoomByUser(id, "name", cards, user);

      // Act
      const prevGame = room.currentGame;

      // Assert
      expect(room.currentGame === prevGame).toBeFalsy;
    });

    test("should return event to notify new game started", () => {
      // Arrange
      const id = createRoomId();
      const user = createUser(createUserId(), "user");
      const room = createRoomByUser(id, "name", cards, user);

      // Act
      const event = room.newGame();

      // Assert
      expect(event.kind).toEqual(DOMAIN_EVENTS.NewGameStarted);
    });
  });
});

import { createGiveUpCard, createStoryPointCard } from "./card";
import { createGame, createGameId } from "./game";
import { createGameJoinedUser, createGameJoinedUserFromUser } from "./game-joined-user";
import { createSelectableCards } from "./selectable-cards";
import { createStoryPoint } from "./story-point";
import { createUser, createUserId } from "./user";

describe("domains", () => {
  describe("game", () => {
    const cards = createSelectableCards([1, 2].map(createStoryPoint));

    test("throw error if initial joined user is empty", () => {
      // Arrange

      // Act
      // Assert
      expect(() => createGame(createGameId(), "name", [], cards)).toThrowError(/Users in game must/);
    });

    test("should return undefined if user did not hand yet", () => {
      // Arrange
      const userId = createUserId();
      const game = createGame(createGameId(), "name", [createGameJoinedUser(userId, "foo")], cards);

      // Act
      const card = game.findHandBy(userId);

      // Assert
      expect(card).toBeUndefined;
    });

    test("should return card if user handed before", () => {
      // Arrange
      const userId = createUserId();
      const card = createStoryPointCard(createStoryPoint(1));
      const game = createGame(createGameId(), "name", [createGameJoinedUser(userId, "foo")], cards);
      game.acceptHandBy(userId, card);

      // Act
      const ret = game.findHandBy(userId);

      // Assert
      expect(ret).toEqual(card);
    });

    test("should update card if user hand once more", () => {
      // Arrange
      const userId = createUserId();
      const card = createStoryPointCard(createStoryPoint(1));
      const card2 = createStoryPointCard(createStoryPoint(2));
      const game = createGame(createGameId(), "name", [createGameJoinedUser(userId, "foo")], cards);
      game.acceptHandBy(userId, card);
      game.acceptHandBy(userId, card2);

      // Act
      const ret = game.findHandBy(userId);

      // Assert
      expect(game.userHands).toHaveLength(1);
      expect(ret).toEqual(card2);
    });

    test("should not be able to show down when all user did not hand yet", () => {
      // Arrange
      const user = createGameJoinedUser(createUserId(), "foo");
      const game = createGame(createGameId(), "name", [user], cards);

      // Act
      const ret = game.showDown();

      // Assert
      expect(ret).toBeUndefined;
    });

    test("should be able to show down when least one user handed", () => {
      // Arrange
      const user1 = createUserId();
      const user2 = createUserId();

      const card = createStoryPointCard(createStoryPoint(1));
      const game = createGame(createGameId(), "name", [createGameJoinedUser(user1, "foo")], cards);

      // Act
      game.acceptToBeJoinedBy(createUser(user2, "2"));
      game.acceptHandBy(user1, card);
      const ret = game.showDown();

      // Assert
      expect(game.userHands).toHaveLength(1);
      expect(game.showedDown).toBeTruthy;
      expect(ret).not.toBeUndefined;
    });

    test("should return undefined as average when the game does not show down yet", () => {
      // Arrange
      const user1 = createGameJoinedUser(createUserId(), "foo");
      const game = createGame(createGameId(), "name", [user1], cards);

      // Act
      const ret = game.calculateAverage();

      // Assert
      expect(ret).toBeUndefined;
    });

    test("should return average story point when the game showed down", () => {
      // Arrange
      const user1 = createGameJoinedUser(createUserId(), "foo");
      const user2 = createGameJoinedUser(createUserId(), "bar");
      const card1 = createStoryPointCard(createStoryPoint(1));
      const card2 = createStoryPointCard(createStoryPoint(3));
      const game = createGame(createGameId(), "name", [user1, user2], cards);
      game.acceptHandBy(user1.userId, card1);
      game.acceptHandBy(user2.userId, card2);
      game.showDown();

      // Act
      const ret = game.calculateAverage();

      // Assert
      expect(ret?.value).toEqual(2);
    });

    test("should ignore give up card to calculate average", () => {
      // Arrange
      const user1 = createGameJoinedUser(createUserId(), "foo");
      const user2 = createGameJoinedUser(createUserId(), "bar");
      const card1 = createStoryPointCard(createStoryPoint(1));
      const card2 = createGiveUpCard();
      const game = createGame(createGameId(), "name", [user1, user2], cards);

      game.acceptHandBy(user1.userId, card1);
      game.acceptHandBy(user2.userId, card2);
      game.showDown();

      // Act
      const ret = game.calculateAverage();

      // Assert
      expect(ret?.value).toEqual(1);
    });

    test("should be able to add user while game", () => {
      // Arrange
      const user1 = createGameJoinedUser(createUserId(), "foo");
      const user2 = createUser(createUserId(), "user2");
      const game = createGame(createGameId(), "name", [user1], cards);

      // Act
      const event = game.acceptToBeJoinedBy(user2);

      // Assert
      expect(game.joinedUsers).toHaveLength(2);
      expect(game.joinedUsers.map((v) => v.userId)).toEqual([user1.userId, user2.id]);
      expect(event?.gameId).toBe(game.id);
      expect(event?.name).toBe("user2");
      expect(event?.userId).toBe(user2.id);
    });

    test("should not return event if user can not accept to join", () => {
      // Arrange
      const user1 = createUser(createUserId(), "user");
      const game = createGame(createGameId(), "name", [createGameJoinedUser(user1.id, user1.name)], cards);

      // Act
      const event = game.acceptToBeJoinedBy(user1);

      // Assert
      expect(game.joinedUsers).toHaveLength(1);
      expect(event).toBeUndefined;
    });
  });
});

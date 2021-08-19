import { createGiveUpCard, createStoryPointCard } from "./card";
import { createGame } from "./game";
import { createStoryPoint } from "./story-point";
import { createUserId } from "./user";

describe("domains", () => {
  describe("game", () => {
    test("throw error if initial joined user is empty", () => {
      // Arrange

      // Act
      // Assert
      expect(() => createGame([])).toThrowError();
    });

    test("should return undefined if user did not hand yet", () => {
      // Arrange
      const userId = createUserId();
      const game = createGame([userId]);

      // Act
      const card = game.findHandBy(userId);

      // Assert
      expect(card).toBeUndefined;
    });

    test("should return card if user handed before", () => {
      // Arrange
      const userId = createUserId();
      const card = createStoryPointCard(createStoryPoint(1));
      let game = createGame([userId]);
      game = game.acceptHandBy(userId, card);

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
      let game = createGame([userId]);
      game = game.acceptHandBy(userId, card);
      game = game.acceptHandBy(userId, card2);

      // Act
      const ret = game.findHandBy(userId);

      // Assert
      expect(game.userHands).toHaveLength(1);
      expect(ret).toEqual(card2);
    });

    test("should not be able to show down when all user did not hand yet", () => {
      // Arrange
      const userId = createUserId();
      let game = createGame([userId]);

      // Act
      const ret = game.showDown();

      // Assert
      expect(ret.showedDown).toBeFalsy;
    });

    test("should be able to show down when least one user handed", () => {
      // Arrange
      const user1 = createUserId();
      const user2 = createUserId();
      const card = createStoryPointCard(createStoryPoint(1));
      let game = createGame([user1, user2]);
      game = game.acceptHandBy(user1, card);

      // Act
      const ret = game.showDown();

      // Assert
      expect(ret.userHands).toHaveLength(1);
      expect(ret.showedDown).toBeTruthy;
    });

    test("should return undefined as average when the game does not show down yet", () => {
      // Arrange
      const user1 = createUserId();
      let game = createGame([user1]);

      // Act
      const ret = game.calculateAverage();

      // Assert
      expect(ret).toBeUndefined;
    });

    test("should return average story point when the game showed down", () => {
      // Arrange
      const user1 = createUserId();
      const user2 = createUserId();
      const card1 = createStoryPointCard(createStoryPoint(1));
      const card2 = createStoryPointCard(createStoryPoint(3));
      let game = createGame([user1]);
      game = game.acceptHandBy(user1, card1);
      game = game.acceptHandBy(user2, card2);
      game = game.showDown();

      // Act
      const ret = game.calculateAverage();

      // Assert
      expect(ret?.value).toEqual(2);
    });

    test("should ignore give up card to calculate average", () => {
      // Arrange
      const user1 = createUserId();
      const user2 = createUserId();
      const card1 = createStoryPointCard(createStoryPoint(1));
      const card2 = createGiveUpCard();
      let game = createGame([user1]);
      game = game.acceptHandBy(user1, card1);
      game = game.acceptHandBy(user2, card2);
      game = game.showDown();

      // Act
      const ret = game.calculateAverage();

      // Assert
      expect(ret?.value).toEqual(1);
    });

    test("should be able to add user while game", () => {
      // Arrange
      const user1 = createUserId();
      const user2 = createUserId();
      let game = createGame([user1]);

      // Act
      game = game.addPartiticatedUserOnTheWay(user2);

      // Assert
      expect(game.joinedUsers).toHaveLength(2);
    });
  });
});

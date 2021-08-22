import { UserCardSelected } from "@/domains/event";
import { createGame, createGameId, Game } from "@/domains/game";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createStoryPoint } from "@/domains/story-point";
import { createUserId } from "@/domains/user";
import { createMockedDispatcher, createMockedGameRepository } from "@/lib.test";
import { createGiveUpCard } from "@/domains/card";
import { HandCardUseCase } from "./hand-card";

describe("use case", () => {
  describe("hand card", () => {
    test("should return error if game is not found", async () => {
      // Arrange
      const input = {
        userId: createUserId(),
        gameId: createGameId(),
        card: createGiveUpCard(),
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();

      const useCase = new HandCardUseCase(dispatcher, repository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toEqual("notFoundGame");
    });

    test("should save game handed card by user", async () => {
      // Arrange
      const game = createGame(createGameId(), "name", [createUserId()], createSelectableCards([createStoryPoint(1)]));
      const input = {
        userId: game.joinedUsers[0],
        gameId: game.id,
        card: createGiveUpCard(),
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();
      repository.findBy.mockImplementation(() => game);

      const useCase = new HandCardUseCase(dispatcher, repository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toEqual("success");
      expect(game.userHands).toContainEqual({
        userId: input.userId,
        card: input.card,
      });
    });

    test("should dispatch UserHanded event", async () => {
      // Arrange
      const game = createGame(createGameId(), "name", [createUserId()], createSelectableCards([createStoryPoint(1)]));
      const input = {
        userId: game.joinedUsers[0],
        gameId: game.id,
        card: createGiveUpCard(),
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();
      repository.findBy.mockImplementation(() => game);

      const useCase = new HandCardUseCase(dispatcher, repository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toEqual("success");
      const called = dispatcher.dispatch.mock.calls[0][0] as UserCardSelected;

      expect(called.card).toEqual(input.card);
      expect(called.gameId).toEqual(game.id);
      expect(called.userId).toEqual(input.userId);
    });
  });
});

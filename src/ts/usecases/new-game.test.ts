import { NewGameStarted } from "@/domains/event";
import { createGame, createGameId } from "@/domains/game";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createStoryPoint } from "@/domains/story-point";
import { createUserId } from "@/domains/user";
import { createMockedDispatcher, createMockedGameRepository } from "@/lib.test";
import { createGiveUpCard } from "@/domains/card";
import { NewGameUseCase } from "./new-game";

describe("use case", () => {
  describe("new game", () => {
    test("should return error if game is not found", async () => {
      // Arrange
      const input = {
        gameId: createGameId(),
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();

      const useCase = new NewGameUseCase(dispatcher, repository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toEqual("notFoundGame");
    });

    test("should save game showed down", async () => {
      // Arrange
      const game = createGame(createGameId(), "name", [createUserId()], createSelectableCards([createStoryPoint(1)]));
      game.acceptHandBy(game.joinedUsers[0], createGiveUpCard());

      const input = {
        gameId: game.id,
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();
      repository.findBy.mockImplementation(() => game);

      const useCase = new NewGameUseCase(dispatcher, repository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toEqual("success");
      expect(game.userHands).toHaveLength(0);
    });

    test("should dispatch NewGame event", async () => {
      // Arrange
      const game = createGame(createGameId(), "name", [createUserId()], createSelectableCards([createStoryPoint(1)]));

      const input = {
        gameId: game.id,
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();
      repository.findBy.mockImplementation(() => game);

      const useCase = new NewGameUseCase(dispatcher, repository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toEqual("success");
      const called = dispatcher.dispatch.mock.calls[0][0] as NewGameStarted;
      expect(called.kind).toEqual("NewGameStarted");
    });
  });
});

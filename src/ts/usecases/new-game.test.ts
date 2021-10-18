import { NewGameStarted } from "~/src/ts/domains/event";
import { createGame, createGameId } from "~/src/ts/domains/game";
import { createSelectableCards } from "~/src/ts/domains/selectable-cards";
import { createStoryPoint } from "~/src/ts/domains/story-point";
import { createMockedDispatcher, createMockedGameRepository } from "~/src/ts/lib.test";
import { NewGameUseCase } from "./new-game";
import { createGamePlayerId } from "~/src/ts/domains/game-player";

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
      const game = createGame({
        id: createGameId(),
        name: "name",
        players: [createGamePlayerId()],
        cards: createSelectableCards([createStoryPoint(1)]),
      });

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
    });

    test("should dispatch NewGame event", async () => {
      // Arrange
      const game = createGame({
        id: createGameId(),
        name: "name",
        players: [createGamePlayerId()],
        cards: createSelectableCards([createStoryPoint(1)]),
      });

      const input = {
        gameId: game.id,
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();
      repository.findBy.mockImplementation(() => game);

      const useCase = new NewGameUseCase(dispatcher, repository);

      // Act
      await useCase.execute(input);

      // Assert
      const called = dispatcher.dispatch.mock.calls[0][0] as NewGameStarted;
      expect(called.kind).toEqual("NewGameStarted");
    });
  });
});

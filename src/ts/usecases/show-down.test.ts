import { GameShowedDown } from "@/domains/event";
import { createGame, createGameId, Game } from "@/domains/game";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createStoryPoint } from "@/domains/story-point";
import { createUserId } from "@/domains/user";
import { createMockedDispatcher, createMockedGameRepository } from "@/lib.test";
import { createGiveUpCard } from "@/domains/card";
import { ShowDownUseCase } from "./show-down";

describe("use case", () => {
  describe("show down", () => {
    test("should return error if game is not found", () => {
      // Arrange
      const input = {
        gameId: createGameId(),
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();

      const useCase = new ShowDownUseCase(dispatcher, repository);

      // Act
      const ret = useCase.execute(input);

      // Assert
      expect(ret.kind).toEqual("notFoundGame");
    });

    test("should save game showed down", () => {
      // Arrange
      const game = createGame(createGameId(), "name", [createUserId()], createSelectableCards([createStoryPoint(1)]));
      game.acceptHandBy(game.joinedUsers[0], createGiveUpCard());

      const input = {
        gameId: game.id,
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();
      repository.findBy.mockImplementation(() => game);

      const useCase = new ShowDownUseCase(dispatcher, repository);

      // Act
      const ret = useCase.execute(input);

      // Assert
      expect(ret.kind).toEqual("success");
      expect(game.showedDown).toBeTruthy;
    });

    test("should dispatch ShowedDown event", () => {
      // Arrange
      const game = createGame(createGameId(), "name", [createUserId()], createSelectableCards([createStoryPoint(1)]));
      game.acceptHandBy(game.joinedUsers[0], createGiveUpCard());

      const input = {
        gameId: game.id,
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();
      repository.findBy.mockImplementation(() => game);

      const useCase = new ShowDownUseCase(dispatcher, repository);

      // Act
      const ret = useCase.execute(input);

      // Assert
      expect(ret.kind).toEqual("success");
      const called = dispatcher.dispatch.mock.calls[0][0] as GameShowedDown;

      expect(called.gameId).toEqual(game.id);
    });
  });
});

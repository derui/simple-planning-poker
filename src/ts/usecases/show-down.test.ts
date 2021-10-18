import { GameShowedDown } from "~/src/ts/domains/event";
import { createGame, createGameId } from "~/src/ts/domains/game";
import { createSelectableCards } from "~/src/ts/domains/selectable-cards";
import { createStoryPoint } from "~/src/ts/domains/story-point";
import { createUserId } from "~/src/ts/domains/user";
import { createMockedDispatcher, createMockedGameRepository } from "~/src/ts/lib.test";
import { createGiveUpCard } from "~/src/ts/domains/card";
import { ShowDownUseCase } from "./show-down";
import { createGamePlayer, createGamePlayerId } from "~/src/ts/domains/game-player";

describe("use case", () => {
  describe("show down", () => {
    const CARDS = createSelectableCards([createStoryPoint(1)]);

    test("should return error if game is not found", async () => {
      // Arrange
      const input = {
        gameId: createGameId(),
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();

      const useCase = new ShowDownUseCase(dispatcher, repository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toEqual("notFoundGame");
    });

    test("should save game showed down", async () => {
      // Arrange
      const gameId = createGameId();
      const player = createGamePlayer({
        id: createGamePlayerId(),
        gameId,
        userId: createUserId(),
        cards: CARDS,
      });
      const game = createGame({
        id: gameId,
        name: "game",
        players: [player.id],
        cards: CARDS,
        hands: [{ playerId: player.id, card: CARDS.at(0) }],
      });

      const input = {
        gameId: game.id,
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();
      repository.findBy.mockImplementation(() => game);

      const useCase = new ShowDownUseCase(dispatcher, repository);

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toEqual("success");
      expect(game.showedDown).toBeTruthy;
    });

    test("should dispatch ShowedDown event", async () => {
      // Arrange
      const gameId = createGameId();
      const player = createGamePlayer({
        id: createGamePlayerId(),
        gameId,
        userId: createUserId(),
        cards: CARDS,
      });
      const game = createGame({
        id: gameId,
        name: "game",
        players: [player.id],
        cards: CARDS,
        hands: [{ playerId: player.id, card: CARDS.at(0) }],
      });

      const input = {
        gameId: game.id,
      };
      const repository = createMockedGameRepository();
      const dispatcher = createMockedDispatcher();
      repository.findBy.mockImplementation(() => game);

      const useCase = new ShowDownUseCase(dispatcher, repository);

      // Act
      await useCase.execute(input);

      // Assert
      const called = dispatcher.dispatch.mock.calls[0][0] as GameShowedDown;

      expect(called.gameId).toEqual(game.id);
    });
  });
});

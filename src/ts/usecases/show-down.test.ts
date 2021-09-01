import { GameShowedDown } from "@/domains/event";
import { createGame, createGameId } from "@/domains/game";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createStoryPoint } from "@/domains/story-point";
import { createUserId } from "@/domains/user";
import { createMockedDispatcher, createMockedGameRepository } from "@/lib.test";
import { createGiveUpCard } from "@/domains/card";
import { ShowDownUseCase } from "./show-down";
import { createGameJoinedUser } from "@/domains/game-joined-user";

describe("use case", () => {
  describe("show down", () => {
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
      const user = createGameJoinedUser(createUserId(), "foo");
      const game = createGame(createGameId(), "name", [user], createSelectableCards([createStoryPoint(1)]));
      game.acceptHandBy(game.joinedUsers[0].userId, createGiveUpCard());

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
      const user = createGameJoinedUser(createUserId(), "foo");
      const game = createGame(createGameId(), "name", [user], createSelectableCards([createStoryPoint(1)]));
      game.acceptHandBy(game.joinedUsers[0].userId, createGiveUpCard());

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
      const called = dispatcher.dispatch.mock.calls[0][0] as GameShowedDown;

      expect(called.gameId).toEqual(game.id);
    });
  });
});

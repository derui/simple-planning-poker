import { DOMAIN_EVENTS } from "./event";
import { createGame, createGameId } from "./game";
import { createGamePlayer, createGamePlayerId } from "./game-player";
import { GamePlayerRepository } from "./game-player-repository";
import { GameRepository } from "./game-repository";
import { createInvitationService } from "./invitation-service";
import { createSelectableCards } from "./selectable-cards";
import { createStoryPoint } from "./story-point";
import { createUser, createUserId } from "./user";

describe("domains", () => {
  describe("invitation service", () => {
    const CARDS = createSelectableCards([1, 2].map((v) => createStoryPoint(v)));

    test("should return no events if game is not found", async () => {
      // Arrange
      const gameRepository: GameRepository = {
        save: jest.fn(),
        findBy: jest.fn().mockImplementation(() => undefined),
      };
      const gamePlayerRepository: GamePlayerRepository = {
        save: jest.fn(),
        findBy: jest.fn(),
      };

      const service = createInvitationService(gameRepository, gamePlayerRepository);

      // Act
      const user = createUser({ id: createUserId(), name: "foo" });
      const ret = await service.invite(user, createGameId());

      // Assert
      expect(ret).toHaveLength(0);
    });

    test("should return domain event to notify player joined", async () => {
      // Arrange
      const user = createUser({ id: createUserId(), name: "foo" });
      const player = createGamePlayer({
        id: createGamePlayerId(),
        userId: user.id,
        gameId: createGameId(),
        cards: CARDS,
      });

      const game = createGame({
        id: createGameId(),
        name: "name",
        players: [player.id],
        cards: CARDS,
      });
      const gameRepository: GameRepository = {
        save: jest.fn(),
        findBy: jest.fn().mockImplementation(() => game),
      };
      const gamePlayerRepository: GamePlayerRepository = {
        save: jest.fn(),
        findBy: jest.fn(),
      };

      const service = createInvitationService(gameRepository, gamePlayerRepository);

      // Act
      const ret = await service.invite(user, createGameId());

      // Assert
      expect(ret).toHaveLength(1);
      expect(ret[0].kind).toEqual(DOMAIN_EVENTS.UserInvited);
    });

    test("should save a new player", async () => {
      // Arrange
      const user = createUser({ id: createUserId(), name: "foo" });
      const game = createGame({
        id: createGameId(),
        name: "name",
        players: [createGamePlayerId()],
        cards: CARDS,
      });
      const gameRepository: GameRepository = {
        save: jest.fn(),
        findBy: jest.fn().mockImplementation(() => game),
      };
      const save = jest.fn();
      const gamePlayerRepository: GamePlayerRepository = {
        save,
        findBy: jest.fn(),
      };

      const service = createInvitationService(gameRepository, gamePlayerRepository);

      // Act
      await service.invite(user, createGameId());

      // Assert
      expect(save).toBeCalledTimes(1);
    });
  });
});

import { createGame, createGameId } from "@/domains/game";
import { createGamePlayer, createGamePlayerId } from "@/domains/game-player";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createStoryPoint } from "@/domains/story-point";
import { createUserId } from "@/domains/user";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { GamePlayerRepositoryImpl } from "./game-player-repository";
import { GameRepositoryImpl } from "./game-repository";

describe("infrastructure", () => {
  describe("game player repository", () => {
    let database: any;
    let testEnv: RulesTestEnvironment;

    beforeAll(async () => {
      testEnv = await initializeTestEnvironment({
        projectId: "demo-project-1234",
        database: {
          host: "localhost",
          port: 9000,
        },
      });
      database = testEnv.authenticatedContext("alice").database();
    });

    afterAll(async () => {
      testEnv.cleanup();
    });

    afterEach(async () => {
      await testEnv.clearDatabase();
    });

    test("should be able to save and find a game player", async () => {
      // Arrange
      const game = createGame({
        id: createGameId(),
        name: "test",
        players: [createGamePlayerId()],
        cards: createSelectableCards([1, 2].map(createStoryPoint)),
      });

      const player = createGamePlayer({
        id: game.players[0],
        userId: createUserId(),
        gameId: game.id,
        cards: game.cards,
      });

      const gameRepository = new GameRepositoryImpl(database);
      const repository = new GamePlayerRepositoryImpl(database);

      // Act
      await gameRepository.save(game);
      await repository.save(player);
      const instance = await repository.findBy(player.id);

      // Assert
      expect(instance?.id).toEqual(player.id);
      expect(instance?.mode).toEqual(player.mode);
      expect(instance?.user).toEqual(player.user);
      expect(instance?.hand).toEqual(player.hand);
    });

    test("should not be able find a game if it did not save before", async () => {
      // Arrange
      const repository = new GamePlayerRepositoryImpl(database);

      // Act
      const instance = await repository.findBy(createGamePlayerId());

      // Assert
      expect(instance).toBeUndefined();
    });
  });
});

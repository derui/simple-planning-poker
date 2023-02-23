import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import * as Game from "@/domains/game";
import * as GamePlayer from "@/domains/game-player";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { GamePlayerRepositoryImpl } from "./game-player-repository";
import { GameRepositoryImpl } from "./game-repository";

let database: any;
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-project-1234",
    database: {},
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
  const game = Game.create({
    id: Game.createId(),
    name: "test",
    players: [GamePlayer.createId()],
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
  });

  const player = GamePlayer.createGamePlayer({
    id: game.players[0],
    userId: User.createId(),
    gameId: game.id,
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
  const instance = await repository.findBy(GamePlayer.createId());

  // Assert
  expect(instance).toBeUndefined();
});

test("should be able to delete a player", async () => {
  // Arrange
  const game = Game.create({
    id: Game.createId(),
    name: "test",
    players: [GamePlayer.createId()],
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
  });

  const player = GamePlayer.createGamePlayer({
    id: game.players[0],
    userId: User.createId(),
    gameId: game.id,
  });

  const gameRepository = new GameRepositoryImpl(database);
  const repository = new GamePlayerRepositoryImpl(database);

  // Act
  await gameRepository.save(game);
  await repository.save(player);
  await repository.delete(player);
  const instance = await repository.findBy(player.id);

  // Assert
  expect(instance).toBeUndefined();
});

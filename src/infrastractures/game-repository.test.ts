import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import * as Game from "@/domains/game";
import * as GamePlayer from "@/domains/game-player";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { get, ref } from "firebase/database";
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

test("should be able to save and find a game", async () => {
  // Arrange
  const game = Game.create({
    id: Game.createId(),
    name: "test",
    players: [GamePlayer.createId()],
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
  });

  const player = GamePlayer.create({
    id: game.players[0],
    userId: User.createId(),
    gameId: game.id,
  });

  const repository = new GameRepositoryImpl(database);
  const playerRepository = new GamePlayerRepositoryImpl(database);

  // Act
  await playerRepository.save(player);
  await repository.save(game);
  const instance = await repository.findBy(game.id);

  // Assert
  expect(instance?.id).toEqual(game.id);
  expect(instance?.name).toEqual(game.name);
  expect(instance?.players).toEqual(game.players);
  expect(instance?.cards).toEqual(game.cards);
});

test("should not be able find a game if it did not save before", async () => {
  // Arrange
  const repository = new GameRepositoryImpl(database);

  // Act
  const instance = await repository.findBy(Game.createId());

  // Assert
  expect(instance).toBeUndefined();
});

test("should save invitation in key", async () => {
  // Arrange
  const game = Game.create({
    id: Game.createId(),
    name: "test",
    players: [GamePlayer.createId()],
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
  });

  const player = GamePlayer.create({
    id: game.players[0],
    userId: User.createId(),
    gameId: game.id,
  });

  const repository = new GameRepositoryImpl(database);
  const playerRepository = new GamePlayerRepositoryImpl(database);

  // Act
  await playerRepository.save(player);
  await repository.save(game);

  // Assert
  const snapshot = await get(ref(database, `/invitations/${Game.makeInvitation(game).signature}`));
  expect(snapshot.val()).toEqual(game.id);
});

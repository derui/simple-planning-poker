import { test, expect, beforeAll, afterAll, afterEach } from "vitest";

import { create, createId } from "@/domains/game";
import { createGamePlayer, createId } from "@/domains/game-player";
import { create } from "@/domains/selectable-cards";
import { create } from "@/domains/story-point";
import { createId } from "@/domains/user";
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
  const game = create({
    id: createId(),
    name: "test",
    players: [createId()],
    cards: create([1, 2].map(create)),
  });

  const player = createGamePlayer({
    id: game.players[0],
    userId: createId(),
    gameId: game.id,
    cards: game.cards,
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
  expect(instance?.cards?.cards).toEqual(game.cards.cards);
});

test("should not be able find a game if it did not save before", async () => {
  // Arrange
  const repository = new GameRepositoryImpl(database);

  // Act
  const instance = await repository.findBy(createId());

  // Assert
  expect(instance).toBeUndefined();
});

test("should save invitation in key", async () => {
  // Arrange
  const game = create({
    id: createId(),
    name: "test",
    players: [createId()],
    cards: create([1, 2].map(create)),
  });

  const player = createGamePlayer({
    id: game.players[0],
    userId: createId(),
    gameId: game.id,
    cards: game.cards,
  });

  const repository = new GameRepositoryImpl(database);
  const playerRepository = new GamePlayerRepositoryImpl(database);

  // Act
  await playerRepository.save(player);
  await repository.save(game);

  // Assert
  const snapshot = await get(ref(database, `/invitations/${game.makeInvitation().signature}`));
  expect(snapshot.val()).toEqual(game.id);
});

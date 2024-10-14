import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { Database, push, ref, set } from "firebase/database";
import { v4 } from "uuid";
import { GameRepositoryImpl } from "./game-repository.js";
import { ownerGames } from "./user-ref-resolver.js";
import { Game, ApplicablePoints, StoryPoint, User } from "@spp/shared-domain";

let database: Database;
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: v4(),
    database: {
      host: "127.0.0.1",
      port: 9000,
    },
  });

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  database = testEnv.authenticatedContext("alice").database() as unknown as Database;
});

afterAll(async () => {
  await testEnv.cleanup();
});

afterEach(async () => {
  await testEnv.clearDatabase();
});

test("should be able to save and find a game", async () => {
  // Arrange
  let [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: User.createId("id"),
    points: ApplicablePoints.create([1, 2].map(StoryPoint.create)),
  });

  const repository = new GameRepositoryImpl(database);

  // Act
  await repository.save(game);
  const instance = await repository.findBy(game.id);

  // Assert
  expect(instance?.id).toEqual(game.id);
  expect(instance?.name).toEqual(game.name);
  expect(instance?.points).toEqual(game.points);
});

test("should not be able find a game if it did not save before", async () => {
  // Arrange
  const repository = new GameRepositoryImpl(database);

  // Act
  const instance = await repository.findBy(Game.createId());

  // Assert
  expect(instance).toBeUndefined();
});

test("should be able to list games an user created", async () => {
  // Arrange
  const repository = new GameRepositoryImpl(database);

  const [game] = Game.create({
    id: Game.createId("1"),
    name: "name",
    owner: User.createId("1"),
    points: ApplicablePoints.create([1, 2].map(StoryPoint.create)),
  });
  const [otherGame] = Game.create({
    id: Game.createId("2"),
    name: "name2",
    owner: User.createId("2"),
    points: ApplicablePoints.create([1, 2].map(StoryPoint.create)),
  });

  await repository.save(game);
  await repository.save(otherGame);

  const data = [
    { id: User.createId("1"), relation: "player", gameId: game.id },
    { id: User.createId("2"), relation: "player", gameId: otherGame.id },
  ];

  for (const { id, ...rest } of data) {
    const newRef = push(ref(database, ownerGames(User.createId(id))));
    await set(newRef, rest);
  }

  // Act
  const ret = await repository.listUserCreated(User.createId("1"));

  // Assert
  expect(ret.map((v) => v.id)).toEqual(expect.arrayContaining([game.id]));
});

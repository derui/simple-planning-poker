import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { Database, push, ref, set } from "firebase/database";
import { v4 } from "uuid";
import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { getDatabase, setDatabase } from "./database.js";
import { GameRepository } from "./game-repository.js";
import { ownerGames } from "./user-ref-resolver.js";

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
  const database = testEnv.authenticatedContext("alice").database() as unknown as Database;
  setDatabase(database);
});

afterAll(async () => {
  await testEnv.cleanup();
});

afterEach(async () => {
  await testEnv.clearDatabase();
});

test("should be able to save and find a game", async () => {
  // Arrange
  const [game] = Game.create({
    id: Game.createId(),
    name: GameName.create("test"),
    owner: User.createId("id"),
    points: ApplicablePoints.create([1, 2].map(StoryPoint.create)),
  });

  // Act
  await GameRepository.save({ game });
  const instance = await GameRepository.findBy({ id: game.id });

  // Assert
  expect(instance?.id).toEqual(game.id);
  expect(instance?.name).toEqual(game.name);
  expect(instance?.points).toEqual(game.points);
});

test("should not be able find a game if it did not save before", async () => {
  // Arrange

  // Act
  const instance = await GameRepository.findBy({ id: Game.createId() });

  // Assert
  expect(instance).toBeUndefined();
});

test("should be able to list games an user created", async () => {
  // Arrange
  const [game] = Game.create({
    id: Game.createId("1"),
    name: GameName.create("name"),
    owner: User.createId("1"),
    points: ApplicablePoints.create([1, 2].map(StoryPoint.create)),
  });
  const [otherGame] = Game.create({
    id: Game.createId("2"),
    name: GameName.create("name2"),
    owner: User.createId("2"),
    points: ApplicablePoints.create([1, 2].map(StoryPoint.create)),
  });

  await GameRepository.save({ game });
  await GameRepository.save({ game: otherGame });

  const data = [
    { id: User.createId("1"), gameId: game.id },
    { id: User.createId("2"), gameId: otherGame.id },
  ];

  for (const { id, gameId } of data) {
    const newRef = push(ref(getDatabase(), ownerGames(User.createId(id))));
    await set(newRef, { gameId });
  }

  // Act
  const ret = await GameRepository.listUserCreated({ user: User.createId("1") });

  // Assert
  expect(ret.map((v) => v.id)).toEqual(expect.arrayContaining([game.id]));
});

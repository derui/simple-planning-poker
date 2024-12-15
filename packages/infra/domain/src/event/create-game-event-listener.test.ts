import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { Database } from "firebase/database";
import { v4 } from "uuid";
import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { setDatabase } from "../database.js";
import { GameRepository } from "../game-repository.js";
import { UserRepository } from "../user-repository.js";
import { CreateGameEventListener } from "./create-game-event-listener.js";

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
  const database = testEnv.authenticatedContext(v4()).database() as unknown as Database;
  setDatabase(database);
});

afterAll(async () => {
  await testEnv.cleanup();
});

afterEach(async () => {
  await testEnv.clearDatabase();
});

test("should be created user as owner", async () => {
  // Arrange
  const owner = User.create({ id: User.createId(), name: "name" });
  const [game, event] = Game.create({
    id: Game.createId(),
    name: GameName.create("test"),
    owner: owner.id,
    points: ApplicablePoints.create([1, 2].map(StoryPoint.create)),
  });
  const listener = new CreateGameEventListener();
  await GameRepository.save({ game });
  await UserRepository.save({ user: owner });

  // Act
  await listener.handle(event);
  const createdGames = await GameRepository.listUserCreated({ user: owner.id });

  // Assert
  expect(createdGames).toEqual([game]);
});

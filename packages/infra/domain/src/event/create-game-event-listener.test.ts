import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { v4 } from "uuid";
import { UserRepositoryImpl } from "../user-repository.js";
import { GameRepositoryImpl } from "../game-repository.js";
import { CreateGameEventListener } from "./create-game-event-listener.js";
import { Game, ApplicablePoints, StoryPoint, User } from "@spp/shared-domain";
import { Database } from "firebase/database";

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
  database = testEnv.authenticatedContext(v4()).database() as unknown as Database;
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
    name: "test",
    owner: owner.id,
    points: ApplicablePoints.create([1, 2].map(StoryPoint.create)),
  });
  const userRepository = new UserRepositoryImpl(database);
  const listener = new CreateGameEventListener(database);
  const repository = new GameRepositoryImpl(database);
  await repository.save(game);
  await userRepository.save(owner);

  // Act
  await listener.handle(event);
  const createdGames = await repository.listUserCreated(owner.id);

  // Assert
  expect(createdGames).toEqual([game]);
});

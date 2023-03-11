import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { v4 } from "uuid";
import { UserRepositoryImpl } from "../user-repository";
import { GameRepositoryImpl } from "../game-repository";
import { RoundRepositoryImpl } from "../round-repository";
import { CreateGameEventListener } from "./create-game-event-listener";
import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";

let database: any;
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: v4(),
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

test("should add joined user as owner", async () => {
  // Arrange
  const owner = User.create({ id: User.createId(), name: "name" });
  const [game, event] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: owner.id,
    joinedPlayers: [],
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
    finishedRounds: [],
  });
  const userRepository = new UserRepositoryImpl(database);
  const listener = new CreateGameEventListener(database);
  const repository = new GameRepositoryImpl(database, new RoundRepositoryImpl(database));
  await userRepository.save(owner);

  // Act
  await listener.handle(event);
  const joinedGames = await repository.listUserJoined(owner.id);

  // Assert
  expect(joinedGames).toEqual([{ id: game.id, name: "test" }]);
});

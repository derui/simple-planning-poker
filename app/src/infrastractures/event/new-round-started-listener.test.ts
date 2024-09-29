import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { v4 } from "uuid";
import { GameRepositoryImpl } from "../game-repository";
import { NewRoundStartedListener } from "./new-round-started-listener";
import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import { randomRound } from "@/test-lib";

let database: any;
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: v4(),
    database: {
      host: "127.0.0.1",
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

test("should create round with id", async () => {
  // Arrange
  const owner = User.create({ id: User.createId(), name: "name" });
  const round = randomRound();
  const [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: owner.id,
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
    round: round.id,
  });
  const repository = new GameRepositoryImpl(database);
  const listener = new NewRoundStartedListener(repository);
  const [newRound, event] = Game.newRound(game);
  await repository.save(game);

  // Act
  await listener.handle(event);
  const actual = await repository.findBy(game.id);

  // Assert
  expect(actual?.round).toBe(newRound.id);
});

import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { v4 } from "uuid";
import { RoundRepositoryImpl } from "../round-repository";
import { CreateRoundAfterCreateGameListener } from "./create-round-after-create-game-listener";
import * as Game from "@/domains/game";
import * as Round from "@/domains/round";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";

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
  const roundId = Round.createId();
  const [game, event] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: owner.id,
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
    finishedRounds: [],
    round: roundId,
  });
  const repository = new RoundRepositoryImpl(database);
  const listener = new CreateRoundAfterCreateGameListener(repository);

  // Act
  await listener.handle(event);
  const round = await repository.findBy(roundId);

  // Assert
  expect(round?.cards).toEqual(game.cards);
});

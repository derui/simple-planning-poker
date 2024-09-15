import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { v4 } from "uuid";
import { VotingRepositoryImpl } from "../voting-repository.js";
import { CreateVotingAfterCreateGameListener } from "./create-voting-after-create-game-listener.js";
import { Database } from "firebase/database";
import { User, Voting, Game, ApplicablePoints, StoryPoint } from "@spp/shared-domain";

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

test("should create round with id", async () => {
  // Arrange
  const owner = User.create({ id: User.createId(), name: "name" });
  const votingId = Voting.createId();
  const [game, event] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: owner.id,
    points: ApplicablePoints.create([1, 2].map(StoryPoint.create)),
    voting: votingId,
  });
  const repository = new VotingRepositoryImpl(database);
  const listener = new CreateVotingAfterCreateGameListener(repository);

  // Act
  await listener.handle(event);
  const round = await repository.findBy(votingId);

  // Assert
  expect(round?.points).toEqual(game.points);
});

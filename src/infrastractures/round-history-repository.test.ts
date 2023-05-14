import * as fs from "node:fs";
import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { v4 } from "uuid";
import { RoundHistoryRepositoryImpl } from "./round-history-repository";
import * as R from "@/domains/round";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import * as UserEstimation from "@/domains/user-estimation";
import { randomFinishedRound } from "@/test-lib";

let database: any;
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: v4(),
    database: {
      host: "127.0.0.1",
      port: 9000,
      rules: fs.readFileSync("database.rules.json").toString("utf-8"),
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

test("should be able to save and list round history", async () => {
  // Arrange
  const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
  const gameId = Game.createId();
  const round = R.finishedRoundOf({
    id: R.createId(),
    cards: cards,
    finishedAt: "2023-01-05T00:01:02",
    estimations: [
      { user: User.createId("user1"), estimation: UserEstimation.estimated(cards[0]) },
      { user: User.createId("user2"), estimation: UserEstimation.estimated(cards[1]) },
      { user: User.createId("user3"), estimation: UserEstimation.giveUp() },
      { user: User.createId("user4"), estimation: UserEstimation.unselected() },
    ],
  });

  const repository = new RoundHistoryRepositoryImpl(database);

  // Act
  await repository.save(gameId, round);
  const instance = await repository.listBy(gameId);

  // Assert
  expect(instance).toEqual({
    result: [{ id: round.id, finishedAt: round.finishedAt, theme: null, averagePoint: 1.5 }],
    key: round.finishedAt,
  });
});

test("should be empty if no result", async () => {
  // Arrange
  const repository = new RoundHistoryRepositoryImpl(database);

  // Act
  const ret = await repository.listBy(Game.createId());

  // Assert
  expect(ret).toEqual({ result: [], key: "" });
});

test("should be result ordered by finished at", async () => {
  // Arrange
  const gameId = Game.createId();
  const round1 = randomFinishedRound({ finishedAt: "2023-01-02T00:01:02" });
  const round2 = randomFinishedRound({ finishedAt: "2023-01-02T00:01:01" });
  const round3 = randomFinishedRound({ finishedAt: "2023-01-03T00:01:02" });

  const repository = new RoundHistoryRepositoryImpl(database);

  // Act
  await repository.save(gameId, round1);
  await repository.save(gameId, round2);
  await repository.save(gameId, round3);
  const instance = await repository.listBy(gameId);

  // Assert
  expect(instance).toEqual({
    result: [
      { id: round3.id, finishedAt: round3.finishedAt, theme: null, averagePoint: 0 },
      { id: round1.id, finishedAt: round1.finishedAt, theme: null, averagePoint: 0 },
      { id: round2.id, finishedAt: round2.finishedAt, theme: null, averagePoint: 0 },
    ],
    key: round2.finishedAt,
  });
});

test("should be able to get by offset and last key", async () => {
  // Arrange
  const gameId = Game.createId();
  const round1 = randomFinishedRound({ id: R.createId("1"), finishedAt: "2023-01-02T00:01:02", theme: "round 1" });
  const round2 = randomFinishedRound({ id: R.createId("2"), finishedAt: "2023-01-02T00:01:01" });
  const round3 = randomFinishedRound({ id: R.createId("3"), finishedAt: "2023-01-03T00:01:02" });

  const repository = new RoundHistoryRepositoryImpl(database);

  // Act
  await repository.save(gameId, round1);
  await repository.save(gameId, round2);
  await repository.save(gameId, round3);
  const ret1 = await repository.listBy(gameId, { count: 1 });
  const ret2 = await repository.listBy(gameId, { count: 1, lastKey: ret1.key });

  // Assert
  expect(ret1).toEqual({
    result: [{ id: round3.id, finishedAt: round3.finishedAt, theme: null, averagePoint: 0 }],
    key: round3.finishedAt,
  });
  expect(ret2).toEqual({
    result: [{ id: round1.id, finishedAt: round1.finishedAt, theme: "round 1", averagePoint: 0 }],
    key: round1.finishedAt,
  });
});

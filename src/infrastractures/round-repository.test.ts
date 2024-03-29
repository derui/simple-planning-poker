import { test, expect, beforeAll, afterAll, afterEach, describe } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { v4 } from "uuid";
import { RoundRepositoryImpl } from "./round-repository";
import * as R from "@/domains/round";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import * as UserEstimation from "@/domains/user-estimation";
import { parseDateTime } from "@/domains/type";
import { randomFinishedRound } from "@/test-lib";

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

test("should be able to save and find a round", async () => {
  // Arrange
  const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
  const round = R.roundOf({
    id: R.createId(),
    cards: cards,
    estimations: [
      { user: User.createId("user1"), estimation: UserEstimation.estimated(cards[0]) },
      { user: User.createId("user2"), estimation: UserEstimation.estimated(cards[1]) },
      { user: User.createId("user3"), estimation: UserEstimation.giveUp() },
      { user: User.createId("user4"), estimation: UserEstimation.unselected() },
    ],
  });

  const repository = new RoundRepositoryImpl(database);

  // Act
  await repository.save(round);
  const instance = (await repository.findBy(round.id)) as R.Round;

  // Assert
  expect(instance?.id).toEqual(round.id);
  expect(instance?.estimations).toEqual(
    Object.fromEntries([
      [User.createId("user1"), UserEstimation.estimated(cards[0])],
      [User.createId("user2"), UserEstimation.estimated(cards[1])],
      [User.createId("user3"), UserEstimation.giveUp()],
      [User.createId("user4"), UserEstimation.unselected()],
    ])
  );
  expect(instance?.cards).toEqual(round.cards);
  expect(instance?.theme).toBeNull();
});

test("should be able to save and find a finished round", async () => {
  // Arrange
  const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
  const round = R.roundOf({
    id: R.createId(),
    cards: cards,
    estimations: [
      { user: User.createId("user1"), estimation: UserEstimation.estimated(cards[0]) },
      { user: User.createId("user2"), estimation: UserEstimation.estimated(cards[1]) },
      { user: User.createId("user3"), estimation: UserEstimation.giveUp() },
      { user: User.createId("user4"), estimation: UserEstimation.unselected() },
    ],
    theme: "theme",
  });
  const [finished] = R.showDown(round, parseDateTime("2023-02-25T00:01:01.000Z"));

  const repository = new RoundRepositoryImpl(database);

  // Act
  await repository.save(round);
  await repository.save(finished);
  const instance = (await repository.findBy(round.id)) as R.FinishedRound;

  // Assert
  expect(R.isFinishedRound(instance)).toBe(true);
  expect(instance?.id).toEqual(round.id);
  expect(instance?.estimations).toEqual(
    Object.fromEntries([
      [User.createId("user1"), UserEstimation.estimated(cards[0])],
      [User.createId("user2"), UserEstimation.estimated(cards[1])],
      [User.createId("user3"), UserEstimation.giveUp()],
      [User.createId("user4"), UserEstimation.unselected()],
    ])
  );
  expect(instance?.finishedAt).toBe("2023-02-25T00:01:01.000Z");
  expect(instance?.theme).toBe("theme");
});

test("empty theme as undefined", async () => {
  // Arrange
  const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
  let round = R.roundOf({
    id: R.createId(),
    cards: cards,
    estimations: [
      { user: User.createId("user1"), estimation: UserEstimation.estimated(cards[0]) },
      { user: User.createId("user2"), estimation: UserEstimation.estimated(cards[1]) },
      { user: User.createId("user3"), estimation: UserEstimation.giveUp() },
      { user: User.createId("user4"), estimation: UserEstimation.unselected() },
    ],
    theme: "",
  });

  const repository = new RoundRepositoryImpl(database);

  // Act
  await repository.save(round);
  const instance = (await repository.findBy(round.id)) as R.FinishedRound;

  // Assert
  expect(instance?.id).toEqual(round.id);
  expect(instance?.estimations).toEqual(
    Object.fromEntries([
      [User.createId("user1"), UserEstimation.estimated(cards[0])],
      [User.createId("user2"), UserEstimation.estimated(cards[1])],
      [User.createId("user3"), UserEstimation.giveUp()],
      [User.createId("user4"), UserEstimation.unselected()],
    ])
  );
  expect(instance?.theme).toBeNull();
});

test("should not be able find a game if it did not save before", async () => {
  // Arrange
  const repository = new RoundRepositoryImpl(database);

  // Act
  const instance = await repository.findBy(R.createId());

  // Assert
  expect(instance).toBeNull();
});

describe("find finished round by", () => {
  test("should return null when the round is not finished", async () => {
    // Arrange
    const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
    const repository = new RoundRepositoryImpl(database);
    let round = R.roundOf({
      id: R.createId(),
      cards: cards,
      estimations: [
        { user: User.createId("user1"), estimation: UserEstimation.estimated(cards[0]) },
        { user: User.createId("user2"), estimation: UserEstimation.estimated(cards[1]) },
        { user: User.createId("user3"), estimation: UserEstimation.giveUp() },
        { user: User.createId("user4"), estimation: UserEstimation.unselected() },
      ],
      theme: "",
    });

    await repository.save(round);

    // Act
    const ret = await repository.findFinishedRoundBy(round.id);

    // Assert
    expect(ret).toBeNull();
  });
  test("should return finished round if it is finished", async () => {
    // Arrange
    const repository = new RoundRepositoryImpl(database);
    let round = randomFinishedRound({ theme: "theme" });

    await repository.save(round);

    // Act
    const ret = await repository.findFinishedRoundBy(round.id);

    // Assert
    expect(ret).toEqual(round);
  });
});

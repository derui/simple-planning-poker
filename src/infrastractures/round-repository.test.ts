import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import * as R from "@/domains/round";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import * as UserHand from "@/domains/user-hand";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { RoundRepositoryImpl } from "./round-repository";
import { parseDateTime } from "@/domains/type";

let database: any;
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-project-1234",
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

test("should be able to save and find a round", async () => {
  // Arrange
  const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
  const round = R.roundOf({
    id: R.createId(),
    count: 1,
    selectableCards: cards,
    hands: [
      { user: User.createId("user1"), hand: UserHand.handed(cards[0]) },
      { user: User.createId("user2"), hand: UserHand.handed(cards[1]) },
      { user: User.createId("user3"), hand: UserHand.giveUp() },
      { user: User.createId("user4"), hand: UserHand.unselected() },
    ],
  });

  const repository = new RoundRepositoryImpl(database);

  // Act
  await repository.save(round);
  const instance = (await repository.findBy(round.id)) as R.Round;

  // Assert
  expect(instance?.id).toEqual(round.id);
  expect(instance?.count).toEqual(round.count);
  expect(instance?.hands).toEqual(
    Object.fromEntries([
      [User.createId("user1"), UserHand.handed(cards[0])],
      [User.createId("user2"), UserHand.handed(cards[1])],
      [User.createId("user3"), UserHand.giveUp()],
      [User.createId("user4"), UserHand.unselected()],
    ])
  );
  expect(instance?.selectableCards).toEqual(round.selectableCards);
});

test("should be able to save and find a finished round", async () => {
  // Arrange
  const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
  const round = R.roundOf({
    id: R.createId(),
    count: 1,
    selectableCards: cards,
    hands: [
      { user: User.createId("user1"), hand: UserHand.handed(cards[0]) },
      { user: User.createId("user2"), hand: UserHand.handed(cards[1]) },
      { user: User.createId("user3"), hand: UserHand.giveUp() },
      { user: User.createId("user4"), hand: UserHand.unselected() },
    ],
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
  expect(instance?.count).toEqual(round.count);
  expect(instance?.hands).toEqual(
    Object.fromEntries([
      [User.createId("user1"), UserHand.handed(cards[0])],
      [User.createId("user2"), UserHand.handed(cards[1])],
      [User.createId("user3"), UserHand.giveUp()],
      [User.createId("user4"), UserHand.unselected()],
    ])
  );
  expect(instance?.finishedAt).toBe("2023-02-25T00:01:01.000Z");
});

test("should not be able find a game if it did not save before", async () => {
  // Arrange
  const repository = new RoundRepositoryImpl(database);

  // Act
  const instance = await repository.findBy(R.createId());

  // Assert
  expect(instance).toBeNull();
});

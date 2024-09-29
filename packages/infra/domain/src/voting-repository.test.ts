import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { v4 } from "uuid";
import { VotingRepositoryImpl } from "./voting-repository.js";
import { Voting, ApplicablePoints, StoryPoint, User, UserEstimation, Estimations } from "@spp/shared-domain";
import { Database } from "firebase/database";
import { enableMapSet } from "immer";

enableMapSet();

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

test("should be able to save and find a voting", async () => {
  // Arrange
  const points = ApplicablePoints.create([1, 2].map(StoryPoint.create));
  const voting = Voting.votingOf({
    id: Voting.createId(),
    points,
    estimations: Estimations.from({
      [User.createId("user1")]: UserEstimation.submittedOf(points[0]),
      [User.createId("user2")]: UserEstimation.submittedOf(points[1]),
      [User.createId("user3")]: UserEstimation.giveUpOf(),
      [User.createId("user4")]: UserEstimation.unsubmitOf(),
    }),
  });

  const repository = new VotingRepositoryImpl(database);

  // Act
  await repository.save(voting);
  const instance = await repository.findBy(voting.id);

  // Assert
  expect(instance?.id).toEqual(voting.id);
  expect(Array.from(instance?.estimations.userEstimations.entries() ?? [])).toEqual(
    expect.arrayContaining([
      [User.createId("user1"), UserEstimation.submittedOf(points[0])],
      [User.createId("user2"), UserEstimation.submittedOf(points[1])],
      [User.createId("user3"), UserEstimation.giveUpOf()],
      [User.createId("user4"), UserEstimation.unsubmitOf()],
    ])
  );
  expect(instance?.points).toEqual(voting.points);
  expect(instance?.theme).toBeUndefined();
});

test("should be able to save and find a finished voting", async () => {
  // Arrange
  const points = ApplicablePoints.create([1, 2].map(StoryPoint.create));
  const voting = Voting.votingOf({
    id: Voting.createId(),
    points,
    estimations: Estimations.from({
      [User.createId("user1")]: UserEstimation.submittedOf(points[0]),
      [User.createId("user2")]: UserEstimation.submittedOf(points[1]),
      [User.createId("user3")]: UserEstimation.giveUpOf(),
      [User.createId("user4")]: UserEstimation.unsubmitOf(),
    }),
  });
  const [finished] = Voting.reveal(voting);

  const repository = new VotingRepositoryImpl(database);

  // Act
  await repository.save(voting);
  await repository.save(finished);
  const instance = await repository.findBy(voting.id);

  // Assert
  expect(instance?.status).toBe(Voting.VotingStatus.Revealed);
  expect(instance?.id).toEqual(voting.id);
  expect(instance?.estimations.userEstimations).toEqual(
    new Map([
      [User.createId("user1"), UserEstimation.submittedOf(points[0])],
      [User.createId("user2"), UserEstimation.submittedOf(points[1])],
      [User.createId("user3"), UserEstimation.giveUpOf()],
      [User.createId("user4"), UserEstimation.unsubmitOf()],
    ])
  );
  expect(instance?.theme).toBeUndefined();
});

test("empty theme as undefined", async () => {
  // Arrange
  const points = ApplicablePoints.create([1, 2].map(StoryPoint.create));
  const voting = Voting.votingOf({
    id: Voting.createId(),
    points,
    estimations: Estimations.from({
      [User.createId("user1")]: UserEstimation.submittedOf(points[0]),
      [User.createId("user2")]: UserEstimation.submittedOf(points[1]),
      [User.createId("user3")]: UserEstimation.giveUpOf(),
      [User.createId("user4")]: UserEstimation.unsubmitOf(),
    }),
    theme: "",
  });

  const repository = new VotingRepositoryImpl(database);

  // Act
  await repository.save(voting);
  const instance = await repository.findBy(voting.id);

  // Assert
  expect(instance?.id).toEqual(voting.id);
  expect(instance?.estimations?.userEstimations).toEqual(
    new Map([
      [User.createId("user1"), UserEstimation.submittedOf(points[0])],
      [User.createId("user2"), UserEstimation.submittedOf(points[1])],
      [User.createId("user3"), UserEstimation.giveUpOf()],
      [User.createId("user4"), UserEstimation.unsubmitOf()],
    ])
  );
  expect(instance?.theme).toBeUndefined();
});

test("should not be able find a game if it did not save before", async () => {
  // Arrange
  const repository = new VotingRepositoryImpl(database);

  // Act
  const instance = await repository.findBy(Voting.createId());

  // Assert
  expect(instance).toBeUndefined();
});

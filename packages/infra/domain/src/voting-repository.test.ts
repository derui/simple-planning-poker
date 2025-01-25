import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import {
  ApplicablePoints,
  Estimations,
  StoryPoint,
  User,
  UserEstimation,
  Voter,
  VoterType,
  Voting,
} from "@spp/shared-domain";
import { Database } from "firebase/database";
import { enableMapSet } from "immer";
import { v4 } from "uuid";
import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { setDatabase } from "./database.js";
import { VotingRepository } from "./voting-repository.js";

enableMapSet();

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
  const database = testEnv.authenticatedContext("alice").database() as unknown as Database;
  setDatabase(database);
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
    voters: [
      Voter.createVoter({ user: User.createId("user1"), type: VoterType.Normal }),
      Voter.createVoter({ user: User.createId("user2"), type: VoterType.Normal }),
      Voter.createVoter({ user: User.createId("user3"), type: VoterType.Normal }),
      Voter.createVoter({ user: User.createId("user4"), type: VoterType.Normal }),
    ],
  });

  // Act
  await VotingRepository.save({ voting });
  const instance = await VotingRepository.findBy({ id: voting.id });

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
  expect(instance?.participatedVoters).toEqual([
    Voter.createVoter({ user: User.createId("user1"), type: VoterType.Normal }),
    Voter.createVoter({ user: User.createId("user2"), type: VoterType.Normal }),
    Voter.createVoter({ user: User.createId("user3"), type: VoterType.Normal }),
    Voter.createVoter({ user: User.createId("user4"), type: VoterType.Normal }),
  ]);
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
    theme: "sample",
    voters: [
      Voter.createVoter({ user: User.createId("user1"), type: VoterType.Normal }),
      Voter.createVoter({ user: User.createId("user2"), type: VoterType.Normal }),
      Voter.createVoter({ user: User.createId("user3"), type: VoterType.Normal }),
      Voter.createVoter({ user: User.createId("user4"), type: VoterType.Inspector }),
    ],
  });
  const [finished] = Voting.reveal(voting);

  // Act
  await VotingRepository.save({ voting });
  await VotingRepository.save({ voting: finished });
  const instance = await VotingRepository.findBy({ id: voting.id });

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
  expect(instance?.theme).toBe("sample");
  expect(instance?.participatedVoters).toEqual([
    Voter.createVoter({ user: User.createId("user1"), type: VoterType.Normal }),
    Voter.createVoter({ user: User.createId("user2"), type: VoterType.Normal }),
    Voter.createVoter({ user: User.createId("user3"), type: VoterType.Normal }),
    Voter.createVoter({ user: User.createId("user4"), type: VoterType.Inspector }),
  ]);
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
    voters: [
      Voter.createVoter({ user: User.createId("user1"), type: VoterType.Normal }),
      Voter.createVoter({ user: User.createId("user2"), type: VoterType.Normal }),
      Voter.createVoter({ user: User.createId("user3"), type: VoterType.Normal }),
      Voter.createVoter({ user: User.createId("user4"), type: VoterType.Inspector }),
    ],
  });

  // Act
  await VotingRepository.save({ voting });
  const instance = await VotingRepository.findBy({ id: voting.id });

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

  // Act
  const instance = await VotingRepository.findBy({ id: Voting.createId() });

  // Assert
  expect(instance).toBeUndefined();
});

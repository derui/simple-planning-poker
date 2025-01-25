import { enableMapSet } from "immer";
import { describe, expect, test } from "vitest";
import * as ApplicablePoints from "./applicable-points.js";
import * as Estimations from "./estimations.js";
import { DOMAIN_EVENTS } from "./event.js";
import { Voter } from "./index.js";
import * as StoryPoint from "./story-point.js";
import * as UserEstimation from "./user-estimation.js";
import * as User from "./user.js";
import * as VoterType from "./voter-type.js";
import { changeVoterType } from "./voter.js";
import {
  canReveal,
  changeTheme,
  createId,
  isVoterChanged,
  isVoterJoined,
  joinUser,
  reveal,
  revealedOf,
  T,
  takePlayerEstimation,
  updateVoter,
  votingOf,
  VotingStatus,
} from "./voting.js";

enableMapSet();

const points = ApplicablePoints.create([StoryPoint.create(2), StoryPoint.create(3)]);
const estimations = Estimations.empty();

test("get voting", () => {
  const ret = votingOf({
    id: createId("id"),
    points,
    estimations,
    voters: [Voter.createVoter({ user: User.createId() })],
  });

  expect(ret.status).toEqual(VotingStatus.Voting);
  expect(ret.id).toBe(createId("id"));
  expect(ret.points).toEqual(points);
  expect(ret.theme).toBeUndefined();
  expect(ret.participatedVoters).toHaveLength(1);
});

test("get revealed voting", () => {
  const ret = revealedOf({
    id: createId("id"),
    points,
    estimations,
    voters: [Voter.createVoter({ user: User.createId() })],
  });

  expect(ret.points).toEqual(points);
  expect(ret.id).toBe(createId("id"));
  expect(ret.theme).toBeUndefined();
  expect(ret.status).toEqual(VotingStatus.Revealed);
});

test("voting can accept user estimation", () => {
  const voting = votingOf({
    id: createId("id"),
    points: points,
    estimations,
    voters: [Voter.createVoter({ user: User.createId("1") })],
  });
  const changed = takePlayerEstimation(voting, User.createId("1"), UserEstimation.submittedOf(points[0]));

  expect(voting).not.toBe(changed);
  expect(voting.id).toBe(changed.id);
  expect(voting.points).toBe(changed.points);
  expect(changed.estimations).toEqual(
    Estimations.update(voting.estimations, User.createId("1"), UserEstimation.submittedOf(points[0]))
  );
});

test("update estimation if user already take their estimation before", () => {
  const voting = votingOf({
    id: createId("id"),
    points,
    estimations,
    voters: [Voter.createVoter({ user: User.createId("1") })],
  });
  let changed = takePlayerEstimation(voting, User.createId("1"), UserEstimation.submittedOf(points[0]));
  changed = takePlayerEstimation(changed, User.createId("1"), UserEstimation.submittedOf(points[1]));

  expect(changed.estimations).toEqual(
    Estimations.update(voting.estimations, User.createId("1"), UserEstimation.submittedOf(points[1]))
  );
});

test("throw error when a card user took is not contained applicable points", () => {
  const voting = votingOf({
    id: createId("id"),
    points: points,
    estimations,
    voters: [Voter.createVoter({ user: User.createId("1") })],
  });

  expect(() => {
    takePlayerEstimation(voting, User.createId("1"), UserEstimation.submittedOf(StoryPoint.create(5)));
  }).toThrowError();
});

test("voting can accept user giveup", () => {
  let voting: T = votingOf({
    id: createId("id"),
    points: points,
    estimations,
    voters: [Voter.createVoter({ user: User.createId("1") })],
  });
  voting = takePlayerEstimation(voting, User.createId("1"), UserEstimation.giveUpOf());

  expect(voting.estimations.userEstimations.get(User.createId("1"))).toEqual(UserEstimation.giveUpOf());
});

test("voting can not accept selection user who does not join", () => {
  const voting: T = votingOf({
    id: createId("id"),
    points: points,
    estimations,
    voters: [Voter.createVoter({ user: User.createId("1") })],
  });

  expect(() => takePlayerEstimation(voting, User.createId("2"), UserEstimation.giveUpOf())).toThrow(
    /Can not accept not participated/
  );
});

describe("reveal", () => {
  test("reveal voting", () => {
    let voting = votingOf({
      id: createId("id"),
      points: points,
      estimations,
      voters: [Voter.createVoter({ user: User.createId("1") })],
    });
    voting = takePlayerEstimation(voting, User.createId("1"), UserEstimation.submittedOf(points[0]));

    const [revealed, event] = reveal(voting);

    expect(canReveal(voting)).toBe(true);
    expect(canReveal(revealed)).toBe(false);
    expect(revealed.id).toBe(voting.id);
    expect(revealed.estimations).toEqual(voting.estimations);
    expect(event).toEqual({
      kind: DOMAIN_EVENTS.VotingRevealed,
      votingId: revealed.id,
    });
  });

  test("can not finish voting that has no estimation", () => {
    const voting = votingOf({
      id: createId("id"),
      points: points,
      estimations,
      voters: [Voter.createVoter({ user: User.createId() })],
    });

    expect(canReveal(voting)).toBe(false);
    expect(() => reveal(voting)).toThrowError();
  });
});

describe("theme", () => {
  test("should be able to change theme for voting", () => {
    const voting = votingOf({
      id: createId("id"),
      points: points,
      estimations,
      voters: [Voter.createVoter({ user: User.createId() })],
    });

    const newVoting = changeTheme(voting, "new theme");

    expect(voting.theme).toBeUndefined();
    expect(newVoting.theme).toBe("new theme");
  });

  test("can change theme of finished voting", () => {
    const voting = revealedOf({
      id: createId("id"),
      points: points,
      estimations,
      theme: "finished",
      voters: [Voter.createVoter({ user: User.createId() })],
    });

    const changed = changeTheme(voting, "changed");

    expect(changed).not.toBe(voting);
    expect(changed.theme).toBe("changed");
  });

  test("set undefined when given data is empty string", () => {
    const voting = votingOf({
      id: createId("id"),
      points: points,
      estimations,
      theme: "theme",
      voters: [Voter.createVoter({ user: User.createId() })],
    });

    const changed = changeTheme(voting, "");

    expect(changed.theme).toBeUndefined();
  });
});

describe("join user", () => {
  test("join user if user have not join yet", () => {
    const voting = votingOf({
      id: createId("id"),
      points: points,
      estimations,
      voters: [Voter.createVoter({ user: User.createId() })],
    });

    const [newVoting] = joinUser(voting, User.createId("3"));

    expect(newVoting.participatedVoters.map((v) => v.user)).toEqual(expect.arrayContaining([User.createId("3")]));
  });

  test("get event when user joined", () => {
    const voting = votingOf({
      id: createId("id"),
      points: points,
      estimations,
      voters: [Voter.createVoter({ user: User.createId() })],
    });

    const [, e] = joinUser(voting, User.createId("3"));

    if (isVoterJoined(e!)) {
      expect(e.userId).toEqual(User.createId("3"));
      expect(e.votingId).toEqual(voting.id);
    } else {
      expect.fail("should be valid event");
    }
  });

  test("can not get event if user is already joined", () => {
    const voting = votingOf({
      id: createId("id"),
      points: points,
      estimations,
      voters: [Voter.createVoter({ user: User.createId() }), Voter.createVoter({ user: User.createId("foo") })],
    });

    const [, e] = joinUser(voting, User.createId("foo"));

    expect(e).toBeUndefined();
  });
});

describe("change voter", () => {
  test("change voter ", () => {
    const voter = Voter.createVoter({ user: User.createId("1") });
    const voting = votingOf({
      id: createId("id"),
      points: points,
      estimations,
      voters: [Voter.createVoter({ user: User.createId() }), voter],
    });

    const [newVoting] = updateVoter(voting, changeVoterType(voter, VoterType.Inspector));

    expect(newVoting.participatedVoters.find((v) => v.user == voter.user)).toEqual(
      Voter.createVoter({ user: voter.user, type: VoterType.Inspector })
    );
  });

  test("get event when voter updated", () => {
    const voter = Voter.createVoter({ user: User.createId() });
    const voting = votingOf({
      id: createId("id"),
      points: points,
      estimations,
      voters: [Voter.createVoter({ user: User.createId() }), voter],
    });

    const [, e] = updateVoter(voting, voter);

    if (isVoterChanged(e)) {
      expect(e.userId).toEqual(voter.user);
      expect(e.votingId).toEqual(voting.id);
      expect(e.voterType).toEqual(VoterType.Normal);
    } else {
      expect.fail("should be valid event");
    }
  });

  test("throw error if the voter is not joined", () => {
    const voting = votingOf({
      id: createId("id"),
      points: points,
      estimations,
      voters: [Voter.createVoter({ user: User.createId() })],
    });

    expect(() => updateVoter(voting, Voter.createVoter({ user: User.createId("foo") }))).toThrowError(/update voter/);
  });
});

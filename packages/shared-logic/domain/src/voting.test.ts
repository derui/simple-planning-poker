import { expect, test, describe } from "vitest";
import {
  votingOf,
  createId,
  revealedOf,
  takePlayerEstimation,
  reveal,
  canReveal,
  T,
  changeTheme,
  VotingStatus,
} from "./voting.js";
import * as ApplicablePoints from "./applicable-points.js";
import * as StoryPoint from "./story-point.js";
import * as User from "./user.js";
import * as Estimations from "./estimations.js";
import * as UserEstimation from "./user-estimation.js";
import { DOMAIN_EVENTS } from "./event.js";
import { enableMapSet } from "immer";

enableMapSet();

const points = ApplicablePoints.create([StoryPoint.create(2), StoryPoint.create(3)]);
const estimations = Estimations.create([User.createId("1")]);

test("get round", () => {
  const ret = votingOf({
    id: createId("id"),
    points,
    estimations,
  });

  expect(ret.status).toEqual(VotingStatus.Voting);
  expect(ret.id).toBe(createId("id"));
  expect(ret.points).toEqual(points);
  expect(ret.theme).toBeNull();
});

test("get revealed voting", () => {
  const ret = revealedOf({
    id: createId("id"),
    points,
    estimations,
  });

  expect(ret.points).toEqual(points);
  expect(ret.id).toBe(createId("id"));
  expect(ret.theme).toBeNull();
  expect(ret.status).toEqual(VotingStatus.Revealed);
});

test("voting can accept user estimation", () => {
  const voting = votingOf({ id: createId("id"), points: points, estimations });
  const changed = takePlayerEstimation(voting, User.createId("1"), UserEstimation.submittedOf(points[0]));

  expect(voting).not.toBe(changed);
  expect(voting.id).toBe(changed.id);
  expect(voting.points).toBe(changed.points);
  expect(changed.estimations).toEqual(
    Estimations.update(voting.estimations, User.createId("1"), UserEstimation.submittedOf(points[0]))
  );
});

test("update estimation if user already take their estimation before", () => {
  const voting = votingOf({ id: createId("id"), points, estimations });
  let changed = takePlayerEstimation(voting, User.createId("1"), UserEstimation.submittedOf(points[0]));
  changed = takePlayerEstimation(changed, User.createId("1"), UserEstimation.submittedOf(points[1]));

  expect(changed.estimations).toEqual(
    Estimations.update(voting.estimations, User.createId("1"), UserEstimation.submittedOf(points[1]))
  );
});

test("throw error when a card user took is not contained applicable points", () => {
  const voting = votingOf({ id: createId("id"), points: points, estimations });

  expect(() => {
    takePlayerEstimation(voting, User.createId("1"), UserEstimation.submittedOf(StoryPoint.create(5)));
  }).toThrowError();
});

test("voting can accept user giveup", () => {
  let voting: T = votingOf({
    id: createId("id"),
    points: points,
    estimations,
  });
  voting = takePlayerEstimation(voting, User.createId("1"), UserEstimation.giveUpOf());

  expect(voting.estimations.userEstimations.get(User.createId("1"))).toEqual(UserEstimation.giveUpOf());
});

describe("reveal", () => {
  test("reveal voting", () => {
    let voting = votingOf({
      id: createId("id"),
      points: points,
      estimations,
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
    const voting = votingOf({ id: createId("id"), points: points, estimations });

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
    });

    const newVoting = changeTheme(voting, "new theme");

    expect(voting.theme).toBeNull();
    expect(newVoting.theme).toBe("new theme");
  });

  test("can change theme of finished voting", () => {
    const voting = revealedOf({
      id: createId("id"),
      points: points,
      estimations,
      theme: "finished",
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
    });

    const changed = changeTheme(voting, "");

    expect(changed.theme).toBeNull();
  });
});

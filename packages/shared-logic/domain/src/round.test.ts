import { expect, test, describe } from "vitest";
import {
  roundOf,
  createId,
  finishedRoundOf,
  takePlayerEstimation,
  showDown,
  calculateAverage,
  isRound,
  isFinishedRound,
  canShowDown,
  T,
  changeTheme,
} from "./round.js";
import * as ApplicablePoints from "./applicable-points.js";
import * as StoryPoint from "./story-point.js";
import * as User from "./user.js";
import * as UserEstimation from "./user-estimation.js";
import { DOMAIN_EVENTS } from "./event.js";
import { dateTimeToString as formatToDateTime } from "./type.js";

const points = ApplicablePoints.create([StoryPoint.create(2), StoryPoint.create(3)]);

test("get round", () => {
  const ret = roundOf({
    id: createId("id"),
    points: points,
  });

  expect(ret.estimations).toEqual({});
  expect(ret.id).toBe(createId("id"));
  expect(ret.points).toEqual(points);
});

test("get finished round", () => {
  const now = formatToDateTime(new Date());
  const ret = finishedRoundOf({
    id: createId("id"),
    points: points,
    finishedAt: now,
    estimations: [],
  });

  expect(ret.estimations).toEqual({});
  expect(ret.finishedAt).toBe(now);
  expect(ret.points).toEqual(points);
  expect(ret.id).toBe(createId("id"));
});

test("round can accept user estimation", () => {
  const round = roundOf({ id: createId("id"), points: points });
  const changed = takePlayerEstimation(round, User.createId("id"), UserEstimation.submittedOf(points[0]));

  expect(round).not.toBe(changed);
  expect(round.id).toBe(changed.id);
  expect(round.points).toBe(changed.points);
  expect(changed.estimations).toEqual(
    Object.fromEntries([[User.createId("id"), UserEstimation.submittedOf(points[0])]])
  );
});

test("update estimation if user already take their estimation before", () => {
  const round = roundOf({ id: createId("id"), points: points });
  let changed = takePlayerEstimation(round, User.createId("id"), UserEstimation.submittedOf(points[0]));
  changed = takePlayerEstimation(changed, User.createId("id"), UserEstimation.submittedOf(points[1]));

  expect(changed.estimations).toEqual(
    Object.fromEntries([[User.createId("id"), UserEstimation.submittedOf(points[1])]])
  );
});

test("throw error when a card user took is not contained applicable points", () => {
  const round = roundOf({ id: createId("id"), points: points });

  expect(() => {
    takePlayerEstimation(round, User.createId("id"), UserEstimation.submittedOf(StoryPoint.create(5)));
  }).toThrowError();
});

test("round can accept user giveup", () => {
  let round: T = roundOf({
    id: createId("id"),
    points: points,
    estimations: [{ user: User.createId("id"), estimation: UserEstimation.submittedOf(points[0]) }],
  });
  round = takePlayerEstimation(round, User.createId("id2"), UserEstimation.giveUpOf());

  expect(round.estimations).toEqual(
    Object.fromEntries([
      [User.createId("id"), UserEstimation.submittedOf(points[0])],
      [User.createId("id2"), UserEstimation.giveUpOf()],
    ])
  );
});

test("give upped user can take other estimation", () => {
  let round: T = roundOf({
    id: createId("id"),
    points: points,
    estimations: [{ user: User.createId("id"), estimation: UserEstimation.giveUpOf() }],
  });
  round = takePlayerEstimation(round, User.createId("id"), UserEstimation.submittedOf(points[0]));

  expect(round.estimations).toEqual(Object.fromEntries([[User.createId("id"), UserEstimation.submittedOf(points[0])]]));
});

describe("show down", () => {
  test("finish round", () => {
    const round = roundOf({
      id: createId("id"),
      points: points,
      estimations: [{ user: User.createId("id"), estimation: UserEstimation.submittedOf(points[0]) }],
    });

    const now = new Date();
    const [finished, event] = showDown(round, now);

    expect(canShowDown(round)).toBe(true);
    expect(canShowDown(finished)).toBe(false);
    expect(finished.id).toBe(round.id);
    expect(finished.estimations).toEqual(round.estimations);
    expect(finished.estimations).not.toBe(round.estimations);
    expect(finished.finishedAt).toBe(formatToDateTime(now));
    expect(event).toEqual({
      kind: DOMAIN_EVENTS.RoundFinished,
      roundId: finished.id,
    });
  });

  test("can not finish round that has no estimation", () => {
    const round = roundOf({ id: createId("id"), points: points, estimations: [] });

    expect(canShowDown(round)).toBe(false);
    expect(() => showDown(round, new Date())).toThrowError();
  });
});

describe("calculate average", () => {
  test("calculate single average", () => {
    const round = roundOf({
      id: createId("id"),
      points: points,
      estimations: [{ user: User.createId("id"), estimation: UserEstimation.submittedOf(points[0]) }],
    });

    const [finished] = showDown(round, new Date());

    const average = calculateAverage(finished);

    expect(average).toBe(2);
  });

  test("should be zero all player gave up or unselected", () => {
    const round = roundOf({
      id: createId("id"),
      points: points,
      estimations: [
        { user: User.createId("id1"), estimation: UserEstimation.giveUpOf() },
        { user: User.createId("id2"), estimation: UserEstimation.unsubmitOf() },
        { user: User.createId("id3"), estimation: UserEstimation.giveUpOf() },
      ],
    });

    const [finished] = showDown(round, new Date());

    const average = calculateAverage(finished);

    expect(average).toBe(0);
  });

  test("calculate average of user estimation", () => {
    const round = roundOf({
      id: createId("id"),
      points: points,
      estimations: [
        { user: User.createId("id1"), estimation: UserEstimation.submittedOf(points[0]) },
        { user: User.createId("id2"), estimation: UserEstimation.submittedOf(points[1]) },
        { user: User.createId("id3"), estimation: UserEstimation.submittedOf(points[0]) },
      ],
    });

    const [finished] = showDown(round, new Date());

    const average = calculateAverage(finished);

    expect(average).toEqual(2.34);
  });
});

describe("guards", () => {
  test("should be able to guard round", () => {
    const round = roundOf({
      id: createId("id"),
      points: points,
      estimations: [{ user: User.createId("id"), estimation: UserEstimation.unsubmitOf() }],
    });

    const [finished] = showDown(round, new Date());

    expect(isRound(round)).toBe(true);
    expect(isRound(finished)).toBe(false);
  });

  test("should be able to guard finished round", () => {
    const round = roundOf({
      id: createId("id"),
      points: points,
      estimations: [{ user: User.createId("id"), estimation: UserEstimation.unsubmitOf() }],
    });

    const [finished] = showDown(round, new Date());

    expect(isFinishedRound(round)).toBe(false);
    expect(isFinishedRound(finished)).toBe(true);
  });
});

describe("theme", () => {
  test("should be able to change theme for round", () => {
    const round = roundOf({
      id: createId("id"),
      points: points,
      estimations: [{ user: User.createId("id"), estimation: UserEstimation.unsubmitOf() }],
    });

    const newRound = changeTheme(round, "new theme");

    expect(round.theme).toBeNull();
    expect(isRound(newRound)).toBe(true);
    expect(newRound.theme).toBe("new theme");
  });

  test("can not change theme of finished round", () => {
    const round = finishedRoundOf({
      id: createId("id"),
      points: points,
      estimations: [{ user: User.createId("id"), estimation: UserEstimation.unsubmitOf() }],
      finishedAt: new Date().toISOString(),
      theme: "finished",
    });

    const changed = changeTheme(round, "changed");

    expect(changed).toBe(round);
    expect(changed.theme).toBe("finished");
  });

  test("set undefined when given data is empty string", () => {
    const round = roundOf({
      id: createId("id"),
      points: points,
      estimations: [{ user: User.createId("id"), estimation: UserEstimation.unsubmitOf() }],
      theme: "theme",
    });

    const changed = changeTheme(round, "");

    expect(changed.theme).toBeNull();
  });
});

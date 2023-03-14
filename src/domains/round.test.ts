import { expect, test, describe } from "vitest";
import {
  roundOf,
  createId,
  finishedRoundOf,
  takePlayerCard,
  acceptPlayerToGiveUp,
  showDown,
  calculateAverage,
  isRound,
  isFinishedRound,
  canShowDown,
  joinPlayer,
} from "./round";
import * as SelectableCards from "./selectable-cards";
import * as StoryPoint from "./story-point";
import * as User from "./user";
import * as UserHand from "./user-hand";
import * as Card from "./card";
import { DOMAIN_EVENTS } from "./event";
import { dateTimeToString as formatToDateTime } from "./type";
import { UserMode } from "./game-player";

const cards = SelectableCards.create([StoryPoint.create(2), StoryPoint.create(3)]);

test("get round", () => {
  const ret = roundOf({
    id: createId("id"),
    count: 1,
    cards: cards,
    joinedPlayers: [{ user: User.createId("id"), mode: UserMode.normal }],
  });

  expect(ret.hands).toEqual({});
  expect(ret.id).toBe(createId("id"));
  expect(ret.count).toBe(1);
  expect(ret.cards).toEqual(cards);
  expect(ret.joinedPlayers).toEqual([{ user: User.createId("id"), mode: UserMode.normal }]);
});

test("get finished round", () => {
  const now = formatToDateTime(new Date());
  const ret = finishedRoundOf({ id: createId("id"), count: 1, cards, finishedAt: now, hands: [] });

  expect(ret.hands).toEqual({});
  expect(ret.finishedAt).toBe(now);
  expect(ret.cards).toEqual(cards);
  expect(ret.id).toBe(createId("id"));
});

test("round can accept user hand", () => {
  const round = roundOf({ id: createId("id"), count: 1, cards: cards });
  const changed = takePlayerCard(round, User.createId("id"), cards[0]);

  expect(round).not.toBe(changed);
  expect(round.id).toBe(changed.id);
  expect(round.cards).toBe(changed.cards);
  expect(changed.hands).toEqual(Object.fromEntries([[User.createId("id"), UserHand.handed(cards[0])]]));
});

test("update hand if user already take their hand before", () => {
  const round = roundOf({ id: createId("id"), count: 1, cards: cards });
  let changed = takePlayerCard(round, User.createId("id"), cards[0]);
  changed = takePlayerCard(changed, User.createId("id"), cards[1]);

  expect(changed.hands).toEqual(Object.fromEntries([[User.createId("id"), UserHand.handed(cards[1])]]));
});

test("throw error when a card user took is not contained selectable cards", () => {
  const round = roundOf({ id: createId("id"), count: 1, cards: cards });

  expect(() => {
    takePlayerCard(round, User.createId("id"), Card.create(StoryPoint.create(5)));
  }).toThrowError();
});

test("round can accept user giveup", () => {
  let round = roundOf({
    id: createId("id"),
    count: 1,
    cards: cards,
    hands: [{ user: User.createId("id"), hand: UserHand.handed(cards[0]) }],
  });
  round = acceptPlayerToGiveUp(round, User.createId("id2"));

  expect(round.hands).toEqual(
    Object.fromEntries([
      [User.createId("id"), UserHand.handed(cards[0])],
      [User.createId("id2"), UserHand.giveUp()],
    ])
  );
});

test("give upped user can take other hand", () => {
  let round = roundOf({
    id: createId("id"),
    count: 1,
    cards: cards,
    hands: [{ user: User.createId("id"), hand: UserHand.giveUp() }],
  });
  round = takePlayerCard(round, User.createId("id"), cards[0]);

  expect(round.hands).toEqual(Object.fromEntries([[User.createId("id"), UserHand.handed(cards[0])]]));
});

describe("show down", () => {
  test("finish round", () => {
    const round = roundOf({
      id: createId("id"),
      count: 1,
      cards: cards,
      hands: [{ user: User.createId("id"), hand: UserHand.handed(cards[0]) }],
    });

    const now = new Date();
    const [finished, event] = showDown(round, now);

    expect(canShowDown(round)).toBe(true);
    expect(canShowDown(finished)).toBe(false);
    expect(finished.id).toBe(round.id);
    expect(finished.hands).toEqual(round.hands);
    expect(finished.hands).not.toBe(round.hands);
    expect(finished.count).toBe(round.count);
    expect(finished.finishedAt).toBe(formatToDateTime(now));
    expect(event).toEqual({
      kind: DOMAIN_EVENTS.RoundFinished,
      roundId: finished.id,
    });
  });

  test("can not finish round that has no hand", () => {
    const round = roundOf({ id: createId("id"), count: 1, cards: cards, hands: [] });

    expect(canShowDown(round)).toBe(false);
    expect(() => showDown(round, new Date())).toThrowError();
  });
});

describe("calculate average", () => {
  test("calculate single average", () => {
    const round = roundOf({
      id: createId("id"),
      count: 1,
      cards: cards,
      hands: [{ user: User.createId("id"), hand: UserHand.handed(cards[0]) }],
    });

    const [finished] = showDown(round, new Date());

    const average = calculateAverage(finished);

    expect(average).toBe(2);
  });

  test("should be zero all player gave up or unselected", () => {
    const round = roundOf({
      id: createId("id"),
      cards: cards,
      count: 1,
      hands: [
        { user: User.createId("id1"), hand: UserHand.giveUp() },
        { user: User.createId("id2"), hand: UserHand.unselected() },
        { user: User.createId("id3"), hand: UserHand.giveUp() },
      ],
    });

    const [finished] = showDown(round, new Date());

    const average = calculateAverage(finished);

    expect(average).toBe(0);
  });

  test("calculate average of user hand", () => {
    const round = roundOf({
      id: createId("id"),
      count: 1,
      cards: cards,
      hands: [
        { user: User.createId("id1"), hand: UserHand.handed(cards[0]) },
        { user: User.createId("id2"), hand: UserHand.handed(cards[1]) },
        { user: User.createId("id3"), hand: UserHand.handed(cards[0]) },
      ],
    });

    const [finished] = showDown(round, new Date());

    const average = calculateAverage(finished);

    expect(average).toEqual((2 + 3 + 2) / 3);
  });
});

describe("guards", () => {
  test("should be able to guard round", () => {
    const round = roundOf({
      id: createId("id"),
      cards: cards,
      count: 1,
      hands: [{ user: User.createId("id"), hand: UserHand.unselected() }],
    });

    const [finished] = showDown(round, new Date());

    expect(isRound(round)).toBe(true);
    expect(isRound(finished)).toBe(false);
  });

  test("should be able to guard finished round", () => {
    const round = roundOf({
      id: createId("id"),
      cards: cards,
      count: 1,
      hands: [{ user: User.createId("id"), hand: UserHand.unselected() }],
    });

    const [finished] = showDown(round, new Date());

    expect(isFinishedRound(round)).toBe(false);
    expect(isFinishedRound(finished)).toBe(true);
  });
});

describe("join player", () => {
  test("can not join player into finished round", () => {
    const round = finishedRoundOf({
      id: createId("id"),
      cards: cards,
      count: 1,
      hands: [{ user: User.createId("id"), hand: UserHand.giveUp() }],
      finishedAt: "2022-01-01T00:01:02",
    });

    const ret = joinPlayer(round, User.createId("foo"));

    expect(ret).toBe(round);
  });

  test("join player into round", () => {
    const round = roundOf({
      id: createId("id"),
      cards: cards,
      count: 1,
      hands: [{ user: User.createId("id"), hand: UserHand.giveUp() }],
      joinedPlayers: [{ user: User.createId("id"), mode: UserMode.normal }],
    });

    const ret = joinPlayer(round, User.createId("foo"));

    expect(ret).not.toBe(round);
    expect(ret.joinedPlayers).toContainEqual({ user: User.createId("foo"), mode: UserMode.normal });
    expect(ret.joinedPlayers).toContainEqual({ user: User.createId("id"), mode: UserMode.normal });
  });
});

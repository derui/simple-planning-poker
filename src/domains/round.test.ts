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
import * as UserEstimation from "./user-estimation";
import * as Card from "./card";
import * as GamePlayer from "./game-player";
import { DOMAIN_EVENTS } from "./event";
import { dateTimeToString as formatToDateTime } from "./type";

const cards = SelectableCards.create([StoryPoint.create(2), StoryPoint.create(3)]);

test("get round", () => {
  const ret = roundOf({
    id: createId("id"),
    count: 1,
    cards: cards,
    joinedPlayers: [
      GamePlayer.create({
        type: GamePlayer.PlayerType.player,
        user: User.createId("id"),
        mode: GamePlayer.UserMode.normal,
      }),
    ],
  });

  expect(ret.hands).toEqual({});
  expect(ret.id).toBe(createId("id"));
  expect(ret.count).toBe(1);
  expect(ret.cards).toEqual(cards);
  expect(ret.joinedPlayers).toEqual([
    GamePlayer.create({
      type: GamePlayer.PlayerType.player,
      user: User.createId("id"),
      mode: GamePlayer.UserMode.normal,
    }),
  ]);
});

test("get finished round", () => {
  const now = formatToDateTime(new Date());
  const ret = finishedRoundOf({ id: createId("id"), count: 1, cards, finishedAt: now, hands: [], joinedPlayers: [] });

  expect(ret.hands).toEqual({});
  expect(ret.finishedAt).toBe(now);
  expect(ret.cards).toEqual(cards);
  expect(ret.id).toBe(createId("id"));
});

test("round can accept user hand", () => {
  const round = roundOf({ id: createId("id"), count: 1, cards: cards, joinedPlayers: [] });
  const changed = takePlayerCard(round, User.createId("id"), cards[0]);

  expect(round).not.toBe(changed);
  expect(round.id).toBe(changed.id);
  expect(round.cards).toBe(changed.cards);
  expect(changed.hands).toEqual(Object.fromEntries([[User.createId("id"), UserEstimation.estimated(cards[0])]]));
});

test("update hand if user already take their hand before", () => {
  const round = roundOf({ id: createId("id"), count: 1, cards: cards, joinedPlayers: [] });
  let changed = takePlayerCard(round, User.createId("id"), cards[0]);
  changed = takePlayerCard(changed, User.createId("id"), cards[1]);

  expect(changed.hands).toEqual(Object.fromEntries([[User.createId("id"), UserEstimation.estimated(cards[1])]]));
});

test("throw error when a card user took is not contained selectable cards", () => {
  const round = roundOf({ id: createId("id"), count: 1, cards: cards, joinedPlayers: [] });

  expect(() => {
    takePlayerCard(round, User.createId("id"), Card.create(StoryPoint.create(5)));
  }).toThrowError();
});

test("round can accept user giveup", () => {
  let round = roundOf({
    id: createId("id"),
    count: 1,
    cards: cards,
    hands: [{ user: User.createId("id"), hand: UserEstimation.estimated(cards[0]) }],
    joinedPlayers: [],
  });
  round = acceptPlayerToGiveUp(round, User.createId("id2"));

  expect(round.hands).toEqual(
    Object.fromEntries([
      [User.createId("id"), UserEstimation.estimated(cards[0])],
      [User.createId("id2"), UserEstimation.giveUp()],
    ])
  );
});

test("give upped user can take other hand", () => {
  let round = roundOf({
    id: createId("id"),
    count: 1,
    cards: cards,
    hands: [{ user: User.createId("id"), hand: UserEstimation.giveUp() }],
    joinedPlayers: [],
  });
  round = takePlayerCard(round, User.createId("id"), cards[0]);

  expect(round.hands).toEqual(Object.fromEntries([[User.createId("id"), UserEstimation.estimated(cards[0])]]));
});

describe("show down", () => {
  test("finish round", () => {
    const round = roundOf({
      id: createId("id"),
      count: 1,
      cards: cards,
      hands: [{ user: User.createId("id"), hand: UserEstimation.estimated(cards[0]) }],
      joinedPlayers: [],
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
    const round = roundOf({ id: createId("id"), count: 1, cards: cards, hands: [], joinedPlayers: [] });

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
      hands: [{ user: User.createId("id"), hand: UserEstimation.estimated(cards[0]) }],
      joinedPlayers: [],
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
        { user: User.createId("id1"), hand: UserEstimation.giveUp() },
        { user: User.createId("id2"), hand: UserEstimation.unselected() },
        { user: User.createId("id3"), hand: UserEstimation.giveUp() },
      ],
      joinedPlayers: [],
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
        { user: User.createId("id1"), hand: UserEstimation.estimated(cards[0]) },
        { user: User.createId("id2"), hand: UserEstimation.estimated(cards[1]) },
        { user: User.createId("id3"), hand: UserEstimation.estimated(cards[0]) },
      ],
      joinedPlayers: [],
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
      hands: [{ user: User.createId("id"), hand: UserEstimation.unselected() }],
      joinedPlayers: [],
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
      hands: [{ user: User.createId("id"), hand: UserEstimation.unselected() }],
      joinedPlayers: [],
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
      hands: [{ user: User.createId("id"), hand: UserEstimation.giveUp() }],
      finishedAt: "2022-01-01T00:01:02",
      joinedPlayers: [],
    });

    const ret = joinPlayer(round, User.createId("foo"));

    expect(ret).toBe(round);
  });

  test("join player into round", () => {
    const round = roundOf({
      id: createId("id"),
      cards: cards,
      count: 1,
      hands: [{ user: User.createId("id"), hand: UserEstimation.giveUp() }],
      joinedPlayers: [
        GamePlayer.create({
          type: GamePlayer.PlayerType.player,
          user: User.createId("id"),
          mode: GamePlayer.UserMode.normal,
        }),
      ],
    });

    const ret = joinPlayer(round, User.createId("foo"));

    expect(ret).not.toBe(round);
    expect(ret.joinedPlayers).toContainEqual({
      type: GamePlayer.PlayerType.player,
      user: User.createId("foo"),
      mode: GamePlayer.UserMode.normal,
    });
    expect(ret.joinedPlayers).toContainEqual({
      type: GamePlayer.PlayerType.player,
      user: User.createId("id"),
      mode: GamePlayer.UserMode.normal,
    });
  });
});

import { test, expect, describe } from "vitest";
import {
  acceptLeaveFrom,
  acceptPlayerHand,
  changeName,
  create,
  createId,
  declarePlayerTo,
  GameCreated,
  joinUser,
  makeInvitation,
  newRound,
  NewRoundStarted,
  showDown,
} from "./game";
import * as SelectableCards from "./selectable-cards";
import * as StoryPoint from "./story-point";
import * as User from "./user";
import * as Round from "./round";
import * as UserHand from "./user-hand";
import * as GamePlayer from "./game-player";
import * as Invitation from "./invitation";
import { DOMAIN_EVENTS } from "./event";
import { parseDateTime } from "./type";

const cards = SelectableCards.create([1, 2].map(StoryPoint.create));

test("get aggregate and event when game created ", () => {
  const [game, event] = create({
    id: createId("id"),
    name: "name",
    joinedPlayers: [],
    owner: User.createId("user"),
    finishedRounds: [],
    cards,
  });

  expect(game.id).toBe(createId("id"));
  expect(game.id).toBe((event as GameCreated).gameId);
  expect((event as GameCreated).createdBy).toBe(User.createId("user"));
  expect((event as GameCreated).name).toBe("name");
  expect(game.name).toBe("name");
  expect(game.joinedPlayers).toHaveLength(1);
  expect(game.joinedPlayers).toEqual([{ user: User.createId("user"), mode: GamePlayer.UserMode.normal }]);
  expect(game.owner).toEqual(User.createId("user"));
  expect(game.round.count).toBe(1);
  expect(game.round.hands).toHaveLength(0);
  expect(game.finishedRounds).toHaveLength(0);
});

test("newRound should throw error when round is not finished", () => {
  const [game] = create({
    id: createId("id"),
    name: "name",
    joinedPlayers: [],
    owner: User.createId("user"),
    finishedRounds: [],
    cards,
  });

  expect(() => {
    newRound(game);
  }).toThrowError(/is not finished yet/);
});

test("newRound should make new round", () => {
  const [finishedRound] = Round.showDown(
    Round.roundOf({
      id: Round.createId(),
      count: 2,
      selectableCards: cards,
      hands: [{ user: User.createId("user"), hand: UserHand.giveUp() }],
    }),
    new Date()
  );

  const [game] = create({
    id: createId("id"),
    name: "name",
    joinedPlayers: [],
    round: finishedRound,
    owner: User.createId("user"),
    finishedRounds: [],
    cards,
  });

  const [updated, event] = newRound(game);

  expect(updated.round.id).not.toBe(finishedRound.id);
  expect(updated.round.count).toBe(3);
  expect(updated.finishedRounds[0]).toBe(finishedRound.id);
  expect((event as NewRoundStarted).gameId).toBe(game.id);
  expect((event as NewRoundStarted).roundId).toBe(updated.round.id);
});

describe("game name", () => {
  const [game] = create({
    id: createId("id"),
    name: "name",
    joinedPlayers: [],
    owner: User.createId("user"),
    finishedRounds: [],
    cards,
  });

  test("can change name of game", () => {
    const changed = changeName(game, "changed name");

    expect(changed.name).toBe("changed name");
  });

  test("should throw errro if name is not valid", () => {
    expect(() => changeName(game, "")).toThrowError(/can not change name/);
    expect(() => changeName(game, "   \t ")).toThrowError(/can not change name/);
  });
});

describe("declare player mode to", () => {
  test("should be able to change player mode", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      joinedPlayers: [],
      owner: User.createId("user"),
      finishedRounds: [],
      cards,
    });

    const changed = declarePlayerTo(game, User.createId("user"), GamePlayer.UserMode.inspector);

    expect(changed.joinedPlayers[0]).toEqual({ user: User.createId("user"), mode: GamePlayer.UserMode.inspector });
  });

  test("should throw error if not joined user", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      joinedPlayers: [],
      owner: User.createId("user"),
      finishedRounds: [],
      cards,
    });

    expect(() => {
      declarePlayerTo(game, User.createId("not found"), GamePlayer.UserMode.inspector);
    }).toThrowError(/The user didn't join game/);
  });
});

describe("join user", () => {
  test("should be able to join user", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      joinedPlayers: [],
      owner: User.createId("user"),
      finishedRounds: [],
      cards,
    });

    const [changed, event] = joinUser(game, User.createId("new"), makeInvitation(game));

    expect(changed.joinedPlayers.find((v) => v.user === User.createId("new"))).toEqual({
      user: User.createId("new"),
      mode: GamePlayer.UserMode.normal,
    });
    expect(event).toEqual({
      kind: DOMAIN_EVENTS.UserJoined,
      gameId: game.id,
      userId: User.createId("new"),
    });
  });

  test("should throw error if invitation is invalid", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      joinedPlayers: [],
      owner: User.createId("user"),
      finishedRounds: [],
      cards,
    });

    expect(() => {
      joinUser(game, User.createId("new"), "invitation" as Invitation.T);
    }).toThrowError(/signature is invalid/);
  });

  test("should throw error if user is already joined", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      joinedPlayers: [{ user: User.createId("new"), mode: GamePlayer.UserMode.normal }],
      owner: User.createId("user"),
      finishedRounds: [],
      cards,
    });

    expect(() => {
      joinUser(game, User.createId("new"), makeInvitation(game));
    }).toThrowError(/already joined/);
  });
});

describe("leave", () => {
  test("should not do anything if user is not in game", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      joinedPlayers: [{ user: User.createId("new"), mode: GamePlayer.UserMode.normal }],
      owner: User.createId("user"),
      finishedRounds: [],
      cards,
    });

    const ret = acceptLeaveFrom(game, User.createId("not found"));

    expect(ret).toBe(game);
  });

  test("remove user that want to leave from game", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      joinedPlayers: [{ user: User.createId("new"), mode: GamePlayer.UserMode.normal }],
      owner: User.createId("user"),
      finishedRounds: [],
      cards,
    });

    const ret = acceptLeaveFrom(game, User.createId("new"));

    expect(ret).not.toBe(game);
    expect(ret.joinedPlayers).toHaveLength(1);
    expect(ret.joinedPlayers[0].user).toBe(User.createId("user"));
  });
});

describe("show down", () => {
  test("should be able to show down the round", () => {
    let [game] = create({
      id: createId("id"),
      name: "name",
      joinedPlayers: [{ user: User.createId("new"), mode: GamePlayer.UserMode.normal }],
      owner: User.createId("user"),
      finishedRounds: [],
      cards,
    });

    game = acceptPlayerHand(game, User.createId("user"), UserHand.giveUp());
    game = acceptPlayerHand(game, User.createId("new"), UserHand.handed(cards[0]));
    const ret = showDown(game, parseDateTime("2023-02-25T11:22:33Z"));

    expect(ret[0]).not.toBe(game);
    expect(Round.isFinishedRound(ret[0].round)).toBe(true);
    expect(ret[0].finishedRounds).toEqual([]);
    expect(ret[1].kind).toBe(DOMAIN_EVENTS.RoundFinished);
  });

  test("throw error if round already finished", () => {
    let [game] = create({
      id: createId("id"),
      name: "name",
      joinedPlayers: [{ user: User.createId("new"), mode: GamePlayer.UserMode.normal }],
      owner: User.createId("user"),
      finishedRounds: [],
      cards,
    });

    game = acceptPlayerHand(game, User.createId("user"), UserHand.giveUp());
    game = acceptPlayerHand(game, User.createId("new"), UserHand.handed(cards[0]));
    const [finished] = showDown(game, parseDateTime("2023-02-25T11:22:33Z"));

    expect(() => {
      showDown(finished, new Date());
    }).toThrowError(/should start new round/);
  });

  test("throw error if round can not finished", () => {
    let [game] = create({
      id: createId("id"),
      name: "name",
      joinedPlayers: [{ user: User.createId("new"), mode: GamePlayer.UserMode.normal }],
      owner: User.createId("user"),
      finishedRounds: [],
      cards,
    });

    expect(() => {
      showDown(game, new Date());
    }).toThrowError(/Can not finish round/);
  });
});

import { test, expect, describe } from "vitest";
import { changeName, create, createId, declarePlayerTo, GameCreated, newRound, NewRoundStarted } from "./game";
import * as SelectableCards from "./selectable-cards";
import * as StoryPoint from "./story-point";
import * as User from "./user";
import * as Round from "./round";
import * as UserHand from "./user-hand";
import * as GamePlayer from "./game-player";

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

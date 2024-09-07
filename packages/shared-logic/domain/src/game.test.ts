import { test, expect, describe } from "vitest";
import {
  acceptLeaveFrom,
  applyNewRound,
  changeName,
  create,
  createId,
  declarePlayerAs,
  GameCreated,
  joinUserAsPlayer,
  makeInvitation,
  newRound,
  NewRoundStarted,
  UserLeftFromGame,
} from "./game.js";
import * as SelectableCards from "./selectable-cards.js";
import * as StoryPoint from "./story-point.js";
import * as User from "./user.js";
import * as Round from "./round.js";
import * as UserEstimation from "./user-estimation.js";
import * as GamePlayer from "./game-player.js";
import * as Invitation from "./invitation.js";
import { DOMAIN_EVENTS } from "./event.js";

const cards = SelectableCards.create([1, 2].map(StoryPoint.create));

test("get aggregate and event when game created ", () => {
  const [game, event] = create({
    id: createId("id"),
    name: "name",
    owner: User.createId("user"),
    cards,
    round: Round.createId(),
  });

  expect(game.id).toBe(createId("id"));
  expect(game.id).toBe((event as GameCreated).gameId);
  expect((event as GameCreated).createdBy).toBe(User.createId("user"));
  expect((event as GameCreated).name).toBe("name");
  expect(game.name).toBe("name");
  expect(game.joinedPlayers).toHaveLength(1);
  expect(game.joinedPlayers).toEqual([
    GamePlayer.createOwner({ user: User.createId("user"), mode: GamePlayer.UserMode.Normal }),
  ]);
  expect(game.owner).toEqual(User.createId("user"));
});

test("apply new round", () => {
  const [finishedRound] = Round.showDown(
    Round.roundOf({
      id: Round.createId(),
      cards: cards,
      estimations: [{ user: User.createId("user"), estimation: UserEstimation.giveUpOf() }],
    }),
    new Date()
  );

  const [game] = create({
    id: createId("id"),
    name: "name",
    round: finishedRound.id,
    owner: User.createId("user"),
    cards,
  });

  const updated = applyNewRound(game, Round.createId());

  expect(updated).not.toBe(finishedRound.id);
});

describe("game name", () => {
  const [game] = create({
    id: createId("id"),
    name: "name",
    owner: User.createId("user"),
    cards,
    round: Round.createId(),
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
      owner: User.createId("user"),
      cards,
      round: Round.createId(),
    });

    const changed = declarePlayerAs(game, User.createId("user"), GamePlayer.UserMode.Inspector);

    expect(changed.joinedPlayers[0]).toEqual(
      GamePlayer.create({
        type: GamePlayer.PlayerType.Owner,
        user: User.createId("user"),
        mode: GamePlayer.UserMode.Inspector,
      })
    );
  });

  test("should throw error if not joined user", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      owner: User.createId("user"),
      cards,
      round: Round.createId(),
    });

    const ret = declarePlayerAs(game, User.createId("not found"), GamePlayer.UserMode.Inspector);

    expect(ret).toEqual(game);
  });
});

describe("join user", () => {
  test("should be able to join user", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      owner: User.createId("user"),
      cards,
      round: Round.createId(),
    });

    const [changed, event] = joinUserAsPlayer(game, User.createId("new"), makeInvitation(game));

    expect(changed.joinedPlayers).toEqual(
      expect.arrayContaining([
        GamePlayer.create({
          type: GamePlayer.PlayerType.Owner,
          user: User.createId("user"),
          mode: GamePlayer.UserMode.Normal,
        }),
        GamePlayer.create({
          type: GamePlayer.PlayerType.Player,
          user: User.createId("new"),
          mode: GamePlayer.UserMode.Normal,
        }),
      ])
    );
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
      owner: User.createId("user"),
      cards,
      round: Round.createId(),
    });

    expect(() => {
      joinUserAsPlayer(game, User.createId("new"), "invitation" as Invitation.T);
    }).toThrowError(/signature is invalid/);
  });

  test("do not anything if a user already joined", () => {
    let [game] = create({
      id: createId("id"),
      name: "name",
      owner: User.createId("user"),
      cards,
      round: Round.createId(),
    });
    game = joinUserAsPlayer(game, User.createId("new"), makeInvitation(game))[0];

    expect(joinUserAsPlayer(game, User.createId("new"), makeInvitation(game))[0].joinedPlayers).toEqual(
      game.joinedPlayers
    );
  });
});

describe("leave", () => {
  test("should not do anything if user is not in game", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      owner: User.createId("user"),
      cards,
      round: Round.createId(),
    });

    const [ret] = acceptLeaveFrom(game, User.createId("not found"));

    expect(ret).toEqual(game);
  });

  test("remove user that want to leave from game", () => {
    let [game] = create({
      id: createId("id"),
      name: "name",
      owner: User.createId("user"),
      cards,
      round: Round.createId(),
    });
    game = joinUserAsPlayer(game, User.createId("new"), makeInvitation(game))[0];

    const [ret, event] = acceptLeaveFrom(game, User.createId("new"));

    expect(ret).not.toBe(game);
    expect(ret.joinedPlayers.map((v) => v.user)).not.toContainEqual(User.createId("new"));
    expect(ret.joinedPlayers).toHaveLength(1);
    expect(ret.joinedPlayers[0].user).toBe(User.createId("user"));
    expect(event!.kind).toBe(DOMAIN_EVENTS.UserLeftFromGame);
    expect((event as UserLeftFromGame).gameId).toBe(game.id);
  });

  test("can not leave owner from the game owner having", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      owner: User.createId("user"),
      cards,
      round: Round.createId(),
    });

    const [ret, event] = acceptLeaveFrom(game, User.createId("user"));

    expect(ret).toBe(game);
    expect(event).toBeUndefined();
  });
});

describe("new round", () => {
  test("get new round", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      owner: User.createId("user"),
      cards,
      round: Round.createId(),
    });

    const [changed, event] = newRound(game);

    expect(changed.points).toEqual(game.cards);
    expect((event as NewRoundStarted).gameId).toBe(game.id);
    expect((event as NewRoundStarted).roundId).toBe(changed.id);
    expect((event as NewRoundStarted).previousRoundId).toBe(game.round);
  });
});

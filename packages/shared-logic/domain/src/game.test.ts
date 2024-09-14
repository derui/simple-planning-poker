import { test, expect, describe } from "vitest";
import {
  acceptLeaveFrom,
  changeName,
  create,
  createId,
  declarePlayerAs,
  isGameCreated,
  isUserLeftFromGame,
  joinUserAsPlayer,
  makeInvitation,
} from "./game.js";
import * as ApplicablePoints from "./applicable-points.js";
import * as StoryPoint from "./story-point.js";
import * as User from "./user.js";
import * as Voting from "./voting.js";
import * as GamePlayer from "./game-player.js";
import * as Invitation from "./invitation.js";
import { DOMAIN_EVENTS } from "./event.js";

const points = ApplicablePoints.create([1, 2].map(StoryPoint.create));

test("get aggregate and event when game created ", () => {
  const [game, event] = create({
    id: createId("id"),
    name: "name",
    owner: User.createId("user"),
    points,
    voting: Voting.createId(),
  });

  expect(game.id).toBe(createId("id"));
  if (isGameCreated(event)) {
    expect(game.id).toBe(event.gameId);
    expect(event.createdBy).toBe(User.createId("user"));
    expect(event.name).toBe("name");
  } else {
    expect.fail("event should be GameCreated");
  }
  expect(game.name).toBe("name");
  expect(game.joinedPlayers).toHaveLength(1);
  expect(game.joinedPlayers).toEqual([
    GamePlayer.createOwner({ user: User.createId("user"), mode: GamePlayer.UserMode.Normal }),
  ]);
  expect(game.owner).toEqual(User.createId("user"));
});

describe("game name", () => {
  const [game] = create({
    id: createId("id"),
    name: "name",
    owner: User.createId("user"),
    points: points,
    voting: Voting.createId(),
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
      points: points,
      voting: Voting.createId(),
    });

    const changed = declarePlayerAs(game, User.createId("user"), GamePlayer.UserMode.Inspector);

    expect(changed.joinedPlayers[0]).toEqual(
      GamePlayer.createOwner({
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
      points: points,
      voting: Voting.createId(),
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
      points: points,
      voting: Voting.createId(),
    });

    const [changed, event] = joinUserAsPlayer(game, User.createId("new"), makeInvitation(game));

    expect(changed.joinedPlayers).toEqual(
      expect.arrayContaining([
        GamePlayer.createOwner({
          user: User.createId("user"),
          mode: GamePlayer.UserMode.Normal,
        }),
        GamePlayer.createPlayer({
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
      points: points,
      voting: Voting.createId(),
    });

    expect(() => {
      joinUserAsPlayer(game, User.createId("new"), Invitation.create("invitation"));
    }).toThrowError(/signature is invalid/);
  });

  test("do not anything if a user already joined", () => {
    let [game] = create({
      id: createId("id"),
      name: "name",
      owner: User.createId("user"),
      points: points,
      voting: Voting.createId(),
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
      points: points,
      voting: Voting.createId(),
    });

    const [ret] = acceptLeaveFrom(game, User.createId("not found"));

    expect(ret).toEqual(game);
  });

  test("remove user that want to leave from game", () => {
    let [game] = create({
      id: createId("id"),
      name: "name",
      owner: User.createId("user"),
      points: points,
      voting: Voting.createId(),
    });
    game = joinUserAsPlayer(game, User.createId("new"), makeInvitation(game))[0];

    const [ret, event] = acceptLeaveFrom(game, User.createId("new"));

    expect(ret).not.toBe(game);
    expect(ret.joinedPlayers.map((v) => v.user)).not.toContainEqual(User.createId("new"));
    expect(ret.joinedPlayers).toHaveLength(1);
    expect(ret.joinedPlayers[0].user).toBe(User.createId("user"));
    expect(event!.kind).toBe(DOMAIN_EVENTS.UserLeftFromGame);
    if (isUserLeftFromGame(event!)) {
      expect(event.gameId).toBe(game.id);
    } else {
      expect.fail("event should be UserLeftFromGame");
    }
  });

  test("can not leave owner from the game owner having", () => {
    const [game] = create({
      id: createId("id"),
      name: "name",
      owner: User.createId("user"),
      points: points,
      voting: Voting.createId(),
    });

    const [ret, event] = acceptLeaveFrom(game, User.createId("user"));

    expect(ret).toBe(game);
    expect(event).toBeUndefined();
  });
});

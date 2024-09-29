import { produce } from "immer";
import * as Base from "./base.js";
import * as DomainEvent from "./event.js";
import * as User from "./user.js";
import * as Invitation from "./invitation.js";
import * as ApplicablePoints from "./applicable-points.js";
import * as Voting from "./voting.js";
import * as GamePlayer from "./game-player.js";

const _tag = Symbol("game");
export type Id = Base.Id<typeof _tag>;

/**
 * create new ID for `Id`
 */
export const createId = function createGameId(v?: string): Id {
  return Base.create(v);
};

// Game is value object
export type T = {
  readonly id: Id;
  readonly name: string;
  readonly owner: User.Id;
  readonly joinedPlayers: GamePlayer.T[];
  readonly points: ApplicablePoints.T;
  readonly voting: Voting.Id;
};

export interface GameCreated extends DomainEvent.T {
  readonly kind: DomainEvent.DOMAIN_EVENTS.GameCreated;
  readonly gameId: Id;
  readonly owner: User.Id;
  readonly name: string;
  readonly createdBy: User.Id;
  readonly applicablePoints: ApplicablePoints.T;
  readonly voting: Voting.Id;
}

export const isGameCreated = function isGameCreated(event: DomainEvent.T): event is GameCreated {
  return event.kind === DomainEvent.DOMAIN_EVENTS.GameCreated;
};

export interface UserJoined extends DomainEvent.T {
  readonly kind: DomainEvent.DOMAIN_EVENTS.UserJoined;
  readonly gameId: Id;
  readonly userId: User.Id;
}

export const isUserJoined = function isUserJoined(event: DomainEvent.T): event is UserJoined {
  return event.kind === DomainEvent.DOMAIN_EVENTS.UserJoined;
};

export interface UserLeftFromGame extends DomainEvent.T {
  readonly kind: DomainEvent.DOMAIN_EVENTS.UserLeftFromGame;
  readonly gameId: Id;
  readonly userId: User.Id;
}

export const isUserLeftFromGame = function isUserLeftFromGame(event: DomainEvent.T): event is UserLeftFromGame {
  return event.kind === DomainEvent.DOMAIN_EVENTS.UserLeftFromGame;
};

export const create = ({
  id,
  name,
  points,
  owner,
  voting: voting,
  joinedPlayers,
}: {
  id: Id;
  name: string;
  owner: User.Id;
  points: ApplicablePoints.T;
  joinedPlayers?: GamePlayer.T[];
  voting: Voting.Id;
}): [T, DomainEvent.T] => {
  const distinctedPlayers = new Map<User.Id, GamePlayer.T>();
  if (!joinedPlayers) {
    distinctedPlayers.set(owner, GamePlayer.createOwner({ user: owner, mode: GamePlayer.UserMode.Normal }));
  }

  const event: GameCreated = {
    kind: DomainEvent.DOMAIN_EVENTS.GameCreated,
    gameId: id,
    owner,
    name: name,
    createdBy: owner,
    applicablePoints: points,
    voting: voting,
  };

  const game = {
    id,
    name,
    points,
    owner,
    joinedPlayers: joinedPlayers ?? Array.from(distinctedPlayers.values()),
    voting: voting,
  } satisfies T;

  return [game, event];
};

/**
 * make invitation for this game. A signature created this function is used to join user in this game.
 */
export const makeInvitation = function makeInvitation(game: T) {
  return Invitation.create(game.id);
};

export const canChangeName = function canChangeName(name: string) {
  return name.trim() !== "";
};

export const changeName = function changeName(game: T, name: string) {
  if (!canChangeName(name)) {
    throw new Error("can not change name");
  }

  return produce(game, (draft) => {
    draft.name = name.trim();
  });
};

/**
 * Declare player mode from notification
 */
export const declarePlayerAs = function declarePlayerAs(game: T, user: User.Id, mode: GamePlayer.UserMode): T {
  return produce(game, (draft) => {
    const player = draft.joinedPlayers.findIndex((v) => v.user === user);
    if (player === -1) {
      return;
    }

    draft.joinedPlayers[player].mode = mode;
  });
};

/**
 * Join a new user to the game with invitation
 */
export const joinUserAsPlayer = function joinUserAsPlayer(
  game: T,
  user: User.Id,
  invitation: Invitation.T
): [T, DomainEvent.T] {
  if (invitation !== makeInvitation(game)) {
    throw new Error("This signature is invalid");
  }

  const newObj = produce(game, (draft) => {
    if (draft.joinedPlayers.some((v) => v.user === user)) {
      return;
    }

    draft.joinedPlayers.push(GamePlayer.createPlayer({ user, mode: GamePlayer.UserMode.Normal }));
  });

  const event: UserJoined = {
    kind: DomainEvent.DOMAIN_EVENTS.UserJoined,
    gameId: game.id,
    userId: user,
  };

  return [newObj, event];
};

/**
 * An user leave from this game
 */
export const acceptLeaveFrom = function acceptLeaveFrom(game: T, user: User.Id): [T, DomainEvent.T | undefined] {
  if (user === game.owner) {
    return [game, undefined];
  }

  const newObj = produce(game, (draft) => {
    draft.joinedPlayers = draft.joinedPlayers.filter((v) => v.user !== user);
  });

  const event: UserLeftFromGame = {
    kind: DomainEvent.DOMAIN_EVENTS.UserLeftFromGame,
    gameId: game.id,
    userId: user,
  };

  return [newObj, event];
};

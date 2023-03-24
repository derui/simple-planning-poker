import produce from "immer";
import * as Base from "./base";
import { DomainEvent, DOMAIN_EVENTS } from "./event";
import * as User from "./user";
import * as Invitation from "./invitation";
import * as SelectableCards from "./selectable-cards";
import * as Round from "./round";
import * as GamePlayer from "./game-player";

export type Id = Base.Id<"Game">;

export const createId = function createGameId(v?: string) {
  return Base.create<"Game">(v);
};

// Game is value object
export interface T {
  readonly id: Id;
  readonly name: string;
  readonly owner: User.Id;
  readonly joinedPlayers: GamePlayer.T[];
  readonly cards: SelectableCards.T;
  readonly round: Round.Id;
  readonly finishedRounds: Round.Id[];
}

export interface NewRoundStarted extends DomainEvent {
  readonly kind: "NewRoundStarted";
  readonly gameId: Id;
  readonly roundId: Round.Id;
}

export const isNewRoundStarted = function isNewRoundStarted(event: DomainEvent): event is NewRoundStarted {
  return event.kind === "NewRoundStarted";
};

export interface GameCreated extends DomainEvent {
  readonly kind: "GameCreated";
  gameId: Id;
  owner: User.Id;
  name: string;
  createdBy: User.Id;
  selectableCards: SelectableCards.T;
  round: Round.Id;
}

export const isGameCreated = function isGameCreated(event: DomainEvent): event is GameCreated {
  return event.kind === "GameCreated";
};

export interface UserJoined extends DomainEvent {
  readonly kind: "UserJoined";
  gameId: Id;
  userId: User.Id;
}

export const isUserJoined = function isUserJoined(event: DomainEvent): event is UserJoined {
  return event.kind === "UserJoined";
};

export interface UserLeftFromGame extends DomainEvent {
  readonly kind: "UserLeftFromGame";
  gameId: Id;
  userId: User.Id;
}

export const isUserLeftFromGame = function isUserLeftFromGame(event: DomainEvent): event is UserLeftFromGame {
  return event.kind === "UserLeftFromGame";
};

export const create = ({
  id,
  name,
  cards,
  owner,
  round,
  finishedRounds,
  joinedPlayers,
}: {
  id: Id;
  name: string;
  owner: User.Id;
  cards: SelectableCards.T;
  joinedPlayers?: GamePlayer.T[];
  round: Round.Id;
  finishedRounds: Round.Id[];
}): [T, DomainEvent] => {
  const distinctedPlayers = new Map<User.Id, any>();
  if (!joinedPlayers) {
    distinctedPlayers.set(
      owner,
      GamePlayer.create({ type: GamePlayer.PlayerType.owner, user: owner, mode: GamePlayer.UserMode.normal })
    );
  }

  const event: GameCreated = {
    kind: "GameCreated",
    gameId: id,
    owner,
    name: name,
    createdBy: owner,
    selectableCards: cards,
    round,
  };

  const game = {
    id,
    name,
    cards,
    owner,
    joinedPlayers: joinedPlayers ?? Array.from(distinctedPlayers.values()),
    round,
    finishedRounds,
  };

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
 * apply new round
 */
export const applyNewRound = function applyNewRound(game: T, round: Round.Id): T {
  return produce(game, (draft) => {
    draft.finishedRounds.push(draft.round);

    draft.round = round;
  });
};

export const declarePlayerAs = function declarePlayerAs(game: T, user: User.Id, mode: GamePlayer.UserMode): T {
  return produce(game, (draft) => {
    const player = draft.joinedPlayers.findIndex((v) => v.user === user);
    if (player === -1) {
      return;
    }

    draft.joinedPlayers[player].mode = mode;
  });
};

export const joinUserAsPlayer = function joinUserAsPlayer(
  game: T,
  user: User.Id,
  invitation: Invitation.T
): [T, DomainEvent] {
  if (invitation !== makeInvitation(game)) {
    throw new Error("This signature is invalid");
  }

  const newObj = produce(game, (draft) => {
    if (draft.joinedPlayers.some((v) => v.user === user)) {
      return;
    }

    draft.joinedPlayers.push(
      GamePlayer.create({ type: GamePlayer.PlayerType.player, user, mode: GamePlayer.UserMode.normal })
    );
  });

  const event: UserJoined = {
    kind: DOMAIN_EVENTS.UserJoined,
    gameId: game.id,
    userId: user,
  };

  return [newObj, event];
};

export const newRound = function newRound(game: T): [Round.T, DomainEvent] {
  const newRound = Round.roundOf({
    id: Round.createId(),
    cards: game.cards,
  });

  const event: NewRoundStarted = {
    kind: DOMAIN_EVENTS.NewRoundStarted,
    gameId: game.id,
    roundId: newRound.id,
  };

  return [newRound, event];
};

/**
 * An user leave from this round
 */
export const acceptLeaveFrom = function acceptLeaveFrom(game: T, user: User.Id): [T, DomainEvent | undefined] {
  if (user === game.owner) {
    return [game, undefined];
  }

  const newObj = produce(game, (draft) => {
    draft.joinedPlayers = draft.joinedPlayers.filter((v) => v.user !== user);
  });

  const event: UserLeftFromGame = {
    kind: DOMAIN_EVENTS.UserLeftFromGame,
    gameId: game.id,
    userId: user,
  };

  return [newObj, event];
};

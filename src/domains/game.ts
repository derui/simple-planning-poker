import produce from "immer";
import * as Base from "./base";
import { DomainEvent, DOMAIN_EVENTS } from "./event";
import * as User from "./user";
import * as Invitation from "./invitation";
import * as SelectableCards from "./selectable-cards";
import * as Round from "./round";
import * as GamePlayer from "./game-player";
import * as UserHand from "./user-hand";

export type Id = Base.Id<"Game">;

export const createId = function createGameId(v?: string) {
  return Base.create<"Game">(v);
};

// Game is value object
export interface T {
  readonly id: Id;
  readonly name: string;
  readonly joinedPlayers: GamePlayer.T[];
  readonly owner: User.Id;
  readonly cards: SelectableCards.T;
  readonly round: Round.T;
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
}

export const isGameCreated = function isGameCreated(event: DomainEvent): event is GameCreated {
  return event.kind === "GameCreated";
};

export interface UserJoined extends DomainEvent {
  readonly kind: "UserJoined";
  gameId: Id;
  userId: User.Id;
}

export const create = ({
  id,
  name,
  joinedPlayers,
  cards,
  owner,
  round,
  finishedRounds,
}: {
  id: Id;
  name: string;
  joinedPlayers: GamePlayer.T[];
  owner: User.Id;
  cards: SelectableCards.T;
  round?: Round.T;
  finishedRounds: Round.Id[];
}): [T, DomainEvent] => {
  const distinctedPlayers = new Map(joinedPlayers.map((v) => [v.user, v]));
  if (!distinctedPlayers.has(owner)) {
    distinctedPlayers.set(owner, { user: owner, mode: GamePlayer.UserMode.normal });
  }

  const event: GameCreated = {
    kind: "GameCreated",
    gameId: id,
    owner,
    name: name,
    createdBy: owner,
    selectableCards: cards,
  };

  const game = {
    id,
    name,
    cards,
    owner,
    joinedPlayers: Array.from(distinctedPlayers.values()),
    round:
      round ??
      Round.roundOf({
        id: Round.createId(),
        cards: cards,
        count: 1,
        hands: [],
        joinedPlayers: Array.from(distinctedPlayers.values()),
      }),
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

export const newRound = function newRound(game: T): [T, DomainEvent] {
  if (Round.isRound(game.round)) {
    throw new Error("Can not open new round because it is not finished yet");
  }

  const newObj = produce(game, (draft) => {
    draft.round = Round.roundOf({
      id: Round.createId(),
      count: game.round.count + 1,
      cards: game.cards,
      joinedPlayers: game.joinedPlayers,
    });

    draft.finishedRounds.push(game.round.id);
  });

  const event: NewRoundStarted = {
    kind: DOMAIN_EVENTS.NewRoundStarted,
    gameId: game.id,
    roundId: newObj.round.id,
  };

  return [newObj, event];
};

export const declarePlayerTo = function declarePlayerTo(game: T, user: User.Id, mode: GamePlayer.UserMode): T {
  const joinedUser = game.joinedPlayers.find((v) => v.user === user);

  if (!joinedUser) {
    throw new Error("The user didn't join game");
  }

  return produce(game, (draft) => {
    const map = new Map(draft.joinedPlayers.map((v) => [v.user, v]));
    map.set(user, { user, mode });

    draft.joinedPlayers = Array.from(map.values());
  });
};

export const joinUser = function joinUser(game: T, user: User.Id, invitation: Invitation.T): [T, DomainEvent] {
  if (invitation !== makeInvitation(game)) {
    throw new Error("This signature is invalid");
  }

  if (game.joinedPlayers.some((v) => v.user === user)) {
    throw new Error("A player already joined");
  }

  const newObj = produce(game, (draft) => {
    draft.joinedPlayers.push({ user, mode: GamePlayer.UserMode.normal });
    draft.round = Round.joinPlayer(draft.round, user);
  });

  const event: UserJoined = {
    kind: DOMAIN_EVENTS.UserJoined,
    gameId: game.id,
    userId: user,
  };

  return [newObj, event];
};

/**
 * An user leave from this game
 */
export const acceptLeaveFrom = function acceptLeaveFrom(game: T, user: User.Id): T {
  if (game.joinedPlayers.every((v) => v.user !== user)) {
    return game;
  }

  return produce(game, (draft) => {
    draft.joinedPlayers = draft.joinedPlayers.filter((v) => v.user !== user);
  });
};

export const isShowedDown = function isShowedDown(game: T) {
  return Round.isFinishedRound(game.round);
};

/**
 * show down current round of the game
 */
export const showDown = function showDown(game: T, now: Date): [T, DomainEvent] {
  const round = game.round;
  if (!Round.isRound(round)) {
    throw new Error("Can not show down. should start new round");
  }

  const [finishedRound, event] = Round.showDown(round, now);

  return [
    produce(game, (draft) => {
      draft.round = finishedRound;
    }),
    event,
  ];
};

export const acceptPlayerHand = function acceptPlayerHand(game: T, userId: User.Id, hand: UserHand.T): T {
  const round = game.round;
  if (!Round.isRound(round)) {
    throw new Error("Can not accept hand to finished round");
  }

  let updated = round;
  if (UserHand.isHanded(hand)) {
    updated = Round.takePlayerCard(round, userId, hand.card);
  } else if (UserHand.isGiveUp(hand)) {
    updated = Round.acceptPlayerToGiveUp(round, userId);
  }

  return produce(game, (draft) => {
    draft.round = updated;
  });
};

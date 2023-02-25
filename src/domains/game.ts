import produce from "immer";
import * as Base from "./base";
import { DomainEvent, DOMAIN_EVENTS, GenericDomainEvent } from "./event";
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
  readonly joinedPlayers: GamePlayer.T[];
  readonly owner: User.Id;
  readonly cards: SelectableCards.T;
  readonly round: Round.T;
  readonly finishedRounds: Round.Id[];
}

export interface NewRoundStarted extends DomainEvent<"NewRoundStarted"> {
  readonly gameId: Id;
  readonly roundId: Round.Id;
}

export interface GameCreated extends DomainEvent<"GameCreated"> {
  gameId: Id;
  name: string;
  createdBy: User.Id;
  selectableCards: SelectableCards.T;
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
}): [T, GenericDomainEvent] => {
  const distinctedPlayers = new Map(joinedPlayers.map((v) => [v.user, v]));
  if (!distinctedPlayers.has(owner)) {
    distinctedPlayers.set(owner, { user: owner, mode: GamePlayer.UserMode.normal });
  }

  const event: GameCreated = {
    kind: "GameCreated",
    gameId: id,
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
        selectableCards: cards,
        count: 1,
        hands: [],
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

export const newRound = function newRound(game: T): [T, GenericDomainEvent] {
  if (Round.isRound(game.round)) {
    throw new Error("Can not open new round because it is not finished yet");
  }

  const newObj = produce(game, (draft) => {
    draft.round = Round.roundOf({ id: Round.createId(), count: game.round.count + 1, selectableCards: game.cards });

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

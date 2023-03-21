import produce from "immer";
import * as Base from "./base";
import { DomainEvent, DOMAIN_EVENTS } from "./event";
import * as User from "./user";
import * as Invitation from "./invitation";
import * as SelectableCards from "./selectable-cards";
import * as Round from "./round";
import * as GamePlayer from "./game-player";
import * as UserEstimation from "./user-estimation";

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

export const isUserJoined = function isUserJoined(event: DomainEvent): event is UserJoined {
  return event.kind === "UserJoined";
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
  round?: Round.T;
  finishedRounds: Round.Id[];
}): [T, DomainEvent] => {
  const distinctedPlayers = new Map<User.Id, any>();
  if (!round) {
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
  };

  const game = {
    id,
    name,
    cards,
    owner,
    joinedPlayers: joinedPlayers ?? Array.from(distinctedPlayers.values()),
    round:
      round ??
      Round.roundOf({
        id: Round.createId(),
        cards: cards,
        count: 1,
        estimations: [],
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
      joinedPlayers: game.round.joinedPlayers,
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

export const declarePlayerAs = function declarePlayerAs(game: T, user: User.Id, mode: GamePlayer.UserMode): T {
  const round = game.round;
  if (!Round.isRound(round)) {
    return game;
  }

  return produce(game, (draft) => {
    draft.round = Round.changeUserMode(round, user, mode);
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
    draft.joinedPlayers.push(
      GamePlayer.create({ type: GamePlayer.PlayerType.player, user, mode: GamePlayer.UserMode.normal })
    );
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
 * An user leave from this round
 */
export const acceptLeaveFrom = function acceptLeaveFrom(game: T, user: User.Id): T {
  const round = game.round;
  return produce(game, (draft) => {
    draft.joinedPlayers = draft.joinedPlayers.filter((v) => v.user !== user);

    if (Round.isRound(round)) {
      draft.round = Round.acceptLeaveFrom(round, user);
    }
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

export const acceptPlayerEstimation = function acceptPlayerEstimation(
  game: T,
  userId: User.Id,
  estimation: UserEstimation.T
): T {
  const round = game.round;
  if (!Round.isRound(round)) {
    throw new Error("Can not accept estimation to finished round");
  }

  let updated = round;
  if (UserEstimation.isEstimated(estimation)) {
    updated = Round.takePlayerEstimation(round, userId, estimation.card);
  } else if (UserEstimation.isGiveUp(estimation)) {
    updated = Round.acceptPlayerToGiveUp(round, userId);
  }

  return produce(game, (draft) => {
    draft.round = updated;
  });
};

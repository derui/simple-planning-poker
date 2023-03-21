import produce from "immer";
import * as UserEstimation from "./user-estimation";
import * as User from "./user";
import * as Card from "./card";
import * as SelectableCards from "./selectable-cards";
import * as GamePlayer from "./game-player";
import { Branded, DateTime, dateTimeToString } from "./type";
import { DomainEvent, DOMAIN_EVENTS } from "./event";
import { UserMode } from "./game-player";
import * as Base from "@/domains/base";

/**
 * Id of round
 */
export type Id = Base.Id<"RoundId">;

interface PlayerEstimation {
  readonly user: User.Id;
  readonly estimation: UserEstimation.T;
}

const _calculatedStoryPoint = Symbol();
type CalculatedStoryPoint = Branded<number, typeof _calculatedStoryPoint>;

const _finishedRound = "FinishedRound";
const _round = "Round";

interface CommonRound {
  readonly id: Id;
  readonly count: number;
  readonly estimations: Record<User.Id, UserEstimation.T>;
  readonly joinedPlayers: GamePlayer.T[];
  readonly cards: SelectableCards.T;
}

/**
 * A type for finished round. This type can not any mutate.
 */
export interface FinishedRound extends CommonRound {
  readonly _tag: typeof _finishedRound;
  readonly finishedAt: DateTime;
}

/**
 * A type for active round. This type can mutate.
 */
export interface Round extends CommonRound {
  readonly _tag: typeof _round;
}

export type T = Round | FinishedRound;

export interface RoundFinished extends DomainEvent {
  readonly kind: "RoundFinished";
  roundId: Id;
}

// functions

export const createId = function createId(id?: string): Id {
  return Base.create<"RoundId">(id);
};

/**
 * create `Round`.Game domain and infrastructure are only allowed using this.
 */
export const roundOf = function roundOf({
  id,
  cards,
  count,
  joinedPlayers,
  estimations = [],
}: {
  id: Id;
  cards: SelectableCards.T;
  count: number;
  estimations?: PlayerEstimation[];
  joinedPlayers: GamePlayer.T[];
}): Round {
  return {
    _tag: _round,
    id,
    count,
    estimations: Object.fromEntries(estimations.map((v) => [v.user, v.estimation])),
    cards: SelectableCards.clone(cards),
    joinedPlayers,
  };
};

/**
 * create `FinishedRound`.Game domain and infrastructure are only allowed using this.
 */
export const finishedRoundOf = function finishedRoundOf({
  id,
  cards,
  count,
  estimations,
  finishedAt,
  joinedPlayers,
}: {
  id: Id;
  cards: SelectableCards.T;
  count: number;
  finishedAt: DateTime;
  estimations: PlayerEstimation[];
  joinedPlayers: GamePlayer.T[];
}): FinishedRound {
  return {
    _tag: _finishedRound,
    id,
    count,
    estimations: Object.fromEntries(estimations.map((v) => [v.user, v.estimation])),
    finishedAt,
    cards: SelectableCards.clone(cards),
    joinedPlayers,
  };
};

/**
 * Player take the estimation to round.
 */
export const takePlayerEstimation = function takePlayerEstimation(round: Round, userId: User.Id, card: Card.T) {
  if (!SelectableCards.contains(round.cards, card)) {
    throw new Error("Can not accept this card");
  }

  const estimations = Object.assign({}, round.estimations);

  estimations[userId] = UserEstimation.estimated(card);

  return produce(round, (draft) => {
    draft.estimations = estimations;
  });
};

/**
 * Round accepts player to give up in this round.
 */
export const acceptPlayerToGiveUp = function acceptPlayerToGiveUp(round: Round, userId: User.Id) {
  return produce(round, (draft) => {
    draft.estimations[userId] = UserEstimation.giveUp();
  });
};

export const canShowDown = function canShowDown(round: T) {
  if (isFinishedRound(round)) {
    return false;
  }

  if (Object.keys(round.estimations).length === 0) {
    return false;
  }

  return true;
};

/**
 * finish a round. Throw error if round has no estimation.
 */
export const showDown = function showDown(round: Round, now: Date): [FinishedRound, DomainEvent] {
  if (!canShowDown(round)) {
    throw new Error("Can not finish round because it has no estimation");
  }

  const estimations = Object.entries(round.estimations).map(([user, estimation]) => {
    return {
      user: user as User.Id,
      estimation,
    };
  });

  const event: RoundFinished = {
    kind: DOMAIN_EVENTS.RoundFinished,
    roundId: round.id,
  };
  return [finishedRoundOf({ ...round, finishedAt: dateTimeToString(now), estimations: estimations }), event];
};

/**
 * calculate averate on round.
 */
export const calculateAverage = function calculateAverage(round: FinishedRound) {
  const cards = Object.values(round.estimations)
    .filter(UserEstimation.isEstimated)
    .map((v) => v.card);

  if (cards.length === 0) {
    return 0 as CalculatedStoryPoint;
  }

  const average =
    cards.reduce((point, v) => {
      return point + v;
    }, 0) / cards.length;

  return average as CalculatedStoryPoint;
};

/**
 * join player into current round.
 */
export const joinPlayer = function joinPlayer(round: T, player: User.Id) {
  if (round._tag !== _round) {
    return round;
  }

  const ret = produce(round, (draft) => {
    if (draft.joinedPlayers.some((v) => v.user === player)) {
      return;
    }

    draft.joinedPlayers.push(
      GamePlayer.create({ type: GamePlayer.PlayerType.player, user: player, mode: UserMode.normal })
    );
  });

  return ret;
};

/**
 * change user mode in round.
 */
export const changeUserMode = function changeUserMode(round: Round, user: User.Id, mode: GamePlayer.UserMode): T {
  const joinedUser = round.joinedPlayers.find((v) => v.user === user);

  if (!joinedUser) {
    throw new Error("The user didn't join game");
  }

  return produce(round, (draft) => {
    const map = new Map(draft.joinedPlayers.map((v) => [v.user, v]));
    const target = map.get(user);

    if (!target) {
      map.set(user, GamePlayer.create({ type: GamePlayer.PlayerType.player, user, mode }));
    } else {
      map.set(user, { ...target, mode });
    }

    draft.joinedPlayers = Array.from(map.values());
  });
};

/**
 * An user leave from this round
 */
export const acceptLeaveFrom = function acceptLeaveFrom(round: Round, user: User.Id): T {
  if (round.joinedPlayers.every((v) => v.user !== user)) {
    return round;
  }

  return produce(round, (draft) => {
    draft.joinedPlayers = draft.joinedPlayers.filter((v) => v.user !== user);
  });
};

// simple guards
export const isRound = function isRound(obj: T): obj is Round {
  return obj._tag === _round;
};

export const isFinishedRound = function isFinishedRound(obj: T): obj is FinishedRound {
  return obj._tag === _finishedRound;
};

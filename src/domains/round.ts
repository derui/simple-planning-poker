import * as Base from "@/domains/base";
import * as UserHand from "./user-hand";
import * as User from "./user";
import * as Card from "./card";
import * as SelectableCards from "./selectable-cards";
import produce from "immer";
import { Branded, DateTime, dateTimeToString } from "./type";
import { GenericDomainEvent, DOMAIN_EVENTS, DomainEvent } from "./event";

/**
 * Id of round
 */
export type Id = Base.Id<"RoundId">;

interface PlayerHand {
  readonly user: User.Id;
  readonly hand: UserHand.T;
}

const _calculatedStoryPoint = Symbol();
type CalculatedStoryPoint = Branded<number, typeof _calculatedStoryPoint>;

const _finishedRound = Symbol();
const _round = Symbol();

/**
 * A type for finished round. This type can not any mutate.
 */
export type FinishedRound = {
  readonly _tag: typeof _finishedRound;
  readonly id: Id;
  readonly count: number;
  readonly hands: Map<User.Id, UserHand.T>;
  readonly finishedAt: DateTime;
};

/**
 * A type for active round. This type can mutate.
 */
export type Round = {
  readonly _tag: typeof _round;
  readonly id: Id;
  readonly count: number;
  readonly hands: Map<User.Id, UserHand.T>;
  readonly selectableCards: SelectableCards.T;
};

export type T = Round | FinishedRound;

export interface RoundFinished extends DomainEvent<"RoundFinished"> {
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
  selectableCards,
  count,
  hands = [],
}: {
  id: Id;
  selectableCards: SelectableCards.T;
  count: number;
  hands?: PlayerHand[];
}): Round {
  return {
    _tag: _round,
    id,
    count,
    hands: new Map(hands.map((v) => [v.user, v.hand])),
    selectableCards: SelectableCards.clone(selectableCards),
  };
};

/**
 * create `FinishedRound`.Game domain and infrastructure are only allowed using this.
 */
export const finishedRoundOf = function finishedRoundOf({
  id,
  count,
  hands,
  finishedAt,
}: {
  id: Id;
  count: number;
  finishedAt: DateTime;
  hands: PlayerHand[];
}): FinishedRound {
  return {
    _tag: _finishedRound,
    id,
    count,
    hands: new Map(hands.map((v) => [v.user, v.hand])),
    finishedAt,
  };
};

/**
 * Player take the hand to round.
 */
export const takePlayerCard = function takePlayerCard(round: Round, userId: User.Id, card: Card.T) {
  if (!SelectableCards.contains(round.selectableCards, card)) {
    throw new Error("Can not accept this card");
  }

  const hands = new Map(round.hands.entries());

  hands.set(userId, UserHand.handed(card));

  return produce(round, (draft) => {
    draft.hands = hands;
  });
};

/**
 * Round accepts player to give up in this round.
 */
export const acceptPlayerToGiveUp = function acceptPlayerToGiveUp(round: Round, userId: User.Id) {
  const hands = new Map(round.hands.entries());

  hands.set(userId, UserHand.giveUp());

  return produce(round, (draft) => {
    draft.hands = hands;
  });
};

/**
 * finish a round. Throw error if round has no hand.
 */
export const showDown = function showDown(round: Round, now: Date): [FinishedRound, GenericDomainEvent] {
  if (round.hands.size === 0) {
    throw new Error("Can not finish round because it has no hand");
  }

  const hands = Array.from(round.hands.entries()).map(([user, hand]) => {
    return {
      user,
      hand,
    };
  });

  const event: RoundFinished = {
    kind: DOMAIN_EVENTS.RoundFinished,
    roundId: round.id,
  };
  return [finishedRoundOf({ id: round.id, count: round.count, finishedAt: dateTimeToString(now), hands }), event];
};

/**
 * calculate averate on round.
 */
export const calculateAverage = function calculateAverage(round: FinishedRound) {
  const cards = Array.from(round.hands.values())
    .filter(UserHand.isHanded)
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

// simple guards
export const isRound = function isRound(obj: T): obj is Round {
  return obj._tag === _round;
};

export const isFinishedRound = function isFinishedRound(obj: T): obj is FinishedRound {
  return obj._tag === _finishedRound;
};

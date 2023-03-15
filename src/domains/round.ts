import produce from "immer";
import * as UserHand from "./user-hand";
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

interface PlayerHand {
  readonly user: User.Id;
  readonly hand: UserHand.T;
}

const _calculatedStoryPoint = Symbol();
type CalculatedStoryPoint = Branded<number, typeof _calculatedStoryPoint>;

const _finishedRound = "FinishedRound";
const _round = "Round";

interface CommonRound {
  readonly id: Id;
  readonly count: number;
  readonly hands: Record<User.Id, UserHand.T>;
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
  hands = [],
  joinedPlayers = [],
}: {
  id: Id;
  cards: SelectableCards.T;
  count: number;
  hands?: PlayerHand[];
  joinedPlayers?: GamePlayer.T[];
}): Round {
  return {
    _tag: _round,
    id,
    count,
    hands: Object.fromEntries(hands.map((v) => [v.user, v.hand])),
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
  hands,
  finishedAt,
  joinedPlayers = [],
}: {
  id: Id;
  cards: SelectableCards.T;
  count: number;
  finishedAt: DateTime;
  hands: PlayerHand[];
  joinedPlayers?: GamePlayer.T[];
}): FinishedRound {
  return {
    _tag: _finishedRound,
    id,
    count,
    hands: Object.fromEntries(hands.map((v) => [v.user, v.hand])),
    finishedAt,
    cards: SelectableCards.clone(cards),
    joinedPlayers,
  };
};

/**
 * Player take the hand to round.
 */
export const takePlayerCard = function takePlayerCard(round: Round, userId: User.Id, card: Card.T) {
  if (!SelectableCards.contains(round.cards, card)) {
    throw new Error("Can not accept this card");
  }

  const hands = Object.assign({}, round.hands);

  hands[userId] = UserHand.handed(card);

  return produce(round, (draft) => {
    draft.hands = hands;
  });
};

/**
 * Round accepts player to give up in this round.
 */
export const acceptPlayerToGiveUp = function acceptPlayerToGiveUp(round: Round, userId: User.Id) {
  return produce(round, (draft) => {
    draft.hands[userId] = UserHand.giveUp();
  });
};

export const canShowDown = function canShowDown(round: T) {
  if (isFinishedRound(round)) {
    return false;
  }

  if (Object.keys(round.hands).length === 0) {
    return false;
  }

  return true;
};

/**
 * finish a round. Throw error if round has no hand.
 */
export const showDown = function showDown(round: Round, now: Date): [FinishedRound, DomainEvent] {
  if (!canShowDown(round)) {
    throw new Error("Can not finish round because it has no hand");
  }

  const hands = Object.entries(round.hands).map(([user, hand]) => {
    return {
      user: user as User.Id,
      hand,
    };
  });

  const event: RoundFinished = {
    kind: DOMAIN_EVENTS.RoundFinished,
    roundId: round.id,
  };
  return [finishedRoundOf({ ...round, finishedAt: dateTimeToString(now), hands }), event];
};

/**
 * calculate averate on round.
 */
export const calculateAverage = function calculateAverage(round: FinishedRound) {
  const cards = Object.values(round.hands)
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

/**
 * join player into current round.
 */
export const joinPlayer = function joinPlayer(round: T, player: User.Id) {
  if (round._tag !== _round) {
    return round;
  }

  const ret = produce(round, (draft) => {
    draft.joinedPlayers.push(
      GamePlayer.create({ type: GamePlayer.PlayerType.player, user: player, mode: UserMode.normal })
    );
  });

  return ret;
};

// simple guards
export const isRound = function isRound(obj: T): obj is Round {
  return obj._tag === _round;
};

export const isFinishedRound = function isFinishedRound(obj: T): obj is FinishedRound {
  return obj._tag === _finishedRound;
};

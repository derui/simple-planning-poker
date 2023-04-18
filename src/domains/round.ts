import { produce } from "immer";
import * as UserEstimation from "./user-estimation";
import * as User from "./user";
import * as SelectableCards from "./selectable-cards";
import { Branded, DateTime, dateTimeToString } from "./type";
import { DomainEvent, DOMAIN_EVENTS } from "./event";
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
  readonly estimations: Record<User.Id, UserEstimation.T>;
  readonly cards: SelectableCards.T;
  readonly theme: string | null;
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
  estimations = [],
  theme,
}: {
  id: Id;
  cards: SelectableCards.T;
  estimations?: PlayerEstimation[];
  theme?: string;
}): Round {
  return {
    _tag: _round,
    id,
    estimations: Object.fromEntries(estimations.map((v) => [v.user, v.estimation])),
    cards: SelectableCards.clone(cards),
    theme: !theme ? null : theme,
  };
};

/**
 * create `FinishedRound`.Game domain and infrastructure are only allowed using this.
 */
export const finishedRoundOf = function finishedRoundOf({
  id,
  cards,
  estimations,
  finishedAt,
  theme,
}: {
  id: Id;
  cards: SelectableCards.T;
  finishedAt: DateTime;
  estimations: PlayerEstimation[];
  theme?: string;
}): FinishedRound {
  return {
    _tag: _finishedRound,
    id,
    estimations: Object.fromEntries(estimations.map((v) => [v.user, v.estimation])),
    finishedAt,
    cards: SelectableCards.clone(cards),
    theme: !theme ? null : theme,
  };
};

/**
 * Player take the estimation to round.
 */
export const takePlayerEstimation = function takePlayerEstimation(
  round: T,
  userId: User.Id,
  estimation: UserEstimation.T
) {
  if (isFinishedRound(round)) {
    return round;
  }

  if (UserEstimation.isEstimated(estimation) && !SelectableCards.contains(round.cards, estimation.card)) {
    throw new Error("Can not accept this card");
  }

  return produce(round, (draft) => {
    draft.estimations[userId] = estimation;
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
  return [
    finishedRoundOf({
      ...round,
      finishedAt: dateTimeToString(now),
      estimations: estimations,
      theme: round.theme ?? undefined,
    }),
    event,
  ];
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
 * change theme of round.
 */
export const changeTheme = function changeTheme(round: T, theme: string): T {
  if (round._tag === _finishedRound) {
    return round;
  }

  return produce(round, (draft) => {
    if (theme) {
      draft.theme = theme;
    } else {
      draft.theme = null;
    }
  });
};

// simple guards
export const isRound = function isRound(obj: T): obj is Round {
  return obj._tag === _round;
};

export const isFinishedRound = function isFinishedRound(obj: T): obj is FinishedRound {
  return obj._tag === _finishedRound;
};

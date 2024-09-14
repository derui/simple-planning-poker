import { castDraft, produce } from "immer";
import * as UserEstimation from "./user-estimation.js";
import * as User from "./user.js";
import * as ApplicablePoints from "./applicable-points.js";
import * as Estimations from "./estimations.js";
import * as Event from "./event.js";
import * as Base from "./base.js";

const _tag = Symbol();
type tag = typeof _tag;

/**
 * Id of round
 */
export type Id = Base.Id<tag>;

export enum VotingStatus {
  /**
   * Waiting vote from users
   */
  Voting,

  /**
   * Voting is finished, and revealed
   */
  Revealed,
}

export type T = {
  readonly id: Id;
  readonly estimations: Estimations.T;
  readonly points: ApplicablePoints.T;
  readonly theme: string | null;
  readonly status: VotingStatus;
};

/**
 * event when raised at new round started
 */
export interface VotingStarted extends Event.T {
  readonly kind: Event.DOMAIN_EVENTS.VotingStarted;
  readonly votingId: Id;
}

export const isVotingStarted = function isVotingStarted(event: Event.T): event is VotingStarted {
  return event.kind === Event.DOMAIN_EVENTS.VotingStarted;
};

export interface VotingRevealed extends Event.T {
  readonly kind: Event.DOMAIN_EVENTS.VotingRevealed;
  readonly votingId: Id;
}

export const isVotingRevealed = function isVotingRevealed(event: Event.T): event is VotingRevealed {
  return event.kind === Event.DOMAIN_EVENTS.VotingRevealed;
};

// functions
export const createId = function createId(id?: string): Id {
  return Base.create<tag>(id);
};

/**
 * create `Voting`.Game domain and infrastructure are only allowed using this.
 */
export const votingOf = function votingOf({
  id,
  points,
  estimations,
  theme,
}: {
  id: Id;
  points: ApplicablePoints.T;
  estimations: Estimations.T;
  theme?: string;
}): T {
  return {
    id,
    estimations,
    points: ApplicablePoints.clone(points),
    theme: !theme ? null : theme,
    status: VotingStatus.Voting,
  } satisfies T;
};

/**
 * create `Voting` after revealed. Game domain and infrastructure are only allowed using this.
 */
export const revealedOf = function revealedOf({
  id,
  points,
  estimations,
  theme,
}: {
  id: Id;
  points: ApplicablePoints.T;
  estimations: Estimations.T;
  theme?: string;
}): T {
  return {
    id,
    estimations,
    points: ApplicablePoints.clone(points),
    theme: !theme ? null : theme,
    status: VotingStatus.Revealed,
  } satisfies T;
};

export const reset = function reset(obj: T): [T, Event.T] {
  const newObj = produce(obj, (draft) => {
    draft.estimations = castDraft(Estimations.reset(obj.estimations));
    draft.status = VotingStatus.Voting;
  });

  const event: VotingStarted = {
    kind: Event.DOMAIN_EVENTS.VotingStarted,
    votingId: obj.id,
  };

  return [newObj, event];
};

/**
 * Player take the estimation to voting.
 */
export const takePlayerEstimation = function takePlayerEstimation(
  voting: T,
  userId: User.Id,
  estimation: UserEstimation.T
) {
  if (UserEstimation.isSubmitted(estimation) && !ApplicablePoints.contains(voting.points, estimation.point)) {
    throw new Error("Can not accept this card");
  }

  return produce(voting, (draft) => {
    draft.estimations = castDraft(Estimations.update(draft.estimations, userId, estimation));
  });
};

export const canReveal = function canReveal(voting: T) {
  if (!Estimations.isLeastOneEstimation(voting.estimations) || voting.status == VotingStatus.Revealed) {
    return false;
  }

  return true;
};

/**
 * finish a voting. Throw error if voting has no estimation.
 */
export const reveal = function reveal(voting: T): [T, Event.T] {
  if (!canReveal(voting)) {
    throw new Error("Can not reveal this voting because it has no estimation");
  }

  const event: VotingRevealed = {
    kind: Event.DOMAIN_EVENTS.VotingRevealed,
    votingId: voting.id,
  };
  return [
    produce(voting, (draft) => {
      draft.status = VotingStatus.Revealed;
    }),
    event,
  ];
};

/**
 * change theme of voting.
 */
export const changeTheme = function changeTheme(voting: T, theme: string): T {
  return produce(voting, (draft) => {
    if (theme) {
      draft.theme = theme;
    } else {
      draft.theme = null;
    }
  });
};

import { castDraft, produce } from "immer";
import * as ApplicablePoints from "./applicable-points.js";
import * as Base from "./base.js";
import * as Estimations from "./estimations.js";
import * as Event from "./event.js";
import * as UserEstimation from "./user-estimation.js";
import * as User from "./user.js";
import * as VoterType from "./voter-type.js";
import * as Voter from "./voter.js";

const _tag: unique symbol = Symbol();
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
  /**
   * Id of voting
   */
  readonly id: Id;

  /**
   * Current estimations in this voting
   */
  readonly estimations: Estimations.T;

  /**
   * Applicable points in this voting
   */
  readonly points: ApplicablePoints.T;

  /**
   * theme of this voting
   */
  readonly theme?: string;

  /**
   * Status of this voting
   */
  readonly status: VotingStatus;

  /**
   * voters who currently participated
   */
  readonly participatedVoters: Voter.T[];
};

/**
 * event when raised at voting is started
 */
export interface VotingStarted extends Event.T {
  readonly kind: Event.DOMAIN_EVENTS.VotingStarted;
  readonly votingId: Id;
}

export const isVotingStarted = function isVotingStarted(event: Event.T): event is VotingStarted {
  return event.kind === Event.DOMAIN_EVENTS.VotingStarted;
};

/**
 * event when raised at voting is revealed
 */
export interface VotingRevealed extends Event.T {
  readonly kind: Event.DOMAIN_EVENTS.VotingRevealed;
  readonly votingId: Id;
}

export const isVotingRevealed = function isVotingRevealed(event: Event.T): event is VotingRevealed {
  return event.kind === Event.DOMAIN_EVENTS.VotingRevealed;
};

/**
 * event when raised at voting is revealed
 */
export interface VoterJoined extends Event.T {
  readonly kind: Event.DOMAIN_EVENTS.VoterJoined;
  readonly votingId: Id;
  readonly userId: User.Id;
}

export const isVoterJoined = function isVoterJoined(event: Event.T): event is VoterJoined {
  return event.kind === Event.DOMAIN_EVENTS.VoterJoined;
};

/**
 * event that raises if voter is changed in voting
 */
export interface VoterChanged extends Event.T {
  readonly kind: Event.DOMAIN_EVENTS.VoterChanged;
  readonly votingId: Id;
  readonly userId: User.Id;
  readonly voterType: VoterType.T;
}

export const isVoterChanged = function isVoterChanged(event: Event.T): event is VoterChanged {
  return event.kind === Event.DOMAIN_EVENTS.VoterChanged;
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
  voters,
}: {
  id: Id;
  points: ApplicablePoints.T;
  estimations: Estimations.T;
  theme?: string;
  voters: Voter.T[];
}): T {
  if (voters.length == 0) {
    throw new Error("Can not create voting with empty voters");
  }

  return {
    id,
    estimations,
    points: ApplicablePoints.clone(points),
    theme,
    status: VotingStatus.Voting,
    participatedVoters: voters,
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
  voters,
}: {
  id: Id;
  points: ApplicablePoints.T;
  estimations: Estimations.T;
  theme?: string;
  voters: Voter.T[];
}): T {
  if (voters.length == 0) {
    throw new Error("Can not create voting with empty voters");
  }

  return {
    id,
    estimations,
    points: ApplicablePoints.clone(points),
    theme,
    status: VotingStatus.Revealed,
    participatedVoters: voters,
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
): T {
  if (!voting.participatedVoters.find((v) => v.user == userId)) {
    throw new Error("Can not accept not participated voter");
  }

  if (UserEstimation.isSubmitted(estimation) && !ApplicablePoints.contains(voting.points, estimation.point)) {
    throw new Error("Can not accept this card");
  }

  return produce(voting, (draft) => {
    draft.estimations = castDraft(Estimations.update(draft.estimations, userId, estimation));
  });
};

export const canReveal = function canReveal(voting: T): boolean {
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
      draft.theme = undefined;
    }
  });
};

/**
 * Join user to voting
 */
export const joinUser = function joinUser(voting: T, user: User.Id): [T, Event.T | undefined] {
  if (voting.participatedVoters.some((v) => v.user == user)) {
    return [voting, undefined];
  }

  const newObj = produce(voting, (draft) => {
    draft.participatedVoters.push(Voter.createVoter({ user }));
  });

  const event: VoterJoined = { kind: Event.DOMAIN_EVENTS.VoterJoined, votingId: newObj.id, userId: user };

  return [newObj, event];
};

/**
 * Voter changed in the voting
 */
export const updateVoter = function updateVoter(voting: T, voter: Voter.T): [T, Event.T] {
  if (!voting.participatedVoters.some((v) => v.user == voter.user)) {
    throw new Error("Can not update voter that have not joined");
  }

  const newObj = produce(voting, (draft) => {
    const index = draft.participatedVoters.findIndex((v) => v.user == voter.user);

    draft.participatedVoters[index] = voter;
  });

  const event: VoterChanged = {
    kind: Event.DOMAIN_EVENTS.VoterChanged,
    votingId: newObj.id,
    userId: voter.user,
    voterType: voter.type,
  };

  return [newObj, event];
};

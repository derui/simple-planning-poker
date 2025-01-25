import { castDraft, Draft, produce } from "immer";
import * as ApplicablePoints from "./applicable-points.js";
import * as Base from "./base.js";
import * as DomainEvent from "./event.js";
import * as GameName from "./game-name.js";
import { Estimations, Voter, Voting } from "./index.js";
import * as User from "./user.js";

const _tag: unique symbol = Symbol("game");
export type Id = Base.Id<typeof _tag>;

/**
 * create new ID for `Id`
 */
export const createId = function createGameId(v?: string): Id {
  return Base.create(v);
};

// Game is value object
export type T = {
  readonly id: Id;
  readonly name: string;
  readonly owner: User.Id;
  readonly points: ApplicablePoints.T;
};

export interface GameCreated extends DomainEvent.T {
  readonly kind: DomainEvent.DOMAIN_EVENTS.GameCreated;
  readonly gameId: Id;
  readonly owner: User.Id;
  readonly name: string;
  readonly createdBy: User.Id;
  readonly applicablePoints: ApplicablePoints.T;
}

export interface VotingStarted extends DomainEvent.T {
  readonly kind: DomainEvent.DOMAIN_EVENTS.VotingStarted;
  readonly votingId: Voting.Id;
}

export const isGameCreated = function isGameCreated(event: DomainEvent.T): event is GameCreated {
  return event.kind === DomainEvent.DOMAIN_EVENTS.GameCreated;
};

export const isVotingStarted = function isVotingStarted(event: DomainEvent.T): event is VotingStarted {
  return event.kind === DomainEvent.DOMAIN_EVENTS.VotingStarted;
};

export const create = ({
  id,
  name,
  points,
  owner,
}: {
  id: Id;
  name: GameName.T;
  owner: User.Id;
  points: ApplicablePoints.T;
}): [T, DomainEvent.T] => {
  const event: GameCreated = {
    kind: DomainEvent.DOMAIN_EVENTS.GameCreated,
    gameId: id,
    owner,
    name: name,
    createdBy: owner,
    applicablePoints: points,
  };

  const game = {
    id,
    name,
    points,
    owner,
  } satisfies T;

  return [game, event];
};

export const canChangeName = function canChangeName(name: string): boolean {
  return name.trim() !== "";
};

export const changeName = function changeName(game: T, name: string): T {
  if (!canChangeName(name)) {
    throw new Error("can not change name");
  }

  return produce(game, (draft) => {
    draft.name = name.trim();
  });
};

export const changePoints = function changePoints(game: T, points: ApplicablePoints.T): T {
  return produce(game, (draft: Draft<T>) => {
    draft.points = castDraft<ApplicablePoints.T>(points);
  });
};

/**
 * Create new voting from this game.
 */
export const newVoting = function newVoting(game: T): [Voting.T, DomainEvent.T] {
  const id = Voting.createId();

  const voting = Voting.votingOf({
    id,
    points: game.points,
    estimations: Estimations.empty(),
    voters: [Voter.createVoter({ user: game.owner })],
  });

  const event: VotingStarted = {
    kind: DomainEvent.DOMAIN_EVENTS.VotingStarted,
    votingId: voting.id,
  };

  return [voting, event];
};

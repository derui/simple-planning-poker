import { castDraft, produce, WritableDraft } from "immer";
import * as Base from "./base.js";
import * as DomainEvent from "./event.js";
import * as User from "./user.js";
import * as ApplicablePoints from "./applicable-points.js";

const _tag = Symbol("game");
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

export const isGameCreated = function isGameCreated(event: DomainEvent.T): event is GameCreated {
  return event.kind === DomainEvent.DOMAIN_EVENTS.GameCreated;
};

export const create = ({
  id,
  name,
  points,
  owner,
}: {
  id: Id;
  name: string;
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

export const changePoints = function changePoints(game: T, points: ApplicablePoints.T): T {
  return produce(game, (draft: WritableDraft<T>) => {
    draft.points = castDraft<ApplicablePoints.T>(points);
  });
};

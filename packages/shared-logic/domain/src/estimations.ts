import * as User from "./user.js";
import * as Base from "./base.js";
import * as StoryPoint from "./story-point.js";
import * as UserEstimation from "./user-estimation.js";
import { Branded, Unbranded } from "./type.js";
import { unique } from "@spp/shared-array";
import { produce } from "immer";

const _tag: unique symbol = Symbol();

/**
 * Estimation of average
 */
export type AverageEstimation = Branded<number, typeof _tag>;

/**
 * Type of all estimations
 */
export type T = {
  readonly userEstimations: ReadonlyMap<User.Id, UserEstimation.T>;
};

/**
 * Create new estimation object
 */
export const create = function create(users: User.Id[]): T {
  if (!isValid(users)) {
    throw new Error("Can not create estimation");
  }

  const userEstimations = new Map();
  for (const user of users) {
    userEstimations.set(user, UserEstimation.unsubmitOf());
  }

  return Object.freeze({
    userEstimations,
  });
};

/**
 * Get resetted estimations with same user.
 */
export const reset = function reset(obj: T): T {
  const newMap = new Map();
  for (const user of obj.userEstimations.keys()) {
    newMap.set(user, UserEstimation.unsubmitOf());
  }

  return { userEstimations: newMap };
};

/**
 * Return argument is valid or not
 */
export const isValid = function isValid(users: User.Id[]) {
  return unique(users, Base.isEqual).length > 0;
};

/**
 * Return the estimations have least one estimation from user.
 */
export const isLeastOneEstimation = function isLeastOneEstimation(obj: T) {
  return Array.from(obj.userEstimations.values()).some((v) => !UserEstimation.isUnsubmit(v));
};

/**
 * Update estimations with user estimation
 */
export const update = function update(obj: T, user: User.Id, estimation: UserEstimation.T): T {
  const users = Array.from(obj.userEstimations.keys());

  if (!users.find((v) => Base.isEqual(v, user))) {
    throw new Error("The user can not be contained in estimations");
  }

  return produce(obj, (draft) => {
    draft.userEstimations.set(user, estimation);

    return draft;
  });
};

/**
 * Calculate averate estimation
 */
export const calculateAverate = function calculateAverate(obj: T): AverageEstimation {
  const estimations = Array.from(obj.userEstimations.values());

  const average =
    estimations.reduce((accum, v) => {
      const point = UserEstimation.estimatedPoint(v) ?? StoryPoint.create(0);
      return accum + StoryPoint.value(point);
    }, 0) / estimations.length;

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return average as AverageEstimation;
};

/**
 * Unwrap `AverageEstimation`
 */
export const averageEstimation = function averageEstimation(
  v: AverageEstimation
): Unbranded<AverageEstimation, typeof _tag> {
  return v;
};

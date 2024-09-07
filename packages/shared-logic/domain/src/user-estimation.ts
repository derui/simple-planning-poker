import * as StoryPoint from "./story-point.js";
import { Branded } from "./type.js";

const _tag = Symbol();
type tag = typeof _tag;

const unsubmit: unique symbol = Symbol();
type unsubmit = typeof unsubmit;

const giveup: unique symbol = Symbol();
type giveup = typeof giveup;

const submitted: unique symbol = Symbol();
type submitted = typeof submitted;

type Unsubmit = {
  readonly _tag: unsubmit;
};

type Giveup = {
  readonly _tag: giveup;
};

interface Submitted {
  readonly _tag: submitted;
  point: StoryPoint.T;
}

export type T = Branded<Unsubmit | Giveup | Submitted, tag>;

/**
 * Get `Unsubmit` status of estimation
 */
export const unsubmitOf = function unsubmitOf(): T {
  return <T>{ _tag: unsubmit };
};

/**
 * Get `Giveup` status of estimation
 */
export const giveUpOf = function giveUpOf(): T {
  return <T>{ _tag: giveup };
};

/**
 * Get `Submitted` status of estimation
 */
export const submittedOf = function submittedOf(point: StoryPoint.T): T {
  return <T>{
    _tag: submitted,
    point: point,
  };
};

/**
 * Get estimated point from `obj` .
 */
export const estimatedPoint = function estimatedPoint(obj: T): StoryPoint.T | undefined {
  if (isSubmitted(obj)) {
    return obj.point;
  } else {
    return;
  }
};

type Kind = "unsubmit" | "giveup" | "submitted";

const kindOf = function kindOf(estimation: T): Kind {
  switch (estimation._tag) {
    case giveup:
      return "giveup";
    case submitted:
      return "submitted";
    case unsubmit:
      return "unsubmit";
    default:
      throw new Error("unknown estimation");
  }
};

/**
 * Type guard for `Submitted`
 */
export const isSubmitted = function isSubmitted(estimation: T): estimation is Branded<Submitted, typeof _tag> {
  return kindOf(estimation) === "submitted";
};

/**
 * Type guard for `Giveup`
 */
export const isGiveUp = function isGiveUp(estimation: T): estimation is Branded<Giveup, typeof _tag> {
  return kindOf(estimation) === "giveup";
};

/**
 * Type guard for `Unsubmit`
 */
export const isUnsubmit = function isUnsubmit(estimation: T): estimation is Branded<Unsubmit, typeof _tag> {
  return kindOf(estimation) === "unsubmit";
};

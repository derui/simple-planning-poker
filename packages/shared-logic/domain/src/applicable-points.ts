import * as StoryPoint from "./story-point.js";
import { Branded } from "./type.js";
import { unique } from "@spp/shared-array";

const _tag = Symbol("ApplicablePoints");

type internal = Readonly<StoryPoint.T[]>;
export type T = Branded<never, typeof _tag>;

/**
   create selectable cards with numbers
 */
export const create = function createApplicablePoints(numbers: StoryPoint.T[]): T {
  if (!isValidStoryPoints(numbers)) {
    throw new Error("Length must be greater than 0");
  }

  const points = unique(numbers, StoryPoint.isEqual).sort(StoryPoint.compare);

  return Object.freeze(Array.from(points)) as T;
};

/**
 * Pick applicable story point `storyPoint` from `obj`.
 */
export const pick = function pick(obj: T, storyPoint: StoryPoint.T): StoryPoint.T | undefined {
  if (contains(obj, storyPoint)) {
    return storyPoint;
  } else {
    return;
  }
};

/**
 * clone the cards;
 */
export const clone = function clone(obj: T) {
  const value: internal = obj;

  return Object.freeze(Array.from(value)) as T;
};

export const contains = function contains(obj: T, point: StoryPoint.T) {
  const value: internal = obj;

  return value.some((v) => StoryPoint.isEqual(v, point));
};

export const isValidStoryPoints = (points: StoryPoint.T[]): boolean => {
  const uniqued = unique(points, StoryPoint.isEqual);
  return uniqued.length > 0;
};

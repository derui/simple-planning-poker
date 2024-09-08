import * as StoryPoint from "./story-point.js";
import { unique } from "@spp/shared-array";

export type T = ReadonlyArray<StoryPoint.T>;

/**
   create selectable cards with numbers
 */
export const create = function createApplicablePoints(numbers: StoryPoint.T[]): T {
  if (!isValidStoryPoints(numbers)) {
    throw new Error("Length must be greater than 0");
  }

  const points = unique(numbers, StoryPoint.isEqual).sort(StoryPoint.compare);

  return Object.freeze(Array.from(points));
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
  return Object.freeze(Array.from(obj));
};

export const contains = function contains(obj: T, point: StoryPoint.T) {
  return obj.some((v) => StoryPoint.isEqual(v, point));
};

export const isValidStoryPoints = (points: StoryPoint.T[]): boolean => {
  const uniqued = unique(points, StoryPoint.isEqual);
  return uniqued.length > 0;
};

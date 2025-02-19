import { unique } from "@spp/shared-array";
import { filterUndefined } from "@spp/shared-basic";
import * as StoryPoint from "./story-point.js";

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
export const clone = function clone(obj: T): T {
  return Object.freeze(Array.from(obj));
};

export const contains = function contains(obj: T, point: StoryPoint.T): boolean {
  return obj.some((v) => StoryPoint.isEqual(v, point));
};

export const isValidStoryPoints = (points: StoryPoint.T[]): boolean => {
  const uniqued = unique(points, StoryPoint.isEqual);
  return uniqued.length > 0;
};

/**
 * parse the story points;
 */
export const parse = function parse(obj: string): T | undefined {
  const split = obj.split(",").map((v) => v.trim());

  const points = split
    .map((v) => {
      try {
        return StoryPoint.parse(v);
      } catch (e) {
        return;
      }
    })
    .filter(filterUndefined);

  if (split.length != points.length) {
    return;
  }

  return create(points);
};

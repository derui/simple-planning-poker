import * as StoryPoint from "./story-point";
import { Branded } from "./type";

const tag = Symbol("card");

interface Internal {
  storyPoint: number;
}

/**
 * Type of `Card`. This type can not generate from other package.
 */
export type T = Branded<Internal, typeof tag>;

/**
 * factory function for Card
 */
export const create = (storyPoint: StoryPoint.T): T => {
  return { storyPoint: StoryPoint.value(storyPoint) } as T;
};

export const equals = (v1: T, v2: T) => {
  return v1.storyPoint === v2.storyPoint;
};

/**
 * Get a story point of the card
 */
export const storyPoint = (card: T): StoryPoint.T => StoryPoint.create(card.storyPoint);

/**
 * Get string representation of card
 */
export const toString = function toString(card: T) {
  return `Card(${card.storyPoint})`;
};

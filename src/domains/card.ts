import * as StoryPoint from "./story-point";
import { Branded } from "./type";

const tag = Symbol("card");
export type T = Branded<number, typeof tag>;

/**
   factory function for StoryPointCard
 */
export const create = (storyPoint: StoryPoint.T): T => {
  return StoryPoint.value(storyPoint) as T;
};

export const equals = (v1: T, v2: T) => {
  return v1 === v2;
};

export const asStoryPoint = (card: T): StoryPoint.T => StoryPoint.create(card);

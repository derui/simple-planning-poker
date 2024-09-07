import * as Card from "./card.js";
import * as StoryPoint from "./story-point.js";
import { Branded } from "./type.js";
import { unique } from "@spp/shared-array";

const _tag = Symbol("SelectableCards");
export type T = Branded<Card.T[], typeof _tag>;

/**
   create selectable cards with numbers
 */
export const create = function createSelectableCards(numbers: StoryPoint.T[]): T {
  if (!isValidStoryPoints(numbers)) {
    throw new Error("Length must be greater than 0");
  }

  const cards = unique(numbers, StoryPoint.isEqual).sort(StoryPoint.compare).map(Card.create);

  return Object.freeze(Array.from(cards)) as T;
};

/**
 * clone the cards;
 */
export const clone = function clone(cards: T) {
  return Object.freeze(Array.from(cards)) as T;
};

export const contains = function contains(cards: T, card: Card.T) {
  return cards.some((v) => Card.isEqual(v, card));
};

export const isValidStoryPoints = (numbers: StoryPoint.T[]): boolean => {
  const uniqued = unique(numbers, StoryPoint.isEqual);
  return uniqued.length > 0;
};

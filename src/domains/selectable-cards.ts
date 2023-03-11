import * as Card from "./card";
import * as StoryPoint from "./story-point";
import { Branded } from "./type";
import { unique } from "@/utils/array";

const Tag = Symbol("SelectableCards");
export type T = Branded<Card.T[], typeof Tag>;

/**
   create selectable cards with numbers
 */
export const create = function createSelectableCards(numbers: StoryPoint.T[]): T {
  if (!isValidStoryPoints(numbers)) {
    throw new Error("Length must be greater than 0");
  }

  const cards = unique(numbers, StoryPoint.equals).sort(StoryPoint.compare).map(Card.create);

  return Object.freeze(Array.from(cards)) as T;
};

/**
 * clone the cards;
 */
export const clone = function clone(cards: T) {
  return Object.freeze(Array.from(cards)) as T;
};

export const contains = function contains(cards: T, card: Card.T) {
  return cards.some((v) => Card.equals(v, card));
};

export const isValidStoryPoints = (numbers: StoryPoint.T[]): boolean => {
  const uniqued = unique(numbers, StoryPoint.equals);
  return uniqued.length > 0;
};

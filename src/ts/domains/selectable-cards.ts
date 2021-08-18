import { unique } from "@/utils/array";
import { Card, createGiveUpCard, createStoryPointCard } from "./card";
import { compareStoryPoint, equalStoryPoint, StoryPoint } from "./story-point";

export interface SelectableCards {
  cards: Card[];
}

/**
   create selectable cards with numbers
 */
export const createSelectableCards = (numbers: StoryPoint[]): SelectableCards => {
  if (numbers.length <= 0) {
    throw new Error("Length must be greater than 0");
  }

  const cards: Card[] = unique(numbers, equalStoryPoint).sort(compareStoryPoint).map(createStoryPointCard);
  cards.push(createGiveUpCard());

  return {
    cards,
  };
};

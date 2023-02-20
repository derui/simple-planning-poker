import { unique } from "@/utils/array";
import { Card, createGiveUpCard, createStoryPointCard, equalCard } from "./card";
import { compareStoryPoint, equalStoryPoint, StoryPoint } from "./story-point";

export interface SelectableCards {
  get cards(): Card[];
  at(index: number): Card;
  get giveUp(): Card;

  contains(card: Card): boolean;
}

/**
   create selectable cards with numbers
 */
export const createSelectableCards = (numbers: StoryPoint[]): SelectableCards => {
  if (!isValidStoryPoints(numbers)) {
    throw new Error("Length must be greater than 0");
  }

  const cards: Card[] = unique(numbers, equalStoryPoint).sort(compareStoryPoint).map(createStoryPointCard);
  cards.push(createGiveUpCard());

  return {
    get cards() {
      return cards;
    },
    at(index: number) {
      return cards[index];
    },
    get giveUp() {
      return cards[cards.length - 1];
    },
    contains(card: Card) {
      return cards.some((v) => equalCard(v, card));
    },
  };
};

export const isValidStoryPoints = (numbers: StoryPoint[]): boolean => {
  const uniqued = unique(numbers, equalStoryPoint);
  return uniqued.length > 0;
};

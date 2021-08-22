import { Card, createGiveUpCard, createStoryPointCard } from "@/domains/card";
import { createStoryPoint } from "@/domains/story-point";

export type SerializedCard =
  | {
      kind: "giveup";
    }
  | { kind: "storypoint"; storypoint: number };

export const serializeCard = (card: Card): SerializedCard => {
  switch (card.kind) {
    case "giveup":
      return { kind: "giveup" };
    case "storypoint":
      return { kind: "storypoint", storypoint: card.storyPoint.value };
  }
};

export const deserializeCard = (card: SerializedCard): Card => {
  switch (card.kind) {
    case "giveup":
      return createGiveUpCard();
    case "storypoint":
      return createStoryPointCard(createStoryPoint(card.storypoint));
  }
};
